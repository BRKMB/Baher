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

function langToggle(): string {
  return `<button class="lang-toggle" type="button" data-lang-toggle aria-label="Switch the website to English" title="English">
        <img src="/images/flag-gb.svg" alt="" width="22" height="15" data-lang-flag />
      </button>`;
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
    <script src="/js/i18n-boot.js"></script>
    <script src="/js/i18n.js" defer></script>
    <script src="/js/admin.js" defer></script>
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
    `<div class="admin-top">
        <div>
          <p class="eyebrow">Panel</p>
          <h1>Zapytania z formularza</h1>
          <p class="lede">Wejście tylko dla osoby prowadzącej stronę.</p>
        </div>
        ${langToggle()}
      </div>
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

const INQUIRY_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type TabFilter = "all" | "sprzatanie" | "angielski";

function parseTab(value: string | null): TabFilter {
  if (value === "sprzatanie" || value === "angielski") return value;
  return "all";
}

function tabHref(tab: TabFilter, extra?: Record<string, string>): string {
  const params = new URLSearchParams();
  if (tab !== "all") params.set("tab", tab);
  if (extra) {
    for (const [key, item] of Object.entries(extra)) params.set(key, item);
  }
  const query = params.toString();
  return query ? `/admin/?${query}` : "/admin/";
}

async function csrfToken(session: string): Promise<string> {
  return sha256Hex(`csrf:${session}`);
}

async function csrfMatches(session: string, provided: string): Promise<boolean> {
  if (!provided) return false;
  const expected = await csrfToken(session);
  const [left, right] = await Promise.all([sha256Hex(`c:${expected}`), sha256Hex(`c:${provided}`)]);
  return left === right;
}

function warsawYmd(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(date);
}

function parseYmd(ymd: string): [number, number, number] {
  const [year = 1970, month = 1, day = 1] = ymd.split("-").map(Number);
  return [year, month, day];
}

function shiftYmd(ymd: string, days: number): string {
  const [year, month, day] = parseYmd(ymd);
  const shifted = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
}

function dayHeading(ymd: string, todayYmd: string): string {
  if (!ymd) return "Bez daty";
  if (ymd === todayYmd) return "Dzisiaj";
  if (ymd === shiftYmd(todayYmd, -1)) return "Wczoraj";
  const [year, month, day] = parseYmd(ymd);
  const noon = new Date(Date.UTC(year, month - 1, day, 12));
  const label = new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(noon);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatClock(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Warsaw",
  }).format(date);
}

function formatFullDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Warsaw",
  }).format(date);
}

function polishCount(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return `1 ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ${few}`;
  return `${n} ${many}`;
}

function prettyValue(key: string, value: string): string {
  if (key === "service") return SERVICE_LABELS[value] ?? value;
  return VALUE_LABELS[value] ?? value;
}

function trashIcon(): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14"/><path d="M10 7V5h4v2"/><path d="M8 7v12h8V7"/><path d="M10 11v5M14 11v5"/></svg>`;
}

