import { handleAdmin, isAdminPath } from "./admin";

const MAX_BODY_BYTES = 12_288;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;
const PHONE_PATTERN = /^[+0-9()/\s-]{6,24}$/u;
const TEXT_LIMIT = 500;
const MESSAGE_LIMIT = 2000;

const ALLOWED_SERVICES = new Set(["sprzatanie", "angielski"]);

const CLEANING_FIELDS = {
  propertyType: ["mieszkanie", "dom", "placowka", "biuro", "inne"],
  cleaningType: ["cykliczne", "jednorazowe", "okna", "po-remoncie", "inne"],
} as const;

const ENGLISH_FIELDS = {
  format: ["online", "stacjonarnie", "nie-wiem"],
  lessonMode: ["indywidualne", "nie-wiem"],
  goal: ["dzieci", "szkolny", "egzamin", "konwersacje", "bariera", "inne"],
} as const;

const SITE_PATHS = [
  "/",
  "/sprzatanie/",
  "/angielski/",
  "/o-nas/",
  "/kontakt/",
  "/polityka-prywatnosci/",
  "/regulamin/",
  "/cookies/",
];

const NOINDEX_PATHS = new Set(["/polityka-prywatnosci/", "/regulamin/", "/cookies/"]);

const EVENT_NAME_PATTERN = /^[a-z0-9_-]{1,40}$/u;

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

type InquiryPayload = Record<string, unknown>;

function jsonResponse(payload: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...securityHeaders,
      ...extraHeaders,
    },
  });
}

function textResponse(body: string, type: string, extraHeaders?: HeadersInit): Response {
  return new Response(body, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=3600",
      ...securityHeaders,
      ...extraHeaders,
    },
  });
}

function asTrimmedString(value: unknown, max = TEXT_LIMIT): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isAllowed(value: string, allowed: readonly string[]): boolean {
  return allowed.includes(value);
}

async function readSmallJson(request: Request): Promise<InquiryPayload> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    throw new RangeError("Request body is too large");
  }

  if (!request.body) {
    return {};
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalLength += value.byteLength;
      if (totalLength > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new RangeError("Request body is too large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const parsed: unknown = JSON.parse(new TextDecoder().decode(body));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {};
  }

  return parsed as InquiryPayload;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function sitemapXml(origin: string): string {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = SITE_PATHS.filter((path) => !NOINDEX_PATHS.has(path)).map((path) => {
    const loc = `${origin}${path === "/" ? "/" : path}`;
    const priority = path === "/" ? "1.0" : path === "/kontakt/" ? "0.9" : "0.8";
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function robotsTxt(origin: string): string {
  const disallowed = ["/api/", "/admin/", "/dziekujemy/", ...NOINDEX_PATHS]
    .map((path) => `Disallow: ${path}`)
    .join("\n");
  return `User-agent: *\nAllow: /\n${disallowed}\n\nSitemap: ${origin}/sitemap.xml\n`;
}

/**
 * Cookieless page and interaction counts. Nothing that identifies a visitor is
 * stored: no cookie, no client id, no IP, no full referrer URL.
 */
async function handleEvent(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST", ...securityHeaders } });
  }

  try {
    const payload = await readSmallJson(request);
    const name = asTrimmedString(payload.name, 40);
    if (!EVENT_NAME_PATTERN.test(name)) {
      return new Response(null, { status: 204, headers: securityHeaders });
    }

    console.info(
      JSON.stringify({
        event: "site_event",
        name,
        path: asTrimmedString(payload.path, 120),
        href: asTrimmedString(payload.href, 200),
        referrer: asTrimmedString(payload.referrer, 120),
        country: request.headers.get("cf-ipcountry") ?? "",
      }),
    );
  } catch {
    /* measurement must never surface an error to the visitor */
  }

  return new Response(null, { status: 204, headers: securityHeaders });
}

async function handleInquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Niedozwolona metoda." }, 405, { Allow: "POST" });
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ ok: false, message: "Wyślij zapytanie w formacie JSON." }, 415);
  }

  let payload: InquiryPayload;
  try {
    payload = await readSmallJson(request);
  } catch (error) {
    if (error instanceof RangeError) {
      return jsonResponse({ ok: false, message: "Wiadomość jest zbyt długa." }, 413);
    }
    return jsonResponse({ ok: false, message: "Nie udało się odczytać formularza." }, 400);
  }

  if (asTrimmedString(payload.company).length > 0) {
    return jsonResponse({ ok: true, message: "Dziękujemy. Odezwiemy się tak szybko, jak to możliwe." });
  }

  const service = asTrimmedString(payload.service, 20);
  if (!ALLOWED_SERVICES.has(service)) {
    return jsonResponse({ ok: false, message: "Wybierz usługę: sprzątanie albo angielski." }, 400);
  }

  const name = asTrimmedString(payload.name, 120);
  if (name.length < 2) {
    return jsonResponse({ ok: false, message: "Podaj imię i nazwisko albo imię." }, 400);
  }

  const email = asTrimmedString(payload.email, 254).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    return jsonResponse({ ok: false, message: "Podaj poprawny adres e-mail." }, 400);
  }

  const phone = asTrimmedString(payload.phone, 24);
  if (phone && !PHONE_PATTERN.test(phone)) {
    return jsonResponse({ ok: false, message: "Podaj poprawny numer telefonu albo zostaw to pole puste." }, 400);
  }

  const message = asTrimmedString(payload.message, MESSAGE_LIMIT);
  const consent = payload.consent === true || payload.consent === "true";
  if (!consent) {
    return jsonResponse({ ok: false, message: "Aby wysłać zapytanie, potwierdź zgodę na kontakt." }, 400);
  }

  const record: Record<string, string> = {
    service,
    name,
    email,
    phone,
    message,
    createdAt: new Date().toISOString(),
  };

  if (service === "sprzatanie") {
    const propertyType = asTrimmedString(payload.propertyType, 40);
    const cleaningType = asTrimmedString(payload.cleaningType, 40);
    if (propertyType && !isAllowed(propertyType, CLEANING_FIELDS.propertyType)) {
      return jsonResponse({ ok: false, message: "Wybierz rodzaj nieruchomości z listy." }, 400);
    }
    if (cleaningType && !isAllowed(cleaningType, CLEANING_FIELDS.cleaningType)) {
      return jsonResponse({ ok: false, message: "Wybierz rodzaj sprzątania z listy." }, 400);
    }
    record.propertyType = propertyType;
    record.sizeApprox = asTrimmedString(payload.sizeApprox, 80);
    record.cleaningType = cleaningType;
    record.frequency = asTrimmedString(payload.frequency, 80);
    record.preferredDate = asTrimmedString(payload.preferredDate, 40);
    record.location = asTrimmedString(payload.location, 160);
    record.extras = asTrimmedString(payload.extras, 240);
  }

  if (service === "angielski") {
    const format = asTrimmedString(payload.format, 40);
    const lessonMode = asTrimmedString(payload.lessonMode, 40);
    const goal = asTrimmedString(payload.goal, 40);
    if (format && !isAllowed(format, ENGLISH_FIELDS.format)) {
      return jsonResponse({ ok: false, message: "Wybierz formę zajęć z listy." }, 400);
    }
    if (lessonMode && !isAllowed(lessonMode, ENGLISH_FIELDS.lessonMode)) {
      return jsonResponse({ ok: false, message: "Wybierz tryb zajęć z listy." }, 400);
    }
    if (goal && !isAllowed(goal, ENGLISH_FIELDS.goal)) {
      return jsonResponse({ ok: false, message: "Wybierz cel nauki z listy." }, 400);
    }
    record.studentLevel = asTrimmedString(payload.studentLevel, 120);
    record.format = format;
    record.lessonMode = lessonMode;
    record.goal = goal;
    record.preferredDays = asTrimmedString(payload.preferredDays, 120);
    record.preferredTime = asTrimmedString(payload.preferredTime, 120);
  }

  const clientAddress = request.headers.get("cf-connecting-ip");
  if (clientAddress) {
    const rateKey = `rate:${await sha256(clientAddress)}`;
    if (await env.INQUIRIES.get(rateKey)) {
      return jsonResponse(
        { ok: false, message: "Poczekaj chwilę, zanim wyślesz kolejne zapytanie." },
        429,
      );
    }
    await env.INQUIRIES.put(rateKey, "1", { expirationTtl: 60 });
  }

  const inquiryId = crypto.randomUUID();
  await env.INQUIRIES.put(
    `inquiry:${inquiryId}`,
    JSON.stringify(record),
    { expirationTtl: 60 * 60 * 24 * 180 },
  );

  console.info(
    JSON.stringify({
      event: "inquiry_received",
      service,
      inquiryId,
    }),
  );

  return jsonResponse({
    ok: true,
    message: "Dziękujemy. Odezwiemy się tak szybko, jak to możliwe.",
  });
}

