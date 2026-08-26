import { DurableObject } from "cloudflare:workers";
import { SEED_LISTINGS, type CriterionValue, type Listing } from "./seed";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const COOKIE_NAME = "rooms_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 60; // 60 يوم
const encoder = new TextEncoder();

export class ListingsStore extends DurableObject<Env> {
  async getAll(): Promise<Listing[]> {
    const stored = await this.ctx.storage.get<Listing[]>("listings");
    if (stored) {
      // Non-destructive schema/content migration: add newly fetched photos,
      // new fields, and only fill criteria the user has not answered yet.
      let changed = false;
      const seedById = new Map(SEED_LISTINGS.map((listing) => [listing.id, listing]));
      const migrated = stored.map((listing) => {
        const seed = seedById.get(listing.id);
        if (!seed) return listing;
        const next = { ...listing };
        if (!next.propertyType) {
          next.propertyType = seed.propertyType ?? "room";
          changed = true;
        }
        if (!Array.isArray(next.photos) || next.photos.length === 0) {
          next.photos = seed.photos;
          changed = true;
        }
        if (next.garageCost === undefined) {
          next.garageCost = seed.garageCost;
          changed = true;
        }
        if (next.areaSqm === undefined) {
          next.areaSqm = seed.areaSqm;
          changed = true;
        }
        if (next.extrasEst === undefined) {
          next.extrasEst = seed.extrasEst ?? null;
          changed = true;
        }
        if (next.extrasNote === undefined) {
          next.extrasNote = seed.extrasNote ?? "";
          changed = true;
        }
        const criteria = { ...next.criteria };
        for (const [key, seedValue] of Object.entries(seed.criteria)) {
          if ((criteria[key] ?? "unknown") === "unknown" && seedValue !== "unknown") {
            criteria[key] = seedValue;
            changed = true;
          }
        }
        next.criteria = criteria;
        return next;
      });
      if (changed) await this.ctx.storage.put("listings", migrated);
      return migrated;
    }
    await this.ctx.storage.put("listings", SEED_LISTINGS);
    return SEED_LISTINGS;
  }

  async upsert(listing: Listing): Promise<Listing[]> {
    const listings = await this.getAll();
    const idx = listings.findIndex((l) => l.id === listing.id);
    if (idx >= 0) {
      listings[idx] = listing;
    } else {
      listing.createdAt = Date.now();
      listings.push(listing);
    }
    await this.ctx.storage.put("listings", listings);
    return listings;
  }

  async remove(id: string): Promise<Listing[]> {
    const listings = (await this.getAll()).filter((l) => l.id !== id);
    await this.ctx.storage.put("listings", listings);
    return listings;
  }

  async reset(): Promise<Listing[]> {
    await this.ctx.storage.put("listings", SEED_LISTINGS);
    return SEED_LISTINGS;
  }
}

async function sessionTokenFor(password: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(`warsaw-rooms-v1:${password}`)
  );
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  const ab = encoder.encode(a);
  const bb = encoder.encode(b);
  if (ab.byteLength !== bb.byteLength) return false;
  return crypto.subtle.timingSafeEqual(ab, bb);
}

/** يوحّد الأرقام العربية/الفارسية للمقارنة (٧٧٧ → 777) */
function normalizePassword(password: string): string {
  return password
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

async function isAuthed(request: Request, env: Env): Promise<boolean> {
  const cookie = getCookie(request, COOKIE_NAME);
  if (!cookie) return false;
  const expected = await sessionTokenFor(env.SITE_PASSWORD);
  return timingSafeEqual(cookie, expected);
}

function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "Content-Type": "application/json; charset=utf-8", ...init.headers }
  });
}

function unauthorized(): Response {
  return json({ error: "unauthorized" }, { status: 401 });
}

function store(env: Env): DurableObjectStub<ListingsStore> {
  return env.STORE.get(env.STORE.idFromName("main"));
}

function isLocalizedText(v: unknown): boolean {
  if (typeof v === "string") return true;
  if (typeof v !== "object" || v === null) return false;
  const t = v as Record<string, unknown>;
  return typeof t.ar === "string" || typeof t.en === "string";
}