function inquiryCard(
  id: string,
  record: InquiryRecord,
  csrf: string,
  tab: TabFilter,
): string {
  const service = record.service ?? "";
  const speak = service === "angielski";
  const flagClass = speak ? "admin-flag admin-flag--speak" : "admin-flag";
  const cardClass = speak ? "admin-card admin-card--speak" : "admin-card";
  const created = record.createdAt || "";
  const clock = formatClock(created);
  const fullDate = formatFullDate(created);
  const displayName = record.name || "Bez imienia";

  const email = record.email?.trim() ?? "";
  const phone = record.phone?.trim() ?? "";
  const message = record.message?.trim() ?? "";

  const contact = [
    email
      ? `<a class="admin-chip" href="mailto:${escapeHtml(email)}"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="/icons.svg#i-mail"/></svg>${escapeHtml(email)}</a>`
      : "",
    phone
      ? `<a class="admin-chip" href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ""))}"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="/icons.svg#i-phone"/></svg>${escapeHtml(phone)}</a>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const facts = Object.entries(FIELD_LABELS)
    .filter(([key]) => key !== "name" && key !== "email" && key !== "phone" && key !== "message")
    .map(([key, label]) => {
      const raw = record[key]?.trim() ?? "";
      if (!raw) return "";
      return `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(prettyValue(key, raw))}</dd></div>`;
    })
    .filter(Boolean)
    .join("");

  return `<article class="${cardClass}">
      <header class="admin-card__top">
        <div class="admin-card__who" data-no-i18n>
          <h2>${escapeHtml(displayName)}</h2>
          <p class="admin-card__when">
            <time datetime="${escapeHtml(created)}" title="${escapeHtml(fullDate)}">${escapeHtml(clock || fullDate)}</time>
          </p>
        </div>
        <div class="admin-card__tools">
          <span class="${flagClass}">${escapeHtml(prettyValue("service", service) || "Zapytanie")}</span>
          <form class="admin-delete" method="post" action="/admin/" data-delete-form data-name="${escapeHtml(displayName)}">
            <input type="hidden" name="intent" value="delete" />
            <input type="hidden" name="id" value="${escapeHtml(id)}" />
            <input type="hidden" name="csrf" value="${escapeHtml(csrf)}" />
            <input type="hidden" name="tab" value="${escapeHtml(tab)}" />
            <button class="admin-delete-btn" type="submit" data-no-i18n aria-label="Usuń zapytanie od ${escapeHtml(displayName)}">
              ${trashIcon()}
            </button>
          </form>
        </div>
      </header>
      ${contact ? `<div class="admin-contact" data-no-i18n>${contact}</div>` : ""}
      ${message ? `<blockquote class="admin-message" data-no-i18n><p>${escapeHtml(message)}</p></blockquote>` : ""}
      ${facts ? `<dl class="admin-facts">${facts}</dl>` : ""}
    </article>`;
}

function groupedCards(
  inquiries: { id: string; record: InquiryRecord }[],
  csrf: string,
  tab: TabFilter,
): string {
  if (inquiries.length === 0) {
    const empty =
      tab === "sprzatanie"
        ? "Brak zapytań o sprzątanie."
        : tab === "angielski"
          ? "Brak zapytań o zajęcia angielskiego."
          : "Nie ma jeszcze żadnego zapytania. Gdy ktoś wyśle formularz, pojawi się tutaj.";
    return `<p class="admin-empty">${empty}</p>`;
  }

  const todayYmd = warsawYmd(new Date().toISOString());
  const groups = new Map<string, { id: string; record: InquiryRecord }[]>();
  for (const item of inquiries) {
    const key = warsawYmd(item.record.createdAt || "") || "none";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  const parts: string[] = [];
  for (const [ymd, items] of groups) {
    parts.push(
      `<h2 class="admin-day" data-ymd="${escapeHtml(ymd === "none" ? "" : ymd)}" data-no-i18n>${escapeHtml(dayHeading(ymd === "none" ? "" : ymd, todayYmd))}</h2>`,
    );
    parts.push(`<div class="admin-day-list">${items.map((item) => inquiryCard(item.id, item.record, csrf, tab)).join("")}</div>`);
  }
  return `<div class="admin-feed">${parts.join("")}</div>`;
}

function dashboardPage(
  all: { id: string; record: InquiryRecord }[],
  tab: TabFilter,
  csrf: string,
  notice: string,
): string {
  const cleaning = all.filter((item) => item.record.service === "sprzatanie");
  const english = all.filter((item) => item.record.service === "angielski");
  const visible = tab === "sprzatanie" ? cleaning : tab === "angielski" ? english : all;

  const banner =
    notice === "deleted"
      ? `<p class="admin-banner" role="status">Zapytanie zostało usunięte.</p>`
      : notice === "delete-error"
        ? `<p class="admin-banner admin-banner--error" role="alert">Nie udało się usunąć zapytania. Odśwież stronę i spróbuj ponownie.</p>`
        : "";

  const tabBtn = (id: TabFilter, label: string, count: number) => {
    const current = tab === id;
    return `<a class="admin-tab${current ? " is-active" : ""}" href="${tabHref(id)}"${current ? ' aria-current="page"' : ""}>${escapeHtml(label)} <span>${count}</span></a>`;
  };

  return layout(
    "Zapytania — Clean & Speak",
    `<div class="admin-top">
        <div>
          <p class="eyebrow">Panel</p>
          <h1>Zapytania</h1>
          <p class="admin-count" data-admin-count="${all.length}" data-no-i18n>${polishCount(all.length, "zapytanie", "zapytania", "zapytań")} łącznie</p>
        </div>
        <div class="admin-actions">
          ${langToggle()}
          <form method="post" action="/admin/">
            <input type="hidden" name="intent" value="logout" />
            <button class="btn btn--ghost" type="submit">Wyloguj</button>
          </form>
        </div>
      </div>
      <nav class="admin-tabs" aria-label="Filtr zapytań">
        ${tabBtn("all", "Wszystkie", all.length)}
        ${tabBtn("sprzatanie", "Sprzątanie", cleaning.length)}
        ${tabBtn("angielski", "Angielski", english.length)}
      </nav>
      ${banner}
      ${groupedCards(visible, csrf, tab)}`,
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
      if (form.get("intent") === "delete") {
        const tab = parseTab(form.get("tab"));
        const session = readCookie(request, COOKIE_NAME);
        const id = form.get("id") ?? "";
        if (!(await csrfMatches(session, form.get("csrf") ?? "")) || !INQUIRY_ID_PATTERN.test(id)) {
          return redirect(tabHref(tab, { error: "delete" }));
        }
        await env.INQUIRIES.delete(`inquiry:${id}`);
        console.info(JSON.stringify({ event: "inquiry_deleted", inquiryId: id }));
        return redirect(tabHref(tab, { notice: "deleted" }));
      }
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

  const tab = parseTab(url.searchParams.get("tab"));
  const notice =
    url.searchParams.get("notice") === "deleted"
      ? "deleted"
      : url.searchParams.get("error") === "delete"
        ? "delete-error"
        : "";
  const csrf = await csrfToken(readCookie(request, COOKIE_NAME));
  const inquiries = await loadInquiries(env);
  return htmlResponse(dashboardPage(inquiries, tab, csrf, notice));
}

export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
