# AGENTS.md

## Cursor Cloud specific instructions

This is a single Cloudflare Workers app (Wrangler + Durable Objects) that serves a
password-gated Warsaw apartment/room search organizer. The Worker in `src/index.ts`
handles a password gate + JSON API and serves the static frontend in `public/`.
Listings are stored in a Durable Object (`ListingsStore`), not in the browser.

Standard commands live in `package.json` (`dev`, `deploy`, `types`, `check`) and
setup docs in `README.md`. Notes below are only the non-obvious bits.

- Run locally: `npm run dev` (alias for `wrangler dev`) serves on `http://localhost:8787`.
  Everything runs in local mode (Durable Object + Assets), so no Cloudflare login is
  needed for development. `npm run deploy` is production-only and requires `wrangler login`.
- Site password gate: the default password is `777` (from `vars.SITE_PASSWORD` in
  `wrangler.jsonc`). You must log in with it before the `/api/listings` endpoints work.
- Type check / lint: `npm run check` (runs `tsc --noEmit`). There is no separate ESLint config.
- Durable Object state persists in `.wrangler/` across `wrangler dev` restarts. On first
  read it seeds ~9 listings from `src/seed.ts`. `POST /api/reset` restores the seed data.
- The `/api/import` endpoint makes outbound requests to olx.pl / otodom.pl (and the
  r.jina.ai reader proxy) to auto-fill a listing from a URL; that specific feature needs
  network egress to those hosts and will fail if they are blocked. Core app + manual
  listing entry work fully offline.
