# Instagram feed (Salute 21)

The home page includes a Shopify-style mini Instagram grid for [@salute__21](https://www.instagram.com/salute__21/) — square tiles, hover overlay, video/carousel badges, and a Follow CTA.

## How it works

1. Cloudflare Worker `GET /api/instagram` reads a KV cache (`instagram:feed:v1`).
2. Cron (`0 * * * *`) force-refreshes the cache every hour.
3. Refresh priority:
   1. **Instagram Graph API** (`INSTAGRAM_ACCESS_TOKEN` + `INSTAGRAM_USER_ID`) — best quality (images, Reels, carousel children, video URLs)
   2. **SerpAPI** `instagram_profile` (`SERPAPI_KEY`) — public profile posts
   3. **Public shortcodes** — discovers `@salute__21` posts and hydrates thumbnails via Instagram’s `/media/?size=l` + embed caption
   4. Best-effort profile scrape (often blocked by Instagram)
4. The UI renders a Shopify-style square grid (max 12). Photos, videos/Reels, and carousels are supported.
5. Until a live source returns posts, the site falls back to static gallery images styled the same way (each tile still links to the Instagram profile).

## Requirements (Meta — recommended)

- Instagram account converted to **Business** or **Creator**
- Linked **Facebook Page**
- Meta Developer App with Instagram Graph API
- Long-lived Page/User token with permissions such as:
  - `instagram_basic` (or `instagram_business_basic`)
  - `pages_read_engagement` / `pages_show_list` (Facebook Login path)

## Secrets

```bash
cd salute-21
npx wrangler secret put INSTAGRAM_ACCESS_TOKEN
npx wrangler secret put INSTAGRAM_USER_ID
# Optional fallback if Graph is not ready:
npx wrangler secret put SERPAPI_KEY
```

`INSTAGRAM_USER_ID` is the Instagram Business Account ID (numeric), not the @handle.

## Manual refresh

```bash
curl -X POST "https://salute21.com/api/instagram/refresh" \
  -H "X-Admin-Key: $ADMIN_KEY"
```

## Check status

```bash
curl -s https://salute21.com/api/instagram | jq
curl -s https://salute21.com/api/health | jq
```
