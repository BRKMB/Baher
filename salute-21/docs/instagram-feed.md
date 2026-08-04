# Instagram gallery feed (Salute 21)

The home Gallery can show live posts + Reels from [@salute__21](https://www.instagram.com/salute__21/).

## How it works

1. Cloudflare Worker `GET /api/instagram` reads a KV cache.
2. Cron (`0 * * * *`) force-refreshes the cache every hour from the Instagram Graph API.
3. The UI keeps a **3-column grid** and only renders a **multiple of 3** posts (max 12).
4. Until Instagram credentials are configured, the site falls back to the static gallery images.

## Requirements (Meta)

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
