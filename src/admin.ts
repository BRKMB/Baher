const ADMIN_PASSWORD = "brkmb.com";
const COOKIE_NAME = "cns_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const LOGIN_WINDOW_SECONDS = 15 * 60;
const LOGIN_MAX_ATTEMPTS = 8;

const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  "Permissions-Policy":
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
} as const;

const FIELD_LABELS: Record<string, string> = {
  name: "Imię i nazwisko",
  email: "E-mail",
  phone: "Telefon",
  message: "Wiadomość",
  propertyType: "Nieruchomość",
  sizeApprox: "Metraż",
  cleaningType: "Rodzaj sprzątania",
  frequency: "Częstotliwość",
  preferredDate: "Termin",
  location: "Lokalizacja",
  extras: "Dodatki",
  studentLevel: "Poziom / wiek",
  format: "Forma zajęć",
  lessonMode: "Tryb",
  goal: "Cel",
  preferredDays: "Dni",
  preferredTime: "Godziny",
};

const SERVICE_LABELS: Record<string, string> = {
  sprzatanie: "Sprzątanie",
  angielski: "Angielski",
};

const VALUE_LABELS: Record<string, string> = {
  mieszkanie: "Mieszkanie",
  dom: "Dom",
  placowka: "Placówka",
  biuro: "Biuro",
  inne: "Inne",
  cykliczne: "Cykliczne",
  jednorazowe: "Jednorazowe",
  okna: "Okna",
  "po-remoncie": "Po remoncie",
  online: "Online",
  stacjonarnie: "Stacjonarnie",
  "nie-wiem": "Nie wiem",
  indywidualne: "Indywidualnie",
  dzieci: "Dzieci",
  szkolny: "Szkoła",
  egzamin: "Egzamin",
  konwersacje: "Konwersacje",
  bariera: "Bariera mówienia",
};

type InquiryRecord = Record<string, string>;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function adminHeaders(extra?: HeadersInit, status = 200): Headers {
  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    ...securityHeaders,
    ...extra,
  });
  return headers;
}

function htmlResponse(body: string, extra?: HeadersInit, status = 200): Response {
  return new Response(body, { status, headers: adminHeaders(extra, status) });
}

function redirect(location: string, extra?: HeadersInit): Response {
  return new Response(null, {
    status: 303,
    headers: adminHeaders({ Location: location, ...extra }),
  });
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function secretKey(): Promise<CryptoKey> {
  const raw = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`cns-admin:${ADMIN_PASSWORD}`));
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function hex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(value: string): Uint8Array | null {
  if (!/^[0-9a-f]+$/u.test(value) || value.length % 2 !== 0) return null;
  const out = new Uint8Array(value.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = Number.parseInt(value.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

async function signExpiry(expiresAt: number): Promise<string> {
  const key = await secretKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(expiresAt)));
  return `${expiresAt}.${hex(signature)}`;
}

async function sessionValid(token: string): Promise<boolean> {
  const [expiresRaw, signatureHex] = token.split(".");
  if (!expiresRaw || !signatureHex) return false;
  const expiresAt = Number(expiresRaw);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 < Date.now()) return false;
  const signature = fromHex(signatureHex);
  if (!signature) return false;
  const key = await secretKey();
  return crypto.subtle.verify("HMAC", key, signature, new TextEncoder().encode(String(expiresAt)));
}

function readCookie(request: Request, name: string): string {
  const header = request.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) === name) {
      return decodeURIComponent(trimmed.slice(eq + 1));
    }
  }
  return "";
}

function cookieHeader(token: string, request: Request, maxAge: number): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  if (maxAge <= 0) {
    return `${COOKIE_NAME}=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
  }
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

async function passwordMatches(input: string): Promise<boolean> {
  const [left, right] = await Promise.all([sha256Hex(`p:${input}`), sha256Hex(`p:${ADMIN_PASSWORD}`)]);
  return left === right;
}

function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>${escapeHtml(title)}</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="admin-page wrap">
      ${body}
    </main>
    <footer class="site-footer">
      <div class="wrap footer-credit">
        <p>Made with ❤️ by <a href="https://brkmb.com/" target="_blank" rel="noopener">Baher Magally</a></p>
      </div>
    </footer>
  </body>
</html>`;
}

function loginPage(error = ""): string {
  const message = error ? `<p class="form-status is-error" role="alert">${escapeHtml(error)}</p>` : "";
  return layout(
    "Panel zapytań — Clean & Speak",
    `<p class="eyebrow">Panel</p>
      <h1>Zapytania z formularza</h1>
      <p class="lede">Wejście tylko dla osoby prowadzącej stronę.</p>
      <form class="admin-login" method="post" action="/admin/">
        <div class="field">
          <label for="password">Hasło</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required />
        </div>
        ${message}
        <button class="btn btn--primary" type="submit">Wejdź</button>
      </form>`,
  );
}

function polishCount(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return `1 ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ${few}`;
  return `${n} ${many}`;
}

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Warsaw",
  }).format(date);
}

function prettyValue(key: string, value: string): string {
  if (key === "service") return SERVICE_LABELS[value] ?? value;
  return VALUE_LABELS[value] ?? value;
}

