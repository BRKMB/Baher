import {
  clampBBox,
  fetchJson,
  isRecord,
  jsonResponse,
  optionalEnvString,
  parseCoord,
  parsePoint,
  rateLimit,
  readSmallJson,
  securityHeaders,
  sha256,
} from "./util";

const ALERT_TYPES = new Set(["police", "accident", "hazard", "traffic", "camera", "closure"]);
const ALERT_TTL = 2 * 60 * 60;
const MAX_ALERTS = 400;

type Alert = {
  id: string;
  type: string;
  lat: number;
  lon: number;
  createdAt: string;
  source: "community" | "osm" | "waze";
  street?: string;
};

type NominatimHit = {
  display_name?: string;
  lat?: string;
  lon?: string;
  type?: string;
  class?: string;
  name?: string;
};

type OsrmRoute = {
  distance?: number;
  duration?: number;
  geometry?: { coordinates?: [number, number][] };
  legs?: Array<{
    steps?: Array<{
      name?: string;
      distance?: number;
      duration?: number;
      maneuver?: {
        type?: string;
        modifier?: string;
        location?: [number, number];
        instruction?: string;
      };
    }>;
  }>;
};

function applySecurity(response: Response): Response {
  const next = new Response(response.body, response);
  for (const [header, value] of Object.entries(securityHeaders)) {
    next.headers.set(header, value);
  }
  return next;
}

async function cachedJson(env: Env, key: string, ttl: number, loader: () => Promise<unknown>): Promise<unknown> {
  const hit = await env.ALERTS.get(key, "json");
  if (hit) return hit;
  const value = await loader();
  await env.ALERTS.put(key, JSON.stringify(value), { expirationTtl: ttl });
  return value;
}

function configFromRequest(request: Request, env: Env) {
  const latitude = Number(request.cf?.latitude);
  const longitude = Number(request.cf?.longitude);
  return {
    spotifyClientId: env.SPOTIFY_CLIENT_ID || "",
    defaultCenter: {
      lat: Number.isFinite(latitude) ? latitude : 30.0444,
      lon: Number.isFinite(longitude) ? longitude : 31.2357,
    },
    city: request.cf?.city ?? "",
    country: request.cf?.country ?? "",
  };
}

async function geocode(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim();
  const language = (url.searchParams.get("lang") ?? "ar").slice(0, 8);
  if (query.length < 2 || query.length > 120) {
    return jsonResponse({ ok: false, message: "Enter a place name." }, 400);
  }

  const nearLat = parseCoord(url.searchParams.get("lat"));
  const nearLon = parseCoord(url.searchParams.get("lon"));
  const cacheKey = `geo:${await sha256(`${language}:${query.toLowerCase()}:${nearLat ?? ""}:${nearLon ?? ""}`)}`;
  const results = await cachedJson(env, cacheKey, 1800, async () => {
    const endpoint = new URL("https://nominatim.openstreetmap.org/search");
    endpoint.searchParams.set("q", query);
    endpoint.searchParams.set("format", "jsonv2");
    endpoint.searchParams.set("limit", "6");
    endpoint.searchParams.set("addressdetails", "0");
    endpoint.searchParams.set("accept-language", language);
    if (nearLat != null && nearLon != null) {
      endpoint.searchParams.set(
        "viewbox",
        `${nearLon - 0.45},${nearLat + 0.45},${nearLon + 0.45},${nearLat - 0.45}`,
      );
    }
    const payload = await fetchJson(endpoint.toString());
    const hits = Array.isArray(payload) ? payload : [];
    return hits.slice(0, 6).map((item) => {
      const hit = item as NominatimHit;
      return {
        name: hit.name || hit.display_name || query,
        label: hit.display_name || hit.name || query,
        lat: Number(hit.lat),
        lon: Number(hit.lon),
        kind: hit.type || hit.class || "place",
      };
    });
  });

  return jsonResponse({ ok: true, results });
}

async function reverseGeocode(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const lat = parseCoord(url.searchParams.get("lat"));
  const lon = parseCoord(url.searchParams.get("lon"));
  if (lat == null || lon == null || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return jsonResponse({ ok: false, message: "Invalid coordinates." }, 400);
  }

  const cacheKey = `rev:${lat.toFixed(4)}:${lon.toFixed(4)}`;
  const result = await cachedJson(env, cacheKey, 1800, async () => {
    const endpoint = new URL("https://nominatim.openstreetmap.org/reverse");
    endpoint.searchParams.set("lat", String(lat));
    endpoint.searchParams.set("lon", String(lon));
    endpoint.searchParams.set("format", "jsonv2");
    endpoint.searchParams.set("zoom", "16");
    const payload = await fetchJson(endpoint.toString());
    if (!isRecord(payload)) return { label: "", name: "" };
    return {
      label: typeof payload.display_name === "string" ? payload.display_name : "",
      name: typeof payload.name === "string" ? payload.name : "",
    };
  });

  return jsonResponse({ ok: true, result });
}

