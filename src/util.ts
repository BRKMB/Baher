export const APP_UA = "Mawja/1.0 (Tesla navigation; https://github.com/BRKMB/Baher)";
const MAX_JSON_BYTES = 8_192;
const MAX_UPSTREAM_BYTES = 750_000;

export const securityHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "img-src 'self' data: blob: https://*.basemaps.cartocdn.com https://*.cartocdn.com https://server.arcgisonline.com https://*.arcgisonline.com https://i.scdn.co https://*.scdn.co https://*.spotifycdn.com",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' https://sdk.scdn.co",
    "connect-src 'self' https://api.spotify.com https://accounts.spotify.com https://*.spotify.com wss://*.spotify.com https://sdk.scdn.co",
    "media-src 'self' blob: mediastream: https://*.spotify.com https://*.scdn.co",
    "frame-src https://sdk.scdn.co https://open.spotify.com https://accounts.spotify.com",
    "font-src 'self' data:",
    "worker-src 'self' blob:",
    "base-uri 'none'",
    "form-action 'self' https://accounts.spotify.com",
    "frame-ancestors 'none'",
  ].join("; "),
  "Permissions-Policy":
    "geolocation=(self), autoplay=(self), encrypted-media=(self), accelerometer=(), camera=(), gyroscope=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
} as const;

export function jsonResponse(payload: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...securityHeaders,
      ...extraHeaders,
    },
  });
}

export async function readSmallJson(request: Request, maxBytes = MAX_JSON_BYTES): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxBytes) {
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
      if (totalLength > maxBytes) {
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
  return parsed as Record<string, unknown>;
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function rateLimit(env: Env, key: string, ttlSeconds: number): Promise<boolean> {
  const limited = await env.ALERTS.get(key);
  if (limited) {
    return false;
  }
  await env.ALERTS.put(key, "1", { expirationTtl: ttlSeconds });
  return true;
}

export function parseCoord(value: string | null): number | null {
  if (value == null || value === "") return null;
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return num;
}

export function parsePoint(value: string | null): { lat: number; lon: number } | null {
  if (!value) return null;
  const [latRaw, lonRaw] = value.split(",");
  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

export function clampBBox(url: URL): { minLat: number; minLon: number; maxLat: number; maxLon: number } | null {
  const minLat = parseCoord(url.searchParams.get("minLat"));
  const minLon = parseCoord(url.searchParams.get("minLon"));
  const maxLat = parseCoord(url.searchParams.get("maxLat"));
  const maxLon = parseCoord(url.searchParams.get("maxLon"));
  if (minLat == null || minLon == null || maxLat == null || maxLon == null) return null;
  if (minLat >= maxLat || minLon >= maxLon) return null;
  if (maxLat - minLat > 2.5 || maxLon - minLon > 2.5) return null;
  return { minLat, minLon, maxLat, maxLon };
}

export async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "User-Agent": APP_UA,
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Upstream ${response.status}`);
  }

  if (!response.body) {
    return response.json();
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalLength += value.byteLength;
      if (totalLength > MAX_UPSTREAM_BYTES) {
        await reader.cancel();
        throw new RangeError("Upstream response is too large");
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

  return JSON.parse(new TextDecoder().decode(body)) as unknown;
}

export function optionalEnvString(env: Env, name: string): string | undefined {
  const value = (env as unknown as Record<string, unknown>)[name];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