function inquiryCard(id: string, record: InquiryRecord): string {
  const service = record.service ?? "";
  const flagClass = service === "angielski" ? "admin-flag admin-flag--speak" : "admin-flag";
  const rows = Object.entries(FIELD_LABELS)
    .map(([key, label]) => {
      const raw = record[key]?.trim() ?? "";
      if (!raw) return "";
      const shown = prettyValue(key, raw);
      const body =
        key === "email"
          ? `<a href="mailto:${escapeHtml(raw)}">${escapeHtml(raw)}</a>`
          : key === "phone"
            ? `<a href="tel:${escapeHtml(raw.replace(/[^\d+]/g, ""))}">${escapeHtml(raw)}</a>`
            : escapeHtml(shown);
      return `<div><dt>${escapeHtml(label)}</dt><dd>${body}</dd></div>`;
    })
    .filter(Boolean)
    .join("");

  return `<article class="admin-card">
      <header>
        <h2>${escapeHtml(record.name || "Bez imienia")}</h2>
        <span class="${flagClass}">${escapeHtml(prettyValue("service", service) || "Zapytanie")}</span>
      </header>
      <p class="muted">${escapeHtml(formatWhen(record.createdAt || ""))} · ${escapeHtml(id.slice(0, 8))}</p>
      <dl class="admin-dl">${rows}</dl>
    </article>`;
}

function dashboardPage(inquiries: { id: string; record: InquiryRecord }[]): string {
  const cards =
    inquiries.length === 0
      ? `<p class="admin-empty">Nie ma jeszcze żadnego zapytania. Gdy ktoś wyśle formularz, pojawi się tutaj.</p>`
      : inquiries.map((item) => inquiryCard(item.id, item.record)).join("");

  return layout(
    "Zapytania — Clean & Speak",
    `<p class="eyebrow">Panel</p>
      <h1>Osoby, które napisały</h1>
      <div class="admin-toolbar">
        <p class="admin-count">${polishCount(inquiries.length, "zapytanie", "zapytania", "zapytań")}</p>
        <form method="post" action="/admin/">
          <input type="hidden" name="intent" value="logout" />
          <button class="btn btn--ghost" type="submit">Wyloguj</button>
        </form>
      </div>
      ${cards}`,
  );
}

async function loadInquiries(env: Env): Promise<{ id: string; record: InquiryRecord }[]> {
  const collected: { id: string; record: InquiryRecord }[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < 10; page += 1) {
    const listed = await env.INQUIRIES.list({ prefix: "inquiry:", limit: 100, cursor });
    for (const key of listed.keys) {
      const raw = await env.INQUIRIES.get(key.name);
      if (!raw) continue;
      try {
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue;
        collected.push({
          id: key.name.slice("inquiry:".length),
          record: parsed as InquiryRecord,
        });
      } catch {
        /* skip a broken record rather than taking the panel down */
      }
    }
    if (listed.list_complete) break;
    cursor = listed.cursor;
  }

  collected.sort((left, right) => {
    const a = left.record.createdAt ?? "";
    const b = right.record.createdAt ?? "";
    return a < b ? 1 : a > b ? -1 : 0;
  });
  return collected;
}

async function loginAllowed(request: Request, env: Env): Promise<boolean> {
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const rateKey = `admin-login:${await sha256Hex(ip)}`;
  const current = Number((await env.INQUIRIES.get(rateKey)) ?? "0");
  return Number.isFinite(current) && current < LOGIN_MAX_ATTEMPTS;
}

async function recordLoginFailure(request: Request, env: Env): Promise<void> {
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const rateKey = `admin-login:${await sha256Hex(ip)}`;
  const current = Number((await env.INQUIRIES.get(rateKey)) ?? "0");
  const next = Number.isFinite(current) ? current + 1 : 1;
  await env.INQUIRIES.put(rateKey, String(next), { expirationTtl: LOGIN_WINDOW_SECONDS });
}

async function isAuthed(request: Request): Promise<boolean> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return false;
  return sessionValid(token);
}

export async function handleAdmin(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;

  if (path !== "/admin/") {
    return htmlResponse(loginPage("Tej strony nie ma."), undefined, 404);
  }

  if (request.method === "POST") {
    const type = request.headers.get("content-type") ?? "";
    if (!type.toLowerCase().includes("application/x-www-form-urlencoded")) {
      return htmlResponse(loginPage("Wyślij hasło przez formularz."), undefined, 415);
    }

    const body = await request.text();
    if (body.length > 2048) {
      return htmlResponse(loginPage("Nieprawidłowe hasło."), undefined, 400);
    }

    const form = new URLSearchParams(body);
    if (form.get("intent") === "logout") {
      return redirect("/admin/", { "Set-Cookie": cookieHeader("", request, 0) });
    }

    if (await isAuthed(request)) {
      return redirect("/admin/");
    }

    if (!(await loginAllowed(request, env))) {
      return htmlResponse(loginPage("Za dużo prób. Poczekaj chwilę i spróbuj ponownie."), undefined, 429);
    }

    const password = form.get("password") ?? "";
    if (!(await passwordMatches(password))) {
      await recordLoginFailure(request, env);
      return htmlResponse(loginPage("Nieprawidłowe hasło."), undefined, 401);
    }

    const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
    const token = await signExpiry(expiresAt);
    return redirect("/admin/", { "Set-Cookie": cookieHeader(token, request, SESSION_TTL_SECONDS) });
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return htmlResponse(loginPage("Niedozwolona metoda."), undefined, 405);
  }

  if (!(await isAuthed(request))) {
    return htmlResponse(loginPage());
  }

  const inquiries = await loadInquiries(env);
  return htmlResponse(dashboardPage(inquiries));
}

export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
