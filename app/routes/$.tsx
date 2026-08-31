import type { Route } from "./+types/$";

export function loader() {
  return new Response("Not Found", { status: 404 });
}
