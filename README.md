# Clean & Speak

Strona marki łączącej profesjonalne sprzątanie i naukę angielskiego.

## Zawartość

- Strona główna z rozróżnieniem Clean / Speak
- Oferta sprzątania i zajęć z angielskiego
- Formularz, który zmienia pola w zależności od wybranej usługi
- Polityka prywatności i informacja o cookies — wersje robocze do uzupełnienia

## Czego strona świadomie nie zawiera

Nie dopisujemy cen, opinii, adresu, telefonu, godzin otwarcia ani biografii zespołu.
Potwierdzone dane kontaktowe wpisz w `public/js/site-config.js`.

## Uruchomienie

```bash
npm install
npm run dev
```

Sprawdzenie typów:

```bash
npm run check
```

Wdrożenie:

```bash
npm run deploy
```

Zapytania z formularza trafiają do Cloudflare KV (`INQUIRIES`).
