import type { Route } from "./+types/sitemap.xml";

const BASE_URL = process.env.SITEMAP_BASE_URL || "https://wesurvival-website.vercel.app";

const routes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/play", priority: "0.9", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
];

export function loader(_: Route.LoaderArgs) {
  const urls = routes
    .map(
      (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
