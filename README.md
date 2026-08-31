# WeSurvival Website

Community-first Minecraft server website built with React Router v8 (framework mode), TypeScript, and TailwindCSS v4.

## Tech Stack

- **Framework**: React Router v8 (SSR enabled)
- **React**: v19
- **Styling**: TailwindCSS v4 (CSS-first config)
- **Animations**: anime.js v4
- **Icons**: Fluent UI React Icons
- **Fonts**: Inter (body) + Pixelify Sans (pixel headings)
- **Deployment**: Vercel (primary) / Docker

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `MINECRAFT_SERVER_HOST` | Minecraft server hostname | `wesurvival.pixelforge.gg` |
| `MINECRAFT_SERVER_PORT` | Minecraft server port | `25565` |
| `SITEMAP_BASE_URL` | Base URL for sitemap | `https://wesurvival-website.vercel.app` |

> **Note**: These are server-side only variables (no `VITE_` prefix). They are not inlined into the client bundle.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript type checking |

## Deployment

### Vercel (Primary)

Push to the `main` branch — Vercel auto-deploys. Configuration is in `vercel.json`.

### Docker

```bash
docker build -t wesurvival-website .
docker run -p 3000:3000 wesurvival-website
```

## SEO Checklist

- [x] `<title>` tags on all pages
- [x] Meta descriptions on all pages
- [x] Open Graph tags (og:title, og:description, og:image, og:url)
- [x] Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- [x] Canonical URLs on all pages
- [x] JSON-LD structured data (Organization schema) in root layout
- [x] `robots.txt` via dynamic resource route (`/robots.txt`)
- [x] `sitemap.xml` via dynamic resource route (`/sitemap.xml`)
- [x] Semantic HTML (`<h1>` per page, `<h2>` for sections)
- [x] `alt` text on all images
- [x] `<meta name="theme-color">` for mobile browsers
- [x] `lang="en"` on `<html>` element

## Accessibility

- [x] Skip-to-content link
- [x] Keyboard navigation for interactive cards (Enter/Space activation)
- [x] `focus-visible` outlines for keyboard users
- [x] `aria-label` on icon-only buttons
- [x] `aria-hidden="true"` on decorative icons
- [x] `role="progressbar"` with ARIA attributes on server status bar

## Features

- **Minecraft Server Status**: Real-time server status via Server List Ping (SLP) protocol, shown in navbar and play page
- **Particle Background**: Animated floating Minecraft blocks (lazy-loaded on mobile)
- **Copy IP**: One-click clipboard copy with toast notification
- **Easter Eggs**: Logo click counter triggers wave animation; P2W card confetti effect
- **Responsive**: Mobile-first design with hamburger navigation
- **SSR**: Server-side rendered for fast initial load and SEO

## Project Structure

```
app/
├── components/         # Reusable UI components
│   ├── CopyIP.tsx
│   ├── CreeperExplosion.tsx
│   ├── Footer.tsx
│   ├── MinecraftButton.tsx
│   ├── Navbar.tsx
│   ├── ParticleBackground.tsx
│   ├── PlatformBadge.tsx
│   └── ServerStatus.tsx
├── lib/                # Utilities and server-side code
│   ├── easter-eggs.ts
│   ├── minecraft-server.server.ts
│   └── server-status-cookie.server.ts
├── routes/             # Page routes and resource routes
│   ├── home.tsx
│   ├── about.tsx
│   ├── play.tsx
│   ├── contact.tsx
│   ├── robots.txt.tsx
│   ├── sitemap.xml.tsx
│   └── api.health.tsx
├── app.css             # TailwindCSS + custom styles
├── root.tsx            # Root layout with meta, links, error boundary
└── routes.ts           # Route configuration
public/
├── favicon.ico
├── logo.png
└── logo.webp
```
