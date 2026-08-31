import { createSocket } from "dgram";
import { connect } from "net";
import { lookup } from "dns";
import { promisify } from "util";

const dnsLookup = promisify(lookup);

export interface ServerStatus {
  online: boolean;
  players: number;
  maxPlayers: number;
  version: string;
  motd: string;
  motdHtml: string;
  playerList: string[];
  queryTime: number;
}

const HOST = process.env.MINECRAFT_SERVER_HOST || "45.138.48.34";
const GAME_PORT = Number(process.env.MINECRAFT_SERVER_PORT) || 26954;
const QUERY_PORT = Number(process.env.MINECRAFT_QUERY_PORT) || 26954;
const TIMEOUT_MS = 8_000;
const MAX_RETRIES = 2;

// ─── MOTD Color Mapping ─────────────────────────────────────────────

const MC_COLORS: Record<string, string> = {
  "0": "#000000", "1": "#0000AA", "2": "#00AA00", "3": "#00AAAA",
  "4": "#AA0000", "5": "#AA00AA", "6": "#FFAA00", "7": "#AAAAAA",
  "8": "#555555", "9": "#5555FF", "a": "#55FF55", "b": "#55FFFF",
  "c": "#FF5555", "d": "#FF55FF", "e": "#FFFF55", "f": "#FFFFFF",
};

const MC_COLOR_NAMES: Record<string, string> = {
  black: "#000000", dark_blue: "#0000AA", dark_green: "#00AA00", dark_aqua: "#00AAAA",
  dark_red: "#AA0000", dark_purple: "#AA00AA", gold: "#FFAA00", gray: "#AAAAAA",
  dark_gray: "#555555", blue: "#5555FF", green: "#55FF55", aqua: "#55FFFF",
  red: "#FF5555", light_purple: "#FF55FF", yellow: "#FFFF55", white: "#FFFFFF",
  reset: "",
};

function debug(msg: string, ...args: unknown[]) {
  console.log(`[MC-Query] ${msg}`, ...args);
}

async function resolveHost(host: string): Promise<string> {
  try {
    const result = await dnsLookup(host);
    debug("DNS resolved %s → %s (IPv%s)", host, result.address, result.family);
    return result.address;
  } catch (err) {
    debug("DNS failed for %s: %s — using raw", host, err instanceof Error ? err.message : String(err));
    return host;
  }
}

/**
 * Parse a MOTD string containing § color codes into HTML spans.
 * Handles \n as <br> and strips formatting codes (§k, §l, §m, §n, §o, §r).
 */
export function motdToHtml(raw: string): string {
  if (!raw) return "";

  // Decode unicode escapes (\\n → newline, etc.)
  const decoded = raw.replace(/\\n/g, "\n").replace(/\\u003d/g, "=");

  let html = "";
  let currentColor = "";
  let isBold = false;

  const chars = decoded.split("");
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]!;
    if (ch === "§" && i + 1 < chars.length) {
      const code = chars[i + 1]!.toLowerCase();
      i++; // skip the code char
      if (code in MC_COLORS) {
        currentColor = MC_COLORS[code]!;
        isBold = false;
      } else if (code === "l") {
        isBold = true;
      } else if (code === "r") {
        currentColor = "";
        isBold = false;
      }
      // Ignore formatting codes k, m, n, o (not renderable in HTML)
      continue;
    }
    if (ch === "\n") {
      html += "<br/>";
      continue;
    }
    if (currentColor || isBold) {
      const style = [];
      if (currentColor) style.push(`color:${currentColor}`);
      if (isBold) style.push("font-weight:bold");
      html += `<span style="${style.join(";")}">${escapeHtml(ch)}</span>`;
    } else {
      html += escapeHtml(ch);
    }
  }
  return html;
}

/**
 * Convert SLP JSON description (with "extra" array) into plain text and HTML.
 */
