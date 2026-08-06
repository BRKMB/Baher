const MAX_BODY_BYTES = 2_048;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

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

type SubscribePayload = {
  email?: unknown;
  company?: unknown;
  locale?: unknown;
};

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

async function readSmallJson(request: Request): Promise<SubscribePayload> {
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

  return parsed as SubscribePayload;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function subscribe(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse(
      { ok: false, message: "Method not allowed." },
      405,
      { Allow: "POST" },
    );
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ ok: false, message: "Send a JSON request." }, 415);
  }

  let payload: SubscribePayload;
  try {
    payload = await readSmallJson(request);
  } catch (error) {
    if (error instanceof RangeError) {
      return jsonResponse({ ok: false, message: error.message }, 413);
    }
    return jsonResponse({ ok: false, message: "Invalid request." }, 400);
  }

  // A hidden field catches basic bots without adding friction for real visitors.
  if (typeof payload.company === "string" && payload.company.length > 0) {
    return jsonResponse({ ok: true, message: "You're on the launch list." });
  }

  if (typeof payload.email !== "string") {
    return jsonResponse({ ok: false, message: "Enter a valid email address." }, 400);
  }

  const email = payload.email.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return jsonResponse({ ok: false, message: "Enter a valid email address." }, 400);
  }

  const clientAddress = request.headers.get("cf-connecting-ip");
  if (clientAddress) {
    const rateKey = `rate:${await sha256(clientAddress)}`;
    if (await env.WAITLIST.get(rateKey)) {
      return jsonResponse(
        { ok: false, message: "Please wait a moment before trying again." },
        429,
      );
    }
    await env.WAITLIST.put(rateKey, "1", { expirationTtl: 60 });
  }

  const emailKey = `email:${await sha256(email)}`;
  const existingSignup = await env.WAITLIST.get(emailKey);
  if (!existingSignup) {
    const locale =
      typeof payload.locale === "string" ? payload.locale.slice(0, 35) : "unknown";

    await env.WAITLIST.put(
      emailKey,
      JSON.stringify({
        email,
        locale,
        createdAt: new Date().toISOString(),
        source: "purkr-coming-soon",
      }),
    );
  }

  return jsonResponse({
    ok: true,
    message: existingSignup
      ? "You're already on the launch list."
      : "Transmission received. You're on the launch list.",
  });
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/subscribe") {
      try {
        return await subscribe(request, env);
      } catch (error) {
        console.error(
          JSON.stringify({
            event: "waitlist_signup_failed",
            message: error instanceof Error ? error.message : "Unknown error",
          }),
        );
        return jsonResponse(
          { ok: false, message: "Signal lost. Please try again." },
          500,
        );
      }
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const response = new Response(assetResponse.body, assetResponse);
    for (const [header, value] of Object.entries(securityHeaders)) {
      response.headers.set(header, value);
    }
    return response;
  },
} satisfies ExportedHandler<Env>;
