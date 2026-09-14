# Mawja

تنقّل اجتماعي لشاشة تسلا، مستضاف على Cloudflare Workers. المشروع مستقل بالكامل، وليس نسخة من أي موقع سابق في المستودع، وغير تابع لـ Waze أو Tesla أو Spotify.

UX patterns were informed by [TeslaNav](https://github.com/R44VC0RP/teslanav.com) (PolyForm Noncommercial) — large Tesla touch targets, compass follow, live Waze-map alerts, and a police-ahead warning. Mawja is original code on Cloudflare Workers, with turn-by-turn routing and Spotify that TeslaNav does not ship.

## Why this exists

Tesla’s in-car browser can stay open while driving. Mawja is built for that screen:

- Landscape, large touch targets, night map, speedometer kept clear
- Turn-by-turn routing, voice prompts, community reports, OSM speed cameras
- Tesla-style now-playing island with Spotify Connect (best path in the car) and Web Playback SDK fallback

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:8787](http://localhost:8787). Use **تجربة بدون GPS** to simulate a drive.

## Deploy

```bash
npm run deploy
```

The Worker is named `mawja` and publishes to its own `*.workers.dev` URL.

## Tesla

1. In the car browser, open the deployed URL.
2. Allow location.
3. Bookmark it (Tesla 2026.26 syncs bookmarks across cars).
4. Start driving, search a destination, report hazards.

## Spotify

In-car browser playback needs Premium and DRM. Tesla’s native Spotify app is usually more reliable; Mawja can control it over Spotify Connect.

1. Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Add the redirect URI shown in Mawja settings: `https://<your-worker>.workers.dev/callback`.
3. Paste the Client ID into Mawja settings (or set `SPOTIFY_CLIENT_ID` in Wrangler vars).
4. Connect Spotify, open the native Tesla Spotify app, then pick that device in Mawja.

Optional secret for confidential apps:

```bash
npx wrangler secret put SPOTIFY_CLIENT_SECRET
```

## API

- `GET /api/config`
- `GET /api/geocode?q=`
- `GET /api/route?from=lat,lon&to=lat,lon`
- `GET /api/alerts`
- `POST /api/alerts`
- `GET /api/speed-limit`
- `POST /api/spotify/token`
- `POST /api/spotify/refresh`
