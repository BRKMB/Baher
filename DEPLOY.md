# Deploy Clean & Speak to Cloudflare

The site is a Cloudflare Worker that serves the files in `public/` and stores contact-form inquiries in KV.

The stable URL after a successful deploy is:

`https://clean-and-speak.<your-subdomain>.workers.dev`

## A. Fastest: upload in the dashboard (no terminal)

The dashboard upload zip is only website files (no Wrangler config):

`releases/clean-and-speak-pages.zip`

1. Open [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages).
2. **Create** → **Pages** → **Upload assets**.
3. Project name: `clean-and-speak`.
4. Upload `clean-and-speak-pages.zip`, or unzip it and drop the folder that contains `index.html`.
5. Do not upload `wrangler.jsonc`, `package.json`, or the `workers-project` folder. Cloudflare Pages rejects those.
6. Deploy.

The public URL stays the same on every later upload:

`https://clean-and-speak.pages.dev`

This method serves the website. The contact form needs method B if you want inquiries saved in KV.

## B. Full site: Worker + form (recommended)

From `workers-project` in the zip, or from this repository:

```bash
npm install
npx wrangler login
npx wrangler deploy
```

Wrangler prints the live URL. That `*.workers.dev` link does not expire.

If KV is not created automatically:

```bash
npx wrangler kv namespace create INQUIRIES
```

Put the returned `id` into `wrangler.jsonc` under `kv_namespaces`, then deploy again.

## Token permissions (if deploy fails with error 10000)

Create a token at [API Tokens](https://dash.cloudflare.com/profile/api-tokens) with:

- Account · Cloudflare Workers · Edit
- Account · Workers KV Storage · Edit
- Account · Cloudflare Pages · Edit
- User · User Details · Read

## Contact details

Fill real phone, email, or social links in `public/js/site-config.js` before you upload. The site does not invent those values.