function parseDescription(desc: { text?: string; extra?: Array<{ text?: string; color?: string }> }): { text: string; html: string } {
  if (!desc) return { text: "", html: "" };

  // If it's just a simple text string
  if (desc.text && (!desc.extra || desc.extra.length === 0)) {
    return { text: desc.text, html: motdToHtml(desc.text) };
  }

  // Build from extra array — each segment may contain \n
  let text = desc.text ?? "";
  let html = desc.text ? motdToHtml(desc.text) : "";

  if (desc.extra) {
    for (const segment of desc.extra) {
      const t = segment.text ?? "";
      text += t;
      const color = segment.color ? (MC_COLOR_NAMES[segment.color] ?? segment.color) : "";
      // Process through motdToHtml to handle \n → <br/> and any § codes in the text
      const segmentHtml = motdToHtml(t);
      if (color) {
        // Wrap each line-break-separated piece in the color span
        const pieces = segmentHtml.split("<br/>");
        html += pieces
          .map((piece) => (piece ? `<span style="color:${color}">${piece}</span>` : ""))
          .join("<br/>");
      } else {
        html += segmentHtml;
      }
    }
  }

  return { text, html };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function makeOfflineStatus(): ServerStatus {
  return { online: false, players: 0, maxPlayers: 0, version: "", motd: "", motdHtml: "", playerList: [], queryTime: Date.now() };
}

// ─── GameSpy4 Query (UDP) ───────────────────────────────────────────

function buildChallengePacket(): Buffer {
  const magic = Buffer.from([0xf3, 0x86, 0x41, 0x68]);
  const padding = Buffer.alloc(6, 0x00);
  const queryStr = Buffer.alloc(16, 0x00);
  Buffer.from("query").copy(queryStr);
  return Buffer.concat([Buffer.from([0x00]), magic, padding, queryStr]);
}

function buildFullQueryPacket(challengeToken: number): Buffer {
  const magic = Buffer.from([0xf3, 0x86, 0x41, 0x68]);
  const padding = Buffer.alloc(6, 0x00);
  const tokenBuf = Buffer.alloc(4);
  tokenBuf.writeInt32BE(challengeToken);
  const queryStr = Buffer.alloc(16, 0x00);
  Buffer.from("query").copy(queryStr);
  return Buffer.concat([Buffer.from([0x00]), magic, padding, tokenBuf, queryStr]);
}

function parseFullQueryResponse(msg: Buffer): ServerStatus {
  if (msg.length < 13) {
    debug("GameSpy4 response too short: %d bytes", msg.length);
    return makeOfflineStatus();
  }

  let offset = 13;
  const statEnd = msg.indexOf(0x00, offset);
  if (statEnd === -1) {
    debug("GameSpy4: no null terminator in stat string");
    return makeOfflineStatus();
  }

  const statStr = msg.subarray(offset, statEnd).toString("utf-8");
  debug("GameSpy4 raw stats: %s", statStr);

  const parts = statStr.split("\x00");
  const stats: Record<string, string> = {};
  for (let i = 0; i < parts.length; i += 2) {
    if (i + 1 < parts.length) stats[parts[i]!] = parts[i + 1]!;
  }
  debug("GameSpy4 parsed: %j", stats);

  offset = statEnd + 1;
  const playerEnd = msg.indexOf(0x00, offset);
  const playerBytes = playerEnd !== -1 ? msg.subarray(offset, playerEnd) : msg.subarray(offset);
  const playerList = playerBytes.toString("utf-8").split("\x00").filter(Boolean);
  debug("GameSpy4 players (%d): %j", playerList.length, playerList);

  const motdRaw = stats.hostname ?? "";
  return {
    online: true,
    players: parseInt(stats.numplayers ?? "0", 10) || playerList.length,
    maxPlayers: parseInt(stats.maxplayers ?? "0", 10),
    version: stats.version ?? "",
    motd: motdRaw,
    motdHtml: motdToHtml(motdRaw),
    playerList,
    queryTime: Date.now(),
  };
}

async function gamespy4Query(host: string, port: number): Promise<ServerStatus> {
  const resolvedIp = await resolveHost(host);
  const socket = createSocket({ type: "udp4" });
  const cleanup = () => { try { socket.close(); } catch {} };

  return new Promise<ServerStatus>((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let step: "challenge" | "full" = "challenge";
    let challengeToken = 0;

    timeoutId = setTimeout(() => { cleanup(); reject(new Error("GameSpy4 timed out")); }, TIMEOUT_MS);
    socket.on("error", (err) => { clearTimeout(timeoutId); cleanup(); reject(err); });
    socket.on("close", () => { clearTimeout(timeoutId); reject(new Error("Socket closed")); });

    socket.on("message", (msg, rinfo) => {
      debug("GameSpy4 got %d bytes from %s:%d", msg.length, rinfo.address, rinfo.port);

      if (step === "challenge") {
        if (msg.length < 5) { clearTimeout(timeoutId); cleanup(); reject(new Error("Challenge response too short")); return; }
        challengeToken = msg.readInt32BE(1);
        debug("GameSpy4 challenge token: %d (0x%s)", challengeToken, challengeToken.toString(16));
        step = "full";
        const packet = buildFullQueryPacket(challengeToken);
        socket.send(packet, 0, packet.length, port, resolvedIp);
      } else if (step === "full") {
        clearTimeout(timeoutId); cleanup();
        resolve(parseFullQueryResponse(msg));
      }
    });

    const challengePacket = buildChallengePacket();
    debug("GameSpy4 → %s:%d (UDP)", resolvedIp, port);
    socket.send(challengePacket, 0, challengePacket.length, port, resolvedIp, (err) => {
      if (err) { clearTimeout(timeoutId); cleanup(); reject(err); }
    });
  });
}

// ─── SLP (TCP) Fallback ─────────────────────────────────────────────

function encodeVarInt(value: number): Buffer {
  const parts: number[] = [];
  let v = value;
  do {
    let byte = v & 0x7f;
    v >>>= 7;
    if (v !== 0) byte |= 0x80;
    parts.push(byte);
  } while (v !== 0);
  return Buffer.from(parts);
}

function encodeString(str: string): Buffer {
  const encoded = Buffer.from(str, "utf-8");
  return Buffer.concat([encodeVarInt(encoded.length), encoded]);
}

function readVarInt(buf: Buffer, offset: number): { value: number; newOffset: number } {
  let result = 0;
  let shift = 0;
  let pos = offset;
  while (pos < buf.length) {
    const byte = buf[pos]!;
    result |= (byte & 0x7f) << shift;
    pos++;
    if ((byte & 0x80) === 0) break;
    shift += 7;
  }
  return { value: result, newOffset: pos };
}

type SlpJson = {
  description?: { text?: string; extra?: Array<{ text?: string; color?: string }> };
  players?: { online?: number; max?: number; sample?: Array<{ name?: string }> };
  version?: { name?: string };
};

function parseSlpResponse(buf: Buffer): ServerStatus | null {
  if (buf.length < 3) return null;
  let offset = 0;

  const { value: packetLen, newOffset: afterLen } = readVarInt(buf, offset);
  offset = afterLen;
  if (buf.length < offset + packetLen) return null;

  const { value: packetId, newOffset: afterId } = readVarInt(buf, offset);
  offset = afterId;
  if (packetId !== 0x00) return null;

  const { value: jsonLen, newOffset: afterJsonLen } = readVarInt(buf, offset);
  offset = afterJsonLen;
  if (buf.length < offset + jsonLen) return null;

  const jsonStr = buf.toString("utf-8", offset, offset + jsonLen);
  debug("SLP raw JSON: %s", jsonStr);

  const json: SlpJson = JSON.parse(jsonStr);

  const { text: motdText, html: motdHtml } = parseDescription(json.description ?? {});
  const playerList = json.players?.sample?.map((p) => p.name ?? "").filter(Boolean) ?? [];

  debug("SLP MOTD text: %s", motdText);
  debug("SLP player list: %j", playerList);

  return {
    online: true,
    players: json.players?.online ?? 0,
    maxPlayers: json.players?.max ?? 0,
    version: json.version?.name ?? "",
    motd: motdText,
    motdHtml,
    playerList,
    queryTime: Date.now(),
  };
}

async function slpQuery(host: string, port: number): Promise<ServerStatus> {
  const resolvedIp = await resolveHost(host);

  return new Promise<ServerStatus>((resolve, reject) => {
    const socket = connect(port, resolvedIp);
    let timeoutId: ReturnType<typeof setTimeout>;
    let buffer = Buffer.alloc(0);

    const cleanup = () => { clearTimeout(timeoutId); socket.destroy(); };

    timeoutId = setTimeout(() => { cleanup(); reject(new Error("SLP timed out")); }, TIMEOUT_MS);

    socket.on("connect", () => {
      debug("SLP connected to %s:%d (TCP)", resolvedIp, port);
      const protocolVersion = encodeVarInt(767);
      const serverAddress = encodeString(host);
      const serverPort = Buffer.alloc(2);
      serverPort.writeUInt16BE(port);
      const nextState = encodeVarInt(1);
      const payload = Buffer.concat([protocolVersion, serverAddress, serverPort, nextState]);
      const handshake = Buffer.concat([encodeVarInt(0x00), payload]);
      const packet = Buffer.concat([encodeVarInt(handshake.length), handshake]);
      socket.write(packet);
      const statusReq = Buffer.concat([encodeVarInt(1), encodeVarInt(0x00)]);
      socket.write(statusReq);
    });

    socket.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      try {
        const result = parseSlpResponse(buffer);
        if (result) { cleanup(); resolve(result); }
      } catch {}
    });

    socket.on("error", (err) => { cleanup(); reject(err); });
    socket.on("close", () => { cleanup(); reject(new Error("SLP connection closed")); });
  });
}

