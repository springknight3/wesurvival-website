import { useState, useEffect, useCallback } from "react";
import { CopyIP } from "~/components/CopyIP";

interface ServerStatusData {
  online: boolean;
  players: number;
  maxPlayers: number;
  version: string;
  motd: string;
  motdHtml: string;
  playerList: string[];
  isWakingUp: boolean;
  statusText: string;
}

interface ServerStatusProps {
  variant?: "navbar" | "play";
}

function MotdDisplay({ html }: { html: string }) {
  if (!html) return null;
  return (
    <div
      className="font-mono text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function PlayerTooltip({ players, count }: { players: string[]; count: number }) {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      <span className="cursor-default underline decoration-dotted underline-offset-2">
        {count} player{count !== 1 ? "s" : ""}
      </span>
      {show && players.length > 0 && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[var(--color-bg)] border border-[var(--color-primary-dark)] rounded-lg shadow-xl p-3 pointer-events-none">
          <span className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Online Players
          </span>
          <span className="block max-h-40 overflow-y-auto space-y-1">
            {players.map((name) => (
              <span key={name} className="block text-sm text-[var(--color-accent)] truncate">
                {name}
              </span>
            ))}
          </span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[var(--color-primary-dark)]" />
        </span>
      )}
    </span>
  );
}

function PlayerBar({ data }: { data: ServerStatusData }) {
  const percent = data.maxPlayers > 0 ? Math.round((data.players / data.maxPlayers) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-4xl font-pixel text-[var(--color-accent)]">
          {data.players}
        </div>
        <div className="text-sm text-[var(--color-text-muted)]">
          of {data.maxPlayers} max
        </div>
      </div>
      <div className="w-full h-3 bg-[var(--color-bg)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={data.players}
          aria-valuemin={0}
          aria-valuemax={data.maxPlayers}
          aria-label={`${data.players} of ${data.maxPlayers} players online`}
        />
      </div>
      <div className="text-center text-xs text-[var(--color-text-muted)]">
        {data.version}
      </div>
      {data.playerList.length > 0 && (
        <div className="text-center">
          <PlayerTooltip players={data.playerList} count={data.players} />
        </div>
      )}
    </div>
  );
}

export function ServerStatus({ variant = "navbar" }: ServerStatusProps) {
  const [status, setStatus] = useState<ServerStatusData | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/health", { headers: { Accept: "application/json" } });
      if (!res.ok) return;
      const json = await res.json() as { server?: ServerStatusData };
      if (json.server) setStatus(json.server);
    } catch {
      // Silently fail — status will show as unknown
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 60_000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  if (!status) {
    if (variant === "navbar") {
      return (
        <span className="text-xs text-[var(--color-text-muted)] hidden md:flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-pulse" />
          Loading...
        </span>
      );
    }
    return null;
  }

  const dotColor = status.isWakingUp
    ? "bg-yellow-500"
    : status.online
      ? "bg-green-500"
      : "bg-red-500";

  const labelColor = status.isWakingUp
    ? "text-yellow-400"
    : status.online
      ? "text-green-400"
      : "text-red-400";

  if (variant === "navbar") {
    return (
      <span className={`text-xs hidden md:flex items-center gap-1.5 ${labelColor}`}>
        <span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} />
        {status.isWakingUp
          ? "Waking up..."
          : status.online
            ? `Online (${status.players})`
            : status.statusText}
      </span>
    );
  }

  // Play variant — split card
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-2xl overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--color-primary-dark)]">
        <span className={`inline-block w-3 h-3 rounded-full ${dotColor}`} />
        <h2 className="font-pixel text-lg text-[var(--color-text)]">
          {status.isWakingUp
            ? "Server is waking up..."
            : status.online
              ? "Server is Online"
              : "Server is Offline"}
        </h2>
      </div>

      {status.online ? (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--color-primary-dark)]">
          {/* Left: MOTD + IP */}
          <div className="p-6 space-y-4">
            <MotdDisplay html={status.motdHtml} />
            <div>
              <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                Server Address
              </span>
              <div className="mt-1">
                <CopyIP ip="45.138.48.34" port={26954} />
              </div>
            </div>
          </div>

          {/* Right: Player stats */}
          <div className="p-6 flex items-center">
            <div className="w-full">
              <PlayerBar data={status} />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {!status.isWakingUp ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              The server is currently offline. Check back later or join our Discord for updates.
            </p>
          ) : (
            <p className="text-sm text-yellow-400">
              The server is hibernating and waking up. This may take a moment...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
