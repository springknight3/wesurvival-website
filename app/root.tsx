import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import "./app.css";

const BASE_URL = "https://wesurvival-website.vercel.app";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    type: "image/png",
    href: "/logo.png",
  },
  {
    rel: "icon",
    type: "image/webp",
    href: "/logo.webp",
  },
];

export function meta() {
  return [
    { title: "WeSurvival — Community First Minecraft Server" },
    {
      name: "description",
      content:
        "Join WeSurvival, a friendly Minecraft server with no pay-to-win. Cooperative survival, economy play, and regular events. Java & Bedrock editions supported.",
    },
    { name: "theme-color", content: "#0b1a12" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "WeSurvival" },
    { property: "og:title", content: "WeSurvival — Community First Minecraft Server" },
    {
      property: "og:description",
      content:
        "Join WeSurvival, a friendly Minecraft server with no pay-to-win. Cooperative survival, economy play, and regular events.",
    },
    { property: "og:image", content: `${BASE_URL}/logo.png` },
    { property: "og:url", content: BASE_URL },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "WeSurvival — Community First Minecraft Server" },
    {
      name: "twitter:description",
      content:
        "Join WeSurvival, a friendly Minecraft server with no pay-to-win.",
    },
    { name: "twitter:image", content: `${BASE_URL}/logo.png` },
    {
      tagName: "link",
      rel: "canonical",
      href: BASE_URL,
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "WeSurvival",
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        description:
          "A friendly Minecraft server that puts community first. No pay-to-win. Java & Bedrock editions supported.",
        sameAs: ["https://discord.gg/kRg9dZK9x4"],
      },
    },
  ] satisfies Route.MetaDescriptors;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[9999] focus:bg-[var(--color-accent)] focus:text-[var(--color-bg)] focus:px-4 focus:py-2 focus:rounded-lg focus:font-pixel focus:text-sm"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto text-center">
      <h1 className="font-pixel text-6xl text-[var(--color-redstone)] mb-4">
        {message}
      </h1>
      <p className="text-[var(--color-text-muted)] text-lg">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto mt-4 text-sm text-left bg-[var(--color-surface)] rounded-lg">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