const CREDIT_MARK =
  /<div class="wrap footer-credit">\s*<p>Made with ❤️ by <a href="https:\/\/brkmb\.com\/" target="_blank" rel="noopener">Baher Magally<\/a><\/p>\s*<\/div>/;

function stripHtmlComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

function creditIntact(html: string): boolean {
  return CREDIT_MARK.test(stripHtmlComments(html));
}

function withCreditScript(html: string): string {
  if (html.includes('src="/js/seal.js"')) return html;
  if (!html.includes("</head>")) return html;
  return html.replace("</head>", '    <script src="/js/seal.js" defer></script>\n</head>');
}

function brokenSite(): Response {
  return new Response(
    "<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex\"><title></title></head><body></body></html>",
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        ...securityHeaders,
      },
    },
  );
}

async function withSecurityHeaders(response: Response, origin: string): Promise<Response> {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    const html = (await response.text()).replaceAll("__ORIGIN__", origin);
    if (!creditIntact(html)) {
      return brokenSite();
    }
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "public, max-age=3600");
    for (const [header, value] of Object.entries(securityHeaders)) {
      headers.set(header, value);
    }
    return new Response(withCreditScript(html), {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  const next = new Response(response.body, response);
  for (const [header, value] of Object.entries(securityHeaders)) {
    next.headers.set(header, value);
  }
  return next;
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const origin = url.origin;

    if (url.pathname === "/sitemap.xml") {
      return textResponse(sitemapXml(origin), "application/xml; charset=utf-8");
    }

    if (url.pathname === "/robots.txt") {
      return textResponse(robotsTxt(origin), "text/plain; charset=utf-8");
    }

    if (url.pathname === "/api/event") {
      return handleEvent(request);
    }

    if (isAdminPath(url.pathname)) {
      return handleAdmin(request, env);
    }

    if (url.pathname === "/api/inquire") {
      try {
        return await handleInquiry(request, env);
      } catch (error) {
        console.error(
          JSON.stringify({
            event: "inquiry_failed",
            message: error instanceof Error ? error.message : "Unknown error",
          }),
        );
        return jsonResponse(
          { ok: false, message: "Nie udało się wysłać zapytania. Spróbuj ponownie." },
          500,
        );
      }
    }

    const assetResponse = await env.ASSETS.fetch(request);
    return withSecurityHeaders(assetResponse, origin);
  },
} satisfies ExportedHandler<Env>;
