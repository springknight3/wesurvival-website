import type { Route } from "./+types/api.health";
import { getServerStatusCached } from "~/lib/server-status-cookie.server";

export async function loader({ request }: Route.LoaderArgs) {
  const { status, setCookieHeader } = await getServerStatusCached(request);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=30",
  };

  if (setCookieHeader) {
    headers["Set-Cookie"] = setCookieHeader;
  }

  return Response.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      server: {
        online: status.online,
        players: status.players,
        maxPlayers: status.maxPlayers,
        version: status.version,
        motd: status.motd,
        motdHtml: status.motdHtml,
        playerList: status.playerList,
        isWakingUp: status.isWakingUp,
        statusText: status.statusText,
      },
    },
    { headers }
  );
}