function isValidListing(body: unknown): body is Listing {
  if (typeof body !== "object" || body === null) return false;
  const l = body as Record<string, unknown>;
  return (
    typeof l.id === "string" &&
    l.id.length > 0 &&
    isLocalizedText(l.title) &&
    typeof l.url === "string" &&
    typeof l.rent === "number" &&
    typeof l.criteria === "object" &&
    l.criteria !== null
  );
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    try {
      if (pathname.startsWith("/api/")) {
        return await handleApi(request, env, pathname);
      }
      if (pathname === "/logout") {
        return new Response(null, {
          status: 303,
          headers: {
            Location: "/",
            "Set-Cookie": `${COOKIE_NAME}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`
          }
        });
      }
      // الصفحة نفسها شيل فاضي — كل البيانات وراء الباسورد في الـ API
      return await env.ASSETS.fetch(request);
    } catch (err) {
      console.error(JSON.stringify({ message: "unhandled_error", error: String(err), pathname }));
      return json({ error: "internal_error" }, { status: 500 });
    }
  }
} satisfies ExportedHandler<Env>;

async function handleApi(request: Request, env: Env, pathname: string): Promise<Response> {
  if (pathname === "/api/login" && request.method === "POST") {
    const body = (await request.json().catch(() => null)) as { password?: string } | null;
    const given = normalizePassword(body?.password ?? "");
    const expected = normalizePassword(env.SITE_PASSWORD);
    if (!timingSafeEqual(given, expected)) {
      return json({ error: "wrong_password" }, { status: 401 });
    }
    const token = await sessionTokenFor(env.SITE_PASSWORD);
    return json(
      { ok: true },
      {
        headers: {
          "Set-Cookie": `${COOKIE_NAME}=${token}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`
        }
      }
    );
  }

  if (pathname === "/api/logout" && request.method === "POST") {
    return json(
      { ok: true },
      { headers: { "Set-Cookie": `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } }
    );
  }

  const authed = await isAuthed(request, env);

  if (pathname === "/api/session" && request.method === "GET") {
    return json({ authed });
  }

  if (!authed) return unauthorized();

  if (pathname === "/api/listings" && request.method === "GET") {
    return json(await store(env).getAll());
  }

  if (pathname === "/api/listings" && request.method === "POST") {
    const body = await request.json().catch(() => null);
    if (!isValidListing(body)) return json({ error: "invalid_listing" }, { status: 400 });
    return json(await store(env).upsert(body));
  }

  const match = pathname.match(/^\/api\/listings\/([^/]+)$/);
  if (match) {
    const id = decodeURIComponent(match[1]);
    if (request.method === "PUT") {
      const body = await request.json().catch(() => null);
      if (!isValidListing(body) || body.id !== id) {
        return json({ error: "invalid_listing" }, { status: 400 });
      }
      return json(await store(env).upsert(body));
    }
    if (request.method === "DELETE") {
      return json(await store(env).remove(id));
    }
  }

  if (pathname === "/api/reset" && request.method === "POST") {
    const body = (await request.json().catch(() => null)) as { password?: string } | null;
    const given = normalizePassword(body?.password ?? "");
    const expected = normalizePassword(env.RESTORE_PASSWORD || "333");
    if (!timingSafeEqual(given, expected)) {
      return json({ error: "wrong_restore_password" }, { status: 403 });
    }
    return json(await store(env).reset());
  }

  if (pathname === "/api/import" && request.method === "POST") {
    const body = (await request.json().catch(() => null)) as { url?: string } | null;
    let target: URL;
    try {
      target = new URL(body?.url ?? "");
    } catch {
      return json({ error: "bad_url" }, { status: 400 });
    }
    if (!/(^|\.)olx\.pl$|(^|\.)otodom\.pl$/.test(target.hostname)) {
      return json({ error: "unsupported_site" }, { status: 400 });
    }
    let res = await fetch(target.toString(), {
      headers: { "User-Agent": BROWSER_UA, "Accept-Language": "pl,en;q=0.8" }
    });
    const isOtodom = target.hostname.includes("otodom");
    if (!res.ok && isOtodom) {
      // Otodom blocks most server-side clients. Jina Reader is a read-only
      // text proxy and gives us the same public listing in Markdown.
      const readerUrl = `https://r.jina.ai/http://${target.host}${target.pathname}${target.search}`;
      res = await fetch(readerUrl, { headers: { "User-Agent": BROWSER_UA } });
      if (!res.ok) return json({ error: "fetch_failed", status: res.status }, { status: 502 });
      const markdown = await readTextLimited(res);
      const draft = parseOtodomMarkdown(markdown, target.toString());
      if (!draft) return json({ error: "parse_failed" }, { status: 422 });
      return json(draft);
    }
    if (!res.ok) return json({ error: "fetch_failed", status: res.status }, { status: 502 });
    const html = await readTextLimited(res);
    const draft = isOtodom ? parseOtodom(html, target.toString()) : parseOlx(html, target.toString());
    if (!draft) return json({ error: "parse_failed" }, { status: 422 });
    return json(draft);
  }

  return json({ error: "not_found" }, { status: 404 });
}

/* ===== استيراد تلقائي من OLX / Otodom ===== */

async function readTextLimited(response: Response, maxBytes = 8_000_000): Promise<string> {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new Error("listing_too_large");
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

function analyzeDescription(text: string, opts: { isBusiness?: boolean; rooms?: number | null }) {
  const t = text.toLowerCase();
  const criteria: Record<string, CriterionValue> = {
    oven: "unknown",
    dishwasher: "unknown",
    bed: "unknown",
    spacious: "unknown",
    garage: "unknown",
    max3: "unknown",
    desk: "unknown",
    modern: "unknown",
    elevator: "unknown",
    availableAug: "unknown",
    noCommission: "unknown",
    noOccasional: "unknown"
  };

  if (/piekarnik/.test(t)) criteria.oven = "yes";
  if (/zmywark|dishwasher/.test(t)) criteria.dishwasher = "yes";
  if (/winda|wind[ąa]/.test(t)) criteria.elevator = "yes";
  if (/(gara[żz]|parking|miejsce postojowe)/.test(t)) {
    criteria.garage = /(bezp[łl]atn|darmow|w cenie|gratis)/.test(t) ? "yes" : "unknown";
  }
  if (/(wysokiej jako[śs]ci materac|wygodn\w* ([łl][óo][żz]ko|materac)|du[żz]e [łl][óo][żz]ko)/.test(t)) {
    criteria.bed = "yes";
  }
  if (/naro[żz]nik|sofa rozk[łl]adan|kanapa rozk[łl]adan/.test(t)) criteria.bed = "no";
  if (/du[żz]e biurko|biurko \d{3}|biurko o szeroko[śs]ci/.test(t)) criteria.desk = "yes";
  else if (/biurk/.test(t)) criteria.desk = "unknown";
  if (/(po remoncie|wyremontowan|nowe budownictwo|nowoczesn|po generalnym|nowym budynku)/.test(t)) {
    criteria.modern = "yes";
  }
  if (/(przestronn|du[żz]y pok[óo]j|bardzo du[żz]y)/.test(t)) criteria.spacious = "yes";
  const areaMatch = t.match(/(?:pok[óo]j.{0,40})?(\d{1,3}(?:[.,]\d+)?)\s*m(?:2|²|\b)/);
  const areaSqm = areaMatch ? Number(areaMatch[1].replace(",", ".")) : null;
  if (areaSqm != null) criteria.spacious = areaSqm >= 14 ? "yes" : "no";

  // عدد الأوض في الشقة
  let rooms = opts.rooms ?? null;
  if (rooms == null) {
    const m = t.match(/(\d)\s*[- ]?\s*pokojow/);
    if (m) rooms = Number(m[1]);
    else {
      const m2 = t.match(/mieszkanie ma .{0,10}(pi[ęe][ćc]|cztery|trzy|dwa) pokoi/);
      if (m2) rooms = { "pięć": 5, "piec": 5, cztery: 4, trzy: 3, dwa: 2 }[m2[1]] ?? null;
    }
  }
  if (rooms != null) criteria.max3 = rooms <= 3 ? "yes" : "no";
  else if (/tylko\s*3\s*osob|3\s*osoby\s*w mieszkaniu/.test(t)) criteria.max3 = "yes";

  // متاحة إمتى
  let availableFrom = "";
  const availMatch = t.match(/(?:woln[ye]|dost[ęe]pn\w*)\s*(?:od|:)?\s*(?:od)?\s*:?\s*(\d{1,2}[./]\d{1,2}(?:[./]\d{2,4})?)/);
  if (availMatch) availableFrom = availMatch[1];
  else if (/od zaraz|dost[ęe]pn\w* od zaraz|woln[ye] od zaraz/.test(t)) availableFrom = "Available now";
  else {
    const m = t.match(/od\s+(\d{1,2})[./](\d{1,2})/);
    if (m) availableFrom = `${m[1]}.${m[2]}`;
  }
  if (availableFrom) {
    const am = availableFrom.match(/(\d{1,2})[./](\d{1,2})/);
    if (am) {
      const month = Number(am[2]);
      const day = Number(am[1]);
      criteria.availableAug = month < 8 || (month === 8 && day <= 1) ? "yes" : "no";
    } else if (/^available now$/i.test(availableFrom)) {
      criteria.availableAug = "yes";
    }
  } else if (/od zaraz/.test(t)) {
    criteria.availableAug = "yes";
    availableFrom = "Available now";
  } else {
    const monthName = t.match(
      /(?:woln[ye]|dost[ęe]pn\w*)\s*(?:od)?\s*(\d{1,2})?\s*(sierpnia|wrze[śs]nia|pa[źz]dziernika)/
    );
    if (monthName) {
      const day = Number(monthName[1] || 1);
      const month = monthName[2].startsWith("sier") ? 8 : monthName[2].startsWith("wrze") ? 9 : 10;
      availableFrom = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
      criteria.availableAug = month === 8 && day <= 1 ? "yes" : "no";
    }
  }

  if (/bez prowizji|0% prowizji/.test(t)) criteria.noCommission = "yes";
  else if (/prowizj/.test(t)) criteria.noCommission = "no";
  else if (opts.isBusiness === false) criteria.noCommission = "yes";

  // najem okazjonalny = عقد occasional (غالبًا تقيل على الأجانب)
  if (/najem\s+okazjonaln|umow\w*\s+.*okazjonaln|okazjonaln\w*/.test(t)) {
    criteria.noOccasional = "no";
  } else if (/umow\w*\s+najmu(?!\s+okazjonaln)|legaln\w*\s+umow\w*\s+najmu/.test(t)) {
    criteria.noOccasional = "yes";
  }

  // المصاريف والديبوزيت
  let bills: number | null = null;
  const billsMatch =
    t.match(/\+\s*(\d{2,4})\s*(?:z[łl]|pln)?\s*op[łl]at/) ||
    t.match(/op[łl]aty?\s*:?\s*(\d{2,4})/) ||
    t.match(/(\d{2,4})\s*(?:z[łl]|pln)\s*op[łl]at/) ||
    t.match(/rycza[łl]t\s*:?\s*(\d{2,4})/);
  if (billsMatch) bills = Number(billsMatch[1]);

  let deposit: number | null = null;
  const depositMatch = t.match(/kaucj\w*\s*(?:zwrotn\w*)?\s*(?:w wysoko[śs]ci)?\s*:?\s*(\d{3,5})/);
  if (depositMatch) deposit = Number(depositMatch[1]);

  return { criteria, bills, deposit, availableFrom, areaSqm };
}

function draftFromParts(parts: {
  url: string;
  title: string;
  description: string;
  rent: number | null;
  photos: string[];
  district: string;
  address: string;
  contactName: string;
  isBusiness?: boolean;
  rooms?: number | null;
  areaSqm?: number | null;
  bills?: number | null;
  deposit?: number | null;
}): Partial<Listing> {
  const analyzed = analyzeDescription(parts.description || "", {
    isBusiness: parts.isBusiness,
    rooms: parts.rooms ?? null
  });
  const typeText = `${parts.title} ${parts.description}`.toLowerCase();
  const propertyType: NonNullable<Listing["propertyType"]> =
    /kawalerk|studio/.test(typeText)
      ? "studio"
      : /mieszkanie|apartament/.test(typeText) && !/pok[óo]j/.test(parts.title.toLowerCase())
        ? "flat"
        : /pok[óo]j/.test(typeText)
          ? "room"
          : "other";
  if (propertyType === "studio") {
    analyzed.criteria.max3 = "yes";
  }
  const area = parts.areaSqm ?? analyzed.areaSqm;
  const place = parts.district || "Warsaw";
  const typeEn = { room: "Room", studio: "Studio", flat: "Flat", other: "Place" }[propertyType];
  const typeAr = { room: "أوضة", studio: "ستوديو", flat: "شقة", other: "مكان" }[propertyType];
  const areaEn = area != null ? ` ${area}m²` : "";
  const areaAr = area != null ? ` ${area}م²` : "";
  // عناوين إنجليزي/عربي — الأسماء المكانية بس اللي ممكن تفضل بولندي
  const title = {
    en: `${typeEn}${areaEn} — ${place}`,
    ar: `${typeAr}${areaAr} — ${place}`
  };
  return {
    id: `room-${Date.now()}`,
    propertyType,
    title,
    district: parts.district,
    address: parts.address,
    url: parts.url,
    rent: parts.rent ?? 0,
    bills: parts.bills ?? analyzed.bills,
    garageCost: null,
    areaSqm: area,
    deposit: parts.deposit ?? analyzed.deposit,
    commuteMin: null,
    availableFrom: analyzed.availableFrom,
    contact: parts.contactName,
    notes: {
      ar: "⚡ اتجابت تلقائيًا من اللينك — راجع العلامات والأسعار وكمّل الناقص.",
      en: "⚡ Auto-imported from the link — review the marks and prices and fill in the gaps."
    },
    photos: parts.photos,
    criteria: analyzed.criteria,
    createdAt: Date.now(),
    // temporary enrichment helper (ignored by storage validation if not posted)
    sourceTitle: parts.title,
    sourceDescription: (parts.description || "").slice(0, 5000)
  } as Partial<Listing> & { sourceTitle?: string; sourceDescription?: string };
}

function parseOlx(html: string, url: string): Partial<Listing> | null {
  const m = html.match(/__PRERENDERED_STATE__\s*=\s*("(?:[^"\\]|\\.)*")/);
  if (!m) return null;
  try {
    const state = JSON.parse(JSON.parse(m[1]));
    const ad = state?.ad?.ad;
    if (!ad?.title) return null;
    const photos: string[] = (ad.photos || []).map((p: string) =>
      p.replace(":443", "").replace(/;s=\d+x\d+/, ";s=1200x900")
    );
    const priceMatch = String(ad.price?.displayValue ?? "").replace(/\s/g, "").match(/(\d+)/);
    const rent = ad.price?.regularPrice?.value ?? (priceMatch ? Number(priceMatch[1]) : null);
    const district = ad.location?.districtName || ad.location?.cityName || "";
    const address = [ad.location?.cityName, ad.location?.districtName].filter(Boolean).join(", ");
    const description = String(ad.description || "").replace(/<[^>]+>/g, " ");
    return draftFromParts({
      url,
      title: ad.title,
      description,
      rent,
      photos,
      district,
      address: address || "Warszawa",
      contactName: ad.contact?.name ? `${ad.contact.name} — OLX` : "OLX",
      isBusiness: ad.isBusiness === true ? true : ad.isBusiness === false ? false : undefined
    });
  } catch {
    return null;
  }
}

function parseOtodom(html: string, url: string): Partial<Listing> | null {
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    const data = JSON.parse(m[1]);
    const ad = data?.props?.pageProps?.ad;
    if (!ad?.title) return null;
    const chars: { key: string; value: string }[] = ad.characteristics || [];
    const charVal = (key: string) => chars.find((c) => c.key === key)?.value;
    const rentRaw = ad.target?.Price ?? charVal("price");
    const rent = rentRaw != null ? Number(String(rentRaw).replace(/[^\d]/g, "")) : null;
    const billsRaw = charVal("rent");
    const depositRaw = charVal("deposit");
    const roomsRaw = charVal("rooms_num");
    const areaRaw = charVal("m") || charVal("area");
    const photos: string[] = (ad.images || [])
      .map((i: { large?: string; medium?: string }) => i.large || i.medium)
      .filter(Boolean);
    const addr = ad.location?.address;
    const district = addr?.district?.name || addr?.city?.name || "";
    const address = [addr?.street?.name, addr?.district?.name, addr?.city?.name]
      .filter(Boolean)
      .join(", ");
    const description = String(ad.description || "").replace(/<[^>]+>/g, " ");
    return draftFromParts({
      url,
      title: ad.title,
      description,
      rent,
      photos,
      district,
      address: address || "Warszawa",
      contactName: ad.owner?.name ? `${ad.owner.name} — Otodom` : "Otodom",
      rooms: roomsRaw ? Number(roomsRaw) : null,
      areaSqm: areaRaw ? Number(String(areaRaw).replace(",", ".").replace(/[^\d.]/g, "")) : null,
      bills: billsRaw ? Number(String(billsRaw).replace(/[^\d]/g, "")) : null,
      deposit: depositRaw ? Number(String(depositRaw).replace(/[^\d]/g, "")) : null
    });
  } catch {
    return null;
  }
}

function parseOtodomMarkdown(markdown: string, url: string): Partial<Listing> | null {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  if (!titleMatch) return null;
  const title = titleMatch[1].trim();
  const titleIndex = markdown.indexOf(titleMatch[0]);
  const content = markdown.slice(titleIndex);
  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);

  const rentMatch =
    content.match(/(\d[\d\s]*)\s*z[łl]\/miesi[ąa]c/i) ||
    title.match(/(\d[\d\s]*)\s*z[łl]/i);
  const billsMatch =
    content.match(/\+\s*Czynsz\s+(\d[\d\s]*)\s*z[łl]/i) ||
    content.match(/Dodatkowy koszt:\s*\n?\s*(\d[\d\s]*)\s*z[łl]/i);
  const depositMatch = content.match(/Kaucja:\s*\n?\s*(\d[\d\s]*)\s*z[łl]/i);
  const areaMatch = content.match(/Powierzchnia:\s*\n?\s*(\d+(?:[.,]\d+)?)\s*m²/i);
  const availableMatch = content.match(/Dost[ęe]pne od:\s*\n?\s*([^\n]+)/i);
  const privateOffer = /Typ og[łl]oszeniodawcy:\s*\n?\s*prywatny/i.test(content);

  const photos = [
    ...new Set(
      [...markdown.matchAll(/!\[[^\]]*\]\((https:\/\/[^)\s]*apollo\.olxcdn\.com[^)\s]*)\)/g)]
        .map((m) => m[1].replace(/;s=\d+x\d+[^)]*/, ";s=1200x900"))
    )
  ];

  // First non-empty line after the heading is normally the full address.
  const headingLine = lines.findIndex((line) => line === `# ${title}`);
  const address = lines.slice(headingLine + 1).find((line) =>
    /Warszawa|mazowieckie|ul\./i.test(line)
  ) || "";
  const district =
    address.split(",").map((s) => s.trim()).find((s) =>
      /Wola|Mokotów|Ochota|Ursynów|Bielany|Praga|Śródmieście|Bemowo|Żoliborz/i.test(s)
    ) || "";

  const descriptionMatch = content.match(/## Opis\s*([\s\S]*?)(?:## |ID:|Zgłoś)/i);
  const description = descriptionMatch?.[1] || content;
  const draft = draftFromParts({
    url,
    title,
    description,
    rent: rentMatch ? Number(rentMatch[1].replace(/\s/g, "")) : null,
    photos,
    district,
    address,
    contactName: "Otodom",
    isBusiness: privateOffer ? false : undefined,
    bills: billsMatch ? Number(billsMatch[1].replace(/\s/g, "")) : null,
    deposit: depositMatch ? Number(depositMatch[1].replace(/\s/g, "")) : null,
    areaSqm: areaMatch ? Number(areaMatch[1].replace(",", ".")) : null
  });
  if (availableMatch && !/brak informacji/i.test(availableMatch[1])) {
    draft.availableFrom = availableMatch[1].trim();
  }
  return draft;
}
