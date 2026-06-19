<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SSH-Arcade — web front

The landing page for **[ssharcade.dev](https://ssharcade.dev)** — a retro-future
arcade where every cabinet is a game you play over SSH. Farm is the first cabinet
on the floor: `ssh farm.ssharcade.dev`.

## Stack

- **Next.js 16.2.9** (App Router, Turbopack) — modified; see the warning above
- **React 19.2.4** + **TypeScript**
- **Tailwind CSS v4** — `@import "tailwindcss"` + `@theme inline` in `app/globals.css`;
  prefer arbitrary-value utilities (e.g. `bg-[var(--accent)]`) over a config file
- Deployed on Vercel

## Commands

```bash
npm run dev    # dev server (Turbopack) — http://localhost:3000
npm run build  # production build; all routes prerender as static
npm run lint   # eslint (eslint-config-next)
```

If you hit `Could not find the module ... in the React Client Manifest`, the
`.next` cache is stale (usually from switching between `build` and `dev`). Stop
the dev server, delete `.next`, and restart — it is not a code bug.

## Architecture

- **`app/site.ts` is the single source of identity.** `siteConfig` (name, domain,
  copy, colors, ssh command), the `cabinets` list, and the standalone `pages`
  list all live here. Edit identity *here* and everything below follows — do not
  hardcode the domain, title, or copy anywhere else.
- **File-convention metadata routes** (all in `app/`, auto-injected by Next — do
  not also set them in `metadata`):
  - `layout.tsx` — `metadata` (title template, canonical, OpenGraph, Twitter,
    robots) and `viewport` (theme color)
  - `icon.svg`, `apple-icon.tsx` — favicon / touch icon
  - `opengraph-image.tsx` — social card (also reused as the Twitter image)
  - `manifest.ts` → `/manifest.webmanifest`
  - `robots.ts` → `/robots.txt`, `sitemap.ts` → `/sitemap.xml`
  - `llms.txt/route.ts` → `/llms.txt` (route handler, `force-static`)
- **`app/page.tsx`** is a thin server wrapper around **`app/ArcadeLanding.tsx`**,
  the client component holding all interactive arcade UI.

## Conventions / gotchas

- **Accent theming.** The arcade's accent follows the selected cabinet.
  `--accent` and `--cabinet-accent` are registered with `@property { syntax:
  "<color>" }` in `globals.css` so they *animate*; a `transition` on
  `.theme-root` cross-fades the background gradient and every accent surface.
  Per-cabinet colors live on each game's `accent` in `ArcadeLanding.tsx`; the
  resting (nothing-selected) accent is amber `#ffb000`.
- **Powered-off default.** Selection starts at `null` — the hero renders a
  grayed-out "Standby" state (`.is-off`, no scanline) until the user picks a
  cabinet.
- **Reduced motion.** `globals.css` disables all animation/transition under
  `prefers-reduced-motion: reduce`. Keep new motion CSS-driven so it inherits this.
- **`next/og` / satori** (OG + apple icons): multi-child flex needs explicit
  `display: flex`; use `marginRight` not `gap`. Works with the built-in font —
  do not add custom fonts unless needed.
- **Unbuilt routes are intentional.** The cabinet routes (`/farm`, `/moon-mine`,
  `/packet-derby`) and pages (`/docs`, `/donate`, `/contact`) are listed in the
  sitemap and `llms.txt` but not built yet — they 404 by design. Add them to
  `app/site.ts` first if you build them.
