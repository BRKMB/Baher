# BUB SUB

**The subscription manager that helps you cancel.** Track every subscription, know exactly what you spend, catch free trials before they charge you, and find the exact button to press when you want out — no dark patterns, no hidden menus.

The app lives in [`bubsub/`](bubsub/).

## Quick start

```bash
cd bubsub
npm install
npm run dev
```

Open the printed URL. On a desktop browser the app renders inside an **iPhone 16 Pro Max frame** so you can click through it like a real phone app. On an actual phone it runs full-screen (PWA-ready).

## What's inside

- **Dashboard** — every subscription as a card: price, renewal countdown, trial badges, tags, categories, search, filters and sorting.
- **Spending analytics** — monthly/yearly totals, next-30-days charges, category breakdown, most expensive ranking, and on-device insights ("you could save $X/year…").
- **Calendar** — month grid with renewal dots and a timeline of upcoming charges and trial deadlines.
- **Free trial tracker** — countdown banners so a trial never silently converts into a charge.
- **Cancellation Center** — a community-style database of cancellation guides: difficulty score, estimated time, step-by-step instructions, direct cancel URLs, dark-pattern warnings, cheaper alternatives, country notes and community trust votes.
- **Reminders** — in-app notification center for renewals due in the next days.
- **Import / export** — CSV and JSON backup & restore.
- **Multi-currency** — offline conversion table (USD, EUR, EGP, SAR, AED, …).
- **Dark & light mode**, responsive, accessible (keyboard focus states, aria labels).

## Zero operational cost, by design

- No backend, no accounts, no paid APIs — **all data lives in the user's browser** (localStorage).
- The cancellation database ships as static data and grows through contributions.
- Deployable on any free static host: `npm run build` → upload `bubsub/dist/`.

## Tech

React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router 7. No other runtime dependencies.

## Disclaimer

Cancellation guides are community-maintained instructions, not legal advice. Services change their flows; verification dates and votes indicate freshness.
