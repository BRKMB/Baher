# BUB SUB

Native **iOS + Android** subscription manager & cancellation platform.

> Per the platform fix in the addendum: **the product is the mobile app**, not a website/PWA.

## Projects

| Path | Purpose |
|------|---------|
| [`app/`](app/) | **Flutter** native app (iOS + Android). This is the product. |
| [`landing/`](landing/) | Static marketing site only (store links / SEO). No app functionality. |
| [`bubsub/`](bubsub/) | Earlier web prototype kept for reference / design exploration. |

## Flutter app

```bash
cd app
flutter pub get
flutter run        # device / simulator
flutter run -d chrome   # UI preview when no mobile SDK is available
```

### What’s included

- Local-first subscription tracking (SharedPreferences store; SQLite-ready architecture)
- **211 pre-seeded** cancellation guides (global + Egypt + Poland)
- Cancellation Center with steps, dark-pattern notes, trust votes, **copy-paste cancellation scripts**
- Spending analytics + anonymous benchmark-style insight
- Calendar renewals / trial deadlines
- **On-device OCR confirm flow** (never auto-saves; ML Kit / Vision hook point documented)
- Local notifications service (app works if permission denied)
- Share-to-cancel route (`/share?q=…`) for Share Extension / ACTION_SEND wiring
- Price-hike crowd flag + contributor reputation points
- **Localization from day one:** English, Arabic (RTL), Polish
- Brand identity: neon lime `#C8FF00`, pink `#FF2D8A`, blue `#2F6BFF`

### Cost notes

- Apple Developer Program: **$99/year** (unavoidable for App Store)
- Google Play: **$25 one-time**
- Everything else in this brief targets **$0** recurring ops

## Landing site

Open `landing/index.html` or host the folder on any free static host.
