import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("play", "routes/play.tsx"),
  route("robots.txt", "routes/robots.txt.tsx"),
  route("sitemap.xml", "routes/sitemap.xml.tsx"),
  route("api/health", "routes/api.health.tsx"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
