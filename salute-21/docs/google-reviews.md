# Live Google Maps reviews (Salute 21)

The home Reviews section shows **live** Google Maps guest reviews.

## Hard rules

1. Reviews come only from Google Maps (via SerpAPI → Google).
2. **5★ only** — anything below five stars is dropped.
3. **Photos required** — reviews without guest photos are dropped.
4. Guest text is shown **exactly** as written on Google — never invented or rewritten.
5. Cache refreshes automatically every hour (Cloudflare cron) and on demand.

## How it works

1. Worker `GET /api/reviews` reads a KV cache.
2. Cron (`0 * * * *`) force-refreshes Instagram + Google reviews.
3. SerpAPI `google_maps_reviews` pulls the Salute 21 listing (`data_id` / optional `place_id`).
4. The UI renders only the filtered live payload. If none are available, it links to Google Maps — it never falls back to fake quotes.

## Secrets

```bash
cd salute-21
npx wrangler secret put SERPAPI_KEY
# optional — preferred when available
npx wrangler secret put GOOGLE_PLACE_ID
```

Create a key at [serpapi.com](https://serpapi.com/) (Google Maps Reviews engine).

`GOOGLE_PLACE_ID` is the `ChIJ…` id if you have it; otherwise the Worker uses the known Maps `data_id`.

## Manual refresh

```bash
curl -X POST "https://salute21.com/api/reviews/refresh" \
  -H "X-Admin-Key: $ADMIN_KEY"
```

## Check status

```bash
curl -s https://salute21.com/api/reviews | jq
curl -s https://salute21.com/api/health | jq
```