function compactRoute(route: OsrmRoute) {
  const steps = [];
  for (const leg of route.legs ?? []) {
    for (const step of leg.steps ?? []) {
      const location = step.maneuver?.location;
      steps.push({
        instruction: step.maneuver?.instruction || "",
        type: step.maneuver?.type || "turn",
        modifier: step.maneuver?.modifier || "",
        name: step.name || "",
        distance: Math.round(step.distance ?? 0),
        duration: Math.round(step.duration ?? 0),
        lat: location?.[1] ?? 0,
        lon: location?.[0] ?? 0,
      });
    }
  }

  return {
    distance: Math.round(route.distance ?? 0),
    duration: Math.round(route.duration ?? 0),
    geometry: (route.geometry?.coordinates ?? []).map(([lon, lat]) => [lat, lon] as [number, number]),
    steps,
  };
}

async function route(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const from = parsePoint(url.searchParams.get("from"));
  const to = parsePoint(url.searchParams.get("to"));
  if (!from || !to) {
    return jsonResponse({ ok: false, message: "Need from and to coordinates." }, 400);
  }

  const cacheKey = `route:${from.lat.toFixed(4)},${from.lon.toFixed(4)}:${to.lat.toFixed(4)},${to.lon.toFixed(4)}`;
  const results = await cachedJson(env, cacheKey, 180, async () => {
    const path = `${from.lon},${from.lat};${to.lon},${to.lat}`;
    const endpoint =
      `https://router.project-osrm.org/route/v1/driving/${path}` +
      "?overview=full&geometries=geojson&steps=true&alternatives=true";
    const payload = await fetchJson(endpoint);
    if (!isRecord(payload) || payload.code !== "Ok" || !Array.isArray(payload.routes)) {
      throw new Error("No route");
    }
    return (payload.routes as OsrmRoute[]).slice(0, 3).map(compactRoute);
  });

  return jsonResponse({ ok: true, routes: results });
}

async function listAlerts(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const bbox = clampBBox(url);
  if (!bbox) {
    return jsonResponse({ ok: false, message: "Invalid map bounds." }, 400);
  }

  const stored = (await env.ALERTS.get("alerts:list", "json")) as Alert[] | null;
  const community = (stored ?? []).filter(
    (alert) =>
      alert.lat >= bbox.minLat &&
      alert.lat <= bbox.maxLat &&
      alert.lon >= bbox.minLon &&
      alert.lon <= bbox.maxLon,
  );

  let cameras: Alert[] = [];
  try {
    cameras = await loadCameras(env, bbox);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "mawja_cameras_failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
  }

  let live: Alert[] = [];
  try {
    live = await loadWazeAlerts(env, bbox);
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "mawja_waze_failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    );
  }

  return jsonResponse({ ok: true, alerts: [...live, ...community, ...cameras] });
}

async function createAlert(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405, { Allow: "POST" });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await readSmallJson(request);
  } catch (error) {
    if (error instanceof RangeError) {
      return jsonResponse({ ok: false, message: error.message }, 413);
    }
    return jsonResponse({ ok: false, message: "Invalid request." }, 400);
  }

  const type = typeof payload.type === "string" ? payload.type : "";
  const lat = typeof payload.lat === "number" ? payload.lat : Number(payload.lat);
  const lon = typeof payload.lon === "number" ? payload.lon : Number(payload.lon);
  if (!ALERT_TYPES.has(type) || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    return jsonResponse({ ok: false, message: "Invalid report." }, 400);
  }
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return jsonResponse({ ok: false, message: "Invalid report." }, 400);
  }

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const allowed = await rateLimit(env, `rate:alert:${await sha256(ip)}`, 20);
  if (!allowed) {
    return jsonResponse({ ok: false, message: "Please wait before sending another report." }, 429);
  }

  const alert: Alert = {
    id: crypto.randomUUID(),
    type,
    lat,
    lon,
    createdAt: new Date().toISOString(),
    source: "community",
  };

  const stored = ((await env.ALERTS.get("alerts:list", "json")) as Alert[] | null) ?? [];
  const next = [alert, ...stored].slice(0, MAX_ALERTS);
  await env.ALERTS.put("alerts:list", JSON.stringify(next), { expirationTtl: ALERT_TTL });
  return jsonResponse({ ok: true, alert });
}

