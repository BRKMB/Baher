# Salute 21 — Bar & Restaurant

Professional restaurant website for **Salute 21** in Warsaw, inspired by [@salute__21](https://www.instagram.com/salute__21/).

## Features

- English by default + clear EN / PL language toggle
- Separate pages: Landing `/`, Menu `/menu`, Reserve `/reserve`
- Real booking API with availability checks, confirmation reference, and calendar (.ics)
- Menu QR code (downloadable)
- Luxury Mediterranean visual identity

## Run

```bash
npm install
npm run build
npm start
```

Dev (frontend only; booking falls back to local storage if API is offline):

```bash
npm run dev
```

Site + booking API: http://localhost:4173
