import { DurableObject } from "cloudflare:workers";
import { SEED_LISTINGS, type Listing } from "./seed";

const COOKIE_NAME = "rooms_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 60; // 60 يوم
const encoder = new TextEncoder();

export class ListingsStore extends DurableObject<Env> {
  async getAll(): Promise<Listing[]> {
    const stored = await this.ctx.storage.get<Listing[]>("listings");
    if (stored) return stored;
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
    const given = body?.password ?? "";
    if (!timingSafeEqual(given, env.SITE_PASSWORD)) {
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
    return json(await store(env).reset());
  }

  return json({ error: "not_found" }, { status: 404 });
}
