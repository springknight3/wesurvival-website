import type { Route } from "./+types/robots.txt";

export function loader(_: Route.LoaderArgs) {
  const rules = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://wesurvival-website.vercel.app/sitemap.xml
`;

  return new Response(rules, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
