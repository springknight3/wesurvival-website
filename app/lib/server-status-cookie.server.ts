import { createCookie } from "react-router";
import { getServerStatus, type ServerStatus } from "./minecraft-server.server";

const COOKIE_NAME = "server-status";
const CACHE_MAX_AGE = 45; // seconds — how long a cached status stays valid

interface CachedStatus {
  data: ServerStatus;
  timestamp: number;
  lastMotd: string;
}

export const statusCookie = createCookie(COOKIE_NAME, {
  maxAge: CACHE_MAX_AGE,
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: true,
});

/**
 * Returns server status, using the client's cookie as a per-visitor cache.
 * If the cache is under 45s old, serves the cached value without re-querying.
 *
 * Hibernation detection: During AEGIS hibernation the server is still pingable
 * but its MOTD changes. We compare the current MOTD against the last-seen MOTD.
 * If they differ, the server is in a transitional (waking up) state.
 */
export async function getServerStatusCached(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const cached = (await statusCookie.parse(cookieHeader)) as CachedStatus | null;

  const now = Date.now();
  let freshStatus: ServerStatus | null = null;

  // Check if cache is still valid
  if (cached && now - cached.timestamp < CACHE_MAX_AGE * 1000) {
    freshStatus = cached.data;
  } else {
    // Re-query
    freshStatus = await getServerStatus();
  }

  // Hibernation detection: MOTD changed from last known good MOTD
  const lastMotd = cached?.lastMotd ?? "";
  const motdChanged = freshStatus.online && lastMotd !== "" && freshStatus.motd !== lastMotd;
  const isWakingUp = freshStatus.online && motdChanged;

  const statusText = isWakingUp
    ? "Waking up..."
    : freshStatus.online
      ? "Online"
      : "Offline";

  const result = {
    ...freshStatus,
    isWakingUp,
    statusText,
  };

  // Update the last known MOTD when server is online
  const newLastMotd = freshStatus.online ? freshStatus.motd : lastMotd;

  // Set cookie header for the response (only when we queried fresh)
  const setCookieHeader =
    cached && now - cached.timestamp < CACHE_MAX_AGE * 1000
      ? undefined
      : await statusCookie.serialize({
          data: freshStatus,
          timestamp: now,
          lastMotd: newLastMotd,
        } satisfies CachedStatus);

  return { status: result, setCookieHeader };
}