// ─── Combined: GameSpy4 → SLP fallback ──────────────────────────────

export async function getServerStatus(): Promise<ServerStatus> {
  debug("Querying %s (game:%d query:%d)", HOST, GAME_PORT, QUERY_PORT);

  // Try GameSpy4 first
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      debug("GameSpy4 attempt %d/%d", attempt, MAX_RETRIES);
      const status = await gamespy4Query(HOST, QUERY_PORT);
      debug("GameSpy4 succeeded: online=%s players=%d/%d", status.online, status.players, status.maxPlayers);
      return status;
    } catch (err) {
      debug("GameSpy4 attempt %d failed: %s", attempt, err instanceof Error ? err.message : String(err));
      if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, 500));
    }
  }

  // Fallback to SLP
  debug("GameSpy4 failed — falling back to SLP (TCP) on port %d", GAME_PORT);
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      debug("SLP attempt %d/%d", attempt, MAX_RETRIES);
      const status = await slpQuery(HOST, GAME_PORT);
      debug("SLP succeeded: online=%s players=%d/%d version=%s motd=%s", status.online, status.players, status.maxPlayers, status.version, status.motd);
      return status;
    } catch (err) {
      debug("SLP attempt %d failed: %s", attempt, err instanceof Error ? err.message : String(err));
      if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, 500));
    }
  }

  debug("All queries failed — returning offline");
  return makeOfflineStatus();
}