function mapWazeType(type: unknown): string | null {
  if (type === "POLICE") return "police";
  if (type === "ACCIDENT") return "accident";
  if (type === "HAZARD") return "hazard";
  if (type === "ROAD_CLOSED") return "closure";
  if (type === "JAM") return "traffic";
  return null;
}

async function loadWazeAlerts(
  env: Env,
  bbox: { minLat: number; minLon: number; maxLat: number; maxLon: number },
): Promise<Alert[]> {
  const key = `waze:${bbox.minLat.toFixed(2)}:${bbox.minLon.toFixed(2)}:${bbox.maxLat.toFixed(2)}:${bbox.maxLon.toFixed(2)}`;
  const cached = await cachedJson(env, key, 60, async () => {
    const centerLon = (bbox.minLon + bbox.maxLon) / 2;
    const region = centerLon >= -170 && centerLon <= -30 ? "na" : "row";
    const endpoint = new URL("https://www.waze.com/live-map/api/georss");
    endpoint.searchParams.set("left", String(bbox.minLon));
    endpoint.searchParams.set("right", String(bbox.maxLon));
    endpoint.searchParams.set("bottom", String(bbox.minLat));
    endpoint.searchParams.set("top", String(bbox.maxLat));
    endpoint.searchParams.set("env", region);
    endpoint.searchParams.set("types", "alerts");
    const payload = await fetchJson(endpoint.toString());
    const raw = isRecord(payload) && Array.isArray(payload.alerts) ? payload.alerts : [];
    return raw
      .map((item): Alert | null => {
        if (!isRecord(item) || !isRecord(item.location)) return null;
        const mapped = mapWazeType(item.type);
        const lat = typeof item.location.y === "number" ? item.location.y : null;
        const lon = typeof item.location.x === "number" ? item.location.x : null;
        if (!mapped || lat == null || lon == null) return null;
        const uuid = typeof item.uuid === "string" ? item.uuid : `${mapped}:${lat}:${lon}`;
        const street = typeof item.street === "string" ? item.street : "";
        const published = typeof item.pubMillis === "number" ? item.pubMillis : Date.now();
        return {
          id: `waze-${uuid}`,
          type: mapped,
          lat,
          lon,
          createdAt: new Date(published).toISOString(),
          source: "waze",
          street,
        };
      })
      .filter((item): item is Alert => item !== null)
      .slice(0, 180);
  });

  return Array.isArray(cached) ? (cached as Alert[]) : [];
}

async function loadCameras(
  env: Env,
  bbox: { minLat: number; minLon: number; maxLat: number; maxLon: number },
): Promise<Alert[]> {
  const key = `cam:${bbox.minLat.toFixed(2)}:${bbox.minLon.toFixed(2)}:${bbox.maxLat.toFixed(2)}:${bbox.maxLon.toFixed(2)}`;
  const cached = await cachedJson(env, key, 900, async () => {
    const query = `[out:json][timeout:8];node(${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon})[highway=speed_camera];out body 80;`;
    const payload = await fetchJson("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: `data=${encodeURIComponent(query)}`,
    });
    const elements = isRecord(payload) && Array.isArray(payload.elements) ? payload.elements : [];
    return elements
      .map((item): Alert | null => {
        if (!isRecord(item)) return null;
        const lat = typeof item.lat === "number" ? item.lat : null;
        const lon = typeof item.lon === "number" ? item.lon : null;
        const id = item.id;
        if (lat == null || lon == null) return null;
        return {
          id: `osm-cam-${String(id)}`,
          type: "camera",
          lat,
          lon,
          createdAt: new Date().toISOString(),
          source: "osm",
        };
      })
      .filter((item): item is Alert => item !== null);
  });

  return Array.isArray(cached) ? (cached as Alert[]) : [];
}

async function speedLimit(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const lat = parseCoord(url.searchParams.get("lat"));
  const lon = parseCoord(url.searchParams.get("lon"));
  if (lat == null || lon == null) {
    return jsonResponse({ ok: false, message: "Invalid coordinates." }, 400);
  }

  const key = `limit:${lat.toFixed(4)}:${lon.toFixed(4)}`;
  const result = await cachedJson(env, key, 120, async () => {
    const query = `[out:json][timeout:6];way(around:35,${lat},${lon})[maxspeed];out tags 4;`;
    const payload = await fetchJson("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: `data=${encodeURIComponent(query)}`,
    });
    const elements = isRecord(payload) && Array.isArray(payload.elements) ? payload.elements : [];
    for (const item of elements) {
      if (!isRecord(item) || !isRecord(item.tags)) continue;
      const raw = item.tags.maxspeed;
      if (typeof raw !== "string") continue;
      const numeric = Number.parseInt(raw, 10);
      if (Number.isFinite(numeric) && numeric > 0 && numeric < 200) {
        return { limit: numeric };
      }
    }
    return { limit: null };
  });

  return jsonResponse({ ok: true, result });
}

async function spotifyToken(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405, { Allow: "POST" });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await readSmallJson(request);
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request." }, 400);
  }

  const clientId =
    (typeof payload.client_id === "string" && payload.client_id) || env.SPOTIFY_CLIENT_ID;
  const code = typeof payload.code === "string" ? payload.code : "";
  const verifier = typeof payload.code_verifier === "string" ? payload.code_verifier : "";
  const redirectUri = typeof payload.redirect_uri === "string" ? payload.redirect_uri : "";
  if (!clientId || !code || !verifier || !redirectUri) {
    return jsonResponse({ ok: false, message: "Missing Spotify credentials." }, 400);
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: verifier,
  });

  const secret = optionalEnvString(env, "SPOTIFY_CLIENT_SECRET");
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };
  if (secret) {
    headers.Authorization = `Basic ${btoa(`${clientId}:${secret}`)}`;
  }

  const upstream = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers,
    body,
  });

  const tokenPayload = await fetchJsonFromResponse(upstream);
  if (!upstream.ok) {
    return jsonResponse({ ok: false, message: "Spotify login failed.", details: tokenPayload }, 400);
  }
  return jsonResponse({ ok: true, tokens: tokenPayload });
}

async function spotifyRefresh(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Method not allowed." }, 405, { Allow: "POST" });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await readSmallJson(request);
  } catch {
    return jsonResponse({ ok: false, message: "Invalid request." }, 400);
  }

  const clientId =
    (typeof payload.client_id === "string" && payload.client_id) || env.SPOTIFY_CLIENT_ID;
  const refreshToken = typeof payload.refresh_token === "string" ? payload.refresh_token : "";
  if (!clientId || !refreshToken) {
    return jsonResponse({ ok: false, message: "Missing refresh token." }, 400);
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const secret = optionalEnvString(env, "SPOTIFY_CLIENT_SECRET");
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };
  if (secret) {
    headers.Authorization = `Basic ${btoa(`${clientId}:${secret}`)}`;
  }

  const upstream = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers,
    body,
  });
  const tokenPayload = await fetchJsonFromResponse(upstream);
  if (!upstream.ok) {
    return jsonResponse({ ok: false, message: "Spotify refresh failed." }, 400);
  }
  return jsonResponse({ ok: true, tokens: tokenPayload });
}

async function fetchJsonFromResponse(response: Response): Promise<unknown> {
  const text = await readResponseText(response, 20_000);
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text.slice(0, 200) };
  }
}

async function readResponseText(response: Response, maxBytes: number): Promise<string> {
  if (!response.body) {
    return response.text();
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalLength += value.byteLength;
      if (totalLength > maxBytes) {
        await reader.cancel();
        break;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(Math.min(totalLength, maxBytes));
  let offset = 0;
  for (const chunk of chunks) {
    const remaining = body.byteLength - offset;
    if (remaining <= 0) break;
    body.set(chunk.byteLength > remaining ? chunk.slice(0, remaining) : chunk, offset);
    offset += Math.min(chunk.byteLength, remaining);
  }
  return new TextDecoder().decode(body);
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/config") {
        return jsonResponse({ ok: true, config: configFromRequest(request, env) });
      }
      if (url.pathname === "/api/geocode") {
        return await geocode(request, env);
      }
      if (url.pathname === "/api/reverse") {
        return await reverseGeocode(request, env);
      }
      if (url.pathname === "/api/route") {
        return await route(request, env);
      }
      if (url.pathname === "/api/alerts" && request.method === "GET") {
        return await listAlerts(request, env);
      }
      if (url.pathname === "/api/alerts" && request.method === "POST") {
        return await createAlert(request, env);
      }
      if (url.pathname === "/api/speed-limit") {
        return await speedLimit(request, env);
      }
      if (url.pathname === "/api/spotify/token") {
        return await spotifyToken(request, env);
      }
      if (url.pathname === "/api/spotify/refresh") {
        return await spotifyRefresh(request, env);
      }
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "mawja_api_failed",
          path: url.pathname,
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );
      return jsonResponse({ ok: false, message: "Service busy. Try again." }, 502);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    return applySecurity(assetResponse);
  },
} satisfies ExportedHandler<Env>;
