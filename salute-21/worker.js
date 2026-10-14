/**
 * Salute 21 Worker — booking API + SPA assets.
 *
 * /api/bookings/* is handled here (KV-backed).
 * Everything else goes to the Assets binding (SPA).
 * HTML shells get path-specific SEO meta injected for crawlers.
 */

const SITE = 'https://salute21.com'
const CAPACITY = 28
const MAX_PARTY = 12
const IG_CACHE_KEY = 'instagram:feed:v1'
/** Refresh Instagram feed at most once per hour (cron + lazy refresh) */
const IG_CACHE_TTL_MS = 60 * 60 * 1000
/** Fetch enough posts, then trim to a multiple of 4 for a Shopify-style grid */
const IG_FETCH_LIMIT = 24
const IG_GRID_MAX = 12
const IG_GRAPH = 'https://graph.facebook.com/v21.0'
const IG_HANDLE = 'salute__21'
const IG_PROFILE_URL = 'https://www.instagram.com/salute__21/'
/** Known public posts — topped up at refresh via search discovery */
const IG_SEED_SHORTCODES = ['Dc6pV8qMDIo', 'DcO5r6MDKfA', 'DbYIEMJMekz']
const IG_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

/** Live Google Maps reviews (5★ with guest photos only) */
const REVIEWS_CACHE_KEY = 'google:reviews:v2'
const REVIEWS_CACHE_TTL_MS = 60 * 60 * 1000
const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/7eyKAU1XQgMeXhKSA'
/** Feature id from the Salute 21 Google Maps listing */
const GOOGLE_MAPS_DATA_ID = '0x471ecb77022fa777:0x50b8b31522e29c7e'
const REVIEWS_MAX = 24
const SERPAPI_ENDPOINT = 'https://serpapi.com/search.json'

/** Path → SEO (kept in Worker so bots get correct tags without waiting for JS) */
const SEO_BY_PATH = {
  '/': {
    title: 'Salute 21 — Restaurant in Warsaw Wola | Egyptian Soul',
    description:
      'Salute 21 restaurant in Warszawa Wola (ul. Marcina Kasprzaka 24A). Egyptian-soul dining room, pizza, burgers, Turkish specials, brunch & table booking online.',
    ogType: 'website',
    robots: 'index, follow, max-image-preview:large',
  },
  '/menu': {
    title: 'Menu — Salute 21 Restaurant Warsaw | Pizza, Burgers, Turkish & Drinks',
    description:
      'Salute 21 menu: smash burgers with fries, 32 cm wood-fired pizza, sides, Turkish specials, hot & cold coffee, tea and soft drinks. Wola, Warsaw.',
    ogType: 'website',
    robots: 'index, follow, max-image-preview:large',
  },
  '/reserve': {
    title: 'Book a Table — Salute 21 Restaurant Warsaw Wola',
    description:
      'Reserve a table at Salute 21 in Warszawa Wola. Online booking for dinner, brunch and evenings — ul. Marcina Kasprzaka 24A.',
    ogType: 'website',
    robots: 'index, follow, max-image-preview:large',
  },
}

function seoForPath(pathname) {
  if (pathname.startsWith('/admin') || pathname.startsWith('/reserve/success')) {
    return {
      title: 'Salute 21',
      description: 'Salute 21 restaurant — Warsaw.',
      ogType: 'website',
      robots: 'noindex, nofollow',
    }
  }
  const key = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return SEO_BY_PATH[key] || SEO_BY_PATH['/']
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function injectSeo(html, requestUrl) {
  const url = new URL(requestUrl)
  const pathname = url.pathname || '/'
  const seo = seoForPath(pathname)
  const canonicalPath = pathname.startsWith('/reserve/success')
    ? '/reserve'
    : pathname.startsWith('/admin')
      ? '/'
      : pathname === '/'
        ? '/'
        : pathname.replace(/\/$/, '') || '/'
  const canonical =
    canonicalPath === '/' ? `${SITE}/` : `${SITE}${canonicalPath}`
  const image = `${SITE}/og.jpg`
  const title = escapeHtml(seo.title)
  const description = escapeHtml(seo.description)

  let out = html
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`)
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${description}" />`,
  )
  out = out.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${escapeHtml(seo.robots)}" />`,
  )
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${canonical}" />`,
  )

  const dynamicTags = `
    <meta property="og:type" content="${escapeHtml(seo.ogType)}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <link rel="alternate" hreflang="x-default" href="${canonical}" />
    <link rel="alternate" hreflang="en" href="${canonical}" />
    <link rel="alternate" hreflang="pl" href="${canonical}" />
  `

  // Refresh key OG/Twitter tags that exist in the shell
  out = out.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, '')
  out = out.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, '')
  out = out.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, '')
  out = out.replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, '')
  out = out.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, '')
  out = out.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, '')
  out = out.replace(/<link\s+rel="alternate"\s+hreflang="x-default"\s+href="[^"]*"\s*\/?>/i, '')
  out = out.replace(/<link\s+rel="alternate"\s+hreflang="en"\s+href="[^"]*"\s*\/?>/i, '')
  out = out.replace(/<link\s+rel="alternate"\s+hreflang="pl"\s+href="[^"]*"\s*\/?>/i, '')

  out = out.replace('</head>', `${dynamicTags}</head>`)
  return out
}

const WEEKDAY_SLOTS = {
  // Sunday 10:00–21:00
  0: [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  ],
  // Mon–Thu 09:00–23:00
  1: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  ],
  2: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  ],
  3: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  ],
  4: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
  ],
  // Fri–Sat 09:00–23:30
  5: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
  ],
  6: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
  ],
}

const LIST_KEY = 'bookings:list'

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

function randomByte() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    return crypto.getRandomValues(new Uint8Array(1))[0]
  }
  return Math.floor(Math.random() * 256)
}

/** S21-7L1R9S-0826 → place · digit/letter×3 · MMYY from reservation date */
function createId(dateStr, existingIds = []) {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const digits = '23456789'
  const taken = new Set(existingIds)

  const d = new Date(`${String(dateStr || '').slice(0, 10)}T12:00:00`)
  const valid = Number.isNaN(d.getTime()) ? new Date() : d
  const mm = String(valid.getMonth() + 1).padStart(2, '0')
  const yy = String(valid.getFullYear()).slice(-2)
  const stamp = `${mm}${yy}`

  for (let attempt = 0; attempt < 64; attempt++) {
    let code = ''
    for (let i = 0; i < 6; i++) {
      // Pattern: digit letter digit letter digit letter (e.g. 7L1R9S)
      const pool = i % 2 === 0 ? digits : letters
      code += pool[randomByte() % pool.length]
    }
    const id = `S21-${code}-${stamp}`
    if (!taken.has(id)) return id
  }

  // Extremely unlikely fallback — append extra entropy digit
  return `S21-${digits[randomByte() % digits.length]}${letters[randomByte() % letters.length]}${digits[randomByte() % digits.length]}${letters[randomByte() % letters.length]}${digits[randomByte() % digits.length]}${letters[randomByte() % letters.length]}-${stamp}`
}

function slotsForDate(dateStr) {
  const d = new Date(`${dateStr}T12:00:00`)
  if (Number.isNaN(d.getTime())) return []
  return WEEKDAY_SLOTS[d.getDay()] || []
}

function seatsUsed(list, date, time) {
  return list
    .filter((b) => b.date === date && b.time === time && b.status === 'confirmed')
    .reduce((sum, b) => sum + Number(b.guests || 0), 0)
}

async function readBookings(env) {
  try {
    const raw = await env.BOOKINGS.get(LIST_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeBookings(env, list) {
  await env.BOOKINGS.put(LIST_KEY, JSON.stringify(list))
}

function adminKey(env) {
  return String(env.ADMIN_KEY || 'baher')
}

function isAdmin(request, env) {
  const header = request.headers.get('X-Admin-Key') || ''
  const query = new URL(request.url).searchParams.get('key') || ''
  const provided = header || query
  return Boolean(provided) && provided === adminKey(env)
}

function trimToGrid(items, max = IG_GRID_MAX) {
  const capped = items.slice(0, max)
  // Prefer 4-column rows; still show 1–3 real posts rather than dropping them.
  if (capped.length < 4) return capped
  const count = Math.floor(capped.length / 4) * 4
  return capped.slice(0, count)
}

function normalizeIgMedia(raw) {
  const product = String(raw.media_product_type || '').toUpperCase()
  const mediaType = String(raw.media_type || '').toUpperCase()
  const isReel = product === 'REELS' || (mediaType === 'VIDEO' && product === 'REELS')
  const isVideo = mediaType === 'VIDEO' || isReel
  const isCarousel = mediaType === 'CAROUSEL_ALBUM'
  const childrenRaw = Array.isArray(raw.children?.data) ? raw.children.data : []

  let imageUrl = raw.thumbnail_url || raw.media_url || ''
  let videoUrl = isVideo ? raw.media_url || '' : ''
  const children = []

  for (const child of childrenRaw) {
    const childType = String(child.media_type || '').toUpperCase()
    const childImage = child.thumbnail_url || child.media_url || ''
    const childVideo = childType === 'VIDEO' ? child.media_url || '' : ''
    if (!childImage && !childVideo) continue
    children.push({
      type: childType === 'VIDEO' ? 'VIDEO' : 'IMAGE',
      imageUrl: childImage || undefined,
      videoUrl: childVideo || undefined,
    })
  }

  if (isCarousel && children.length) {
    const first = children[0]
    if (first.type === 'VIDEO') {
      imageUrl = first.imageUrl || imageUrl
      videoUrl = first.videoUrl || videoUrl
    } else {
      imageUrl = first.imageUrl || imageUrl
    }
  }

  if (!imageUrl) return null

  return {
    id: String(raw.id),
    type: isReel ? 'REEL' : isCarousel ? 'CAROUSEL' : isVideo ? 'VIDEO' : 'IMAGE',
    imageUrl,
    videoUrl: videoUrl || undefined,
    permalink: raw.permalink || IG_PROFILE_URL,
    caption: String(raw.caption || '').slice(0, 280),
    timestamp: raw.timestamp || null,
    childrenCount: isCarousel ? Math.max(children.length, 2) : children.length || undefined,
    children: children.length ? children.slice(0, 10) : undefined,
  }
}

/** Map SerpAPI instagram_profile posts → our feed shape */
function normalizeSerpIgPost(raw) {
  if (!raw || typeof raw !== 'object') return null
  const shortcode = String(raw.shortcode || raw.code || '').trim()
  const imageUrl =
    String(raw.display_url || raw.thumbnail_src || raw.thumbnail_tall_src || '').trim()
  if (!imageUrl) return null

  const product = String(raw.product_type || '').toLowerCase()
  const isVideo = Boolean(raw.is_video) || product === 'clips' || product === 'igtv'
  const isCarousel =
    product === 'carousel_container' ||
    product === 'carousel' ||
    Number(raw.sidecar_children_count || raw.carousel_media_count || 0) > 1
  const isReel = product === 'clips' || product === 'reels'

  const captions = Array.isArray(raw.media_captions)
    ? raw.media_captions
    : raw.caption
      ? [raw.caption]
      : []
  const caption = String(captions[0] || raw.accessibility_caption || '').slice(0, 280)
  const childrenCount = Number(raw.sidecar_children_count || raw.carousel_media_count || 0) || undefined

  return {
    id: String(raw.id || shortcode || imageUrl),
    type: isReel ? 'REEL' : isCarousel ? 'CAROUSEL' : isVideo ? 'VIDEO' : 'IMAGE',
    imageUrl,
    videoUrl: undefined,
    permalink: shortcode
      ? `https://www.instagram.com/${isReel ? 'reel' : 'p'}/${shortcode}/`
      : IG_PROFILE_URL,
    caption,
    timestamp: raw.taken_at_timestamp
      ? new Date(Number(raw.taken_at_timestamp) * 1000).toISOString()
      : null,
    childrenCount: isCarousel ? childrenCount || 2 : undefined,
  }
}

async function readIgCache(env) {
  try {
    const raw = await env.BOOKINGS.get(IG_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.items)) return null
    return parsed
  } catch {
    return null
  }
}

async function writeIgCache(env, payload) {
  await env.BOOKINGS.put(IG_CACHE_KEY, JSON.stringify(payload))
}

function igConfigured(env) {
  return Boolean(env.INSTAGRAM_ACCESS_TOKEN && env.INSTAGRAM_USER_ID)
}

function igSourceAvailable(env) {
  return igConfigured(env) || Boolean(env.SERPAPI_KEY)
}

async function fetchInstagramFromGraph(env) {
  const token = env.INSTAGRAM_ACCESS_TOKEN
  const userId = env.INSTAGRAM_USER_ID
  if (!token || !userId) {
    return { ok: false, reason: 'missing_credentials', items: [] }
  }

  const fields = [
    'id',
    'caption',
    'media_type',
    'media_product_type',
    'media_url',
    'thumbnail_url',
    'permalink',
    'timestamp',
    'children{media_type,media_url,thumbnail_url}',
  ].join(',')

  const endpoint =
    `${IG_GRAPH}/${encodeURIComponent(userId)}/media` +
    `?fields=${encodeURIComponent(fields)}` +
    `&limit=${IG_FETCH_LIMIT}` +
    `&access_token=${encodeURIComponent(token)}`

  const res = await fetch(endpoint, {
    headers: { accept: 'application/json' },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return {
      ok: false,
      reason: 'graph_error',
      error: data?.error?.message || `HTTP ${res.status}`,
      items: [],
    }
  }

  const items = (Array.isArray(data.data) ? data.data : [])
    .map(normalizeIgMedia)
    .filter(Boolean)

  return { ok: true, source: 'graph', items: trimToGrid(items, IG_GRID_MAX) }
}

async function fetchInstagramFromSerpApi(env) {
  const apiKey = env.SERPAPI_KEY
  if (!apiKey) {
    return { ok: false, reason: 'missing_credentials', items: [] }
  }

  const params = new URLSearchParams({
    engine: 'instagram_profile',
    profile_id: IG_HANDLE,
    api_key: apiKey,
  })
  const res = await fetch(`${SERPAPI_ENDPOINT}?${params.toString()}`, {
    headers: { accept: 'application/json' },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data?.error) {
    return {
      ok: false,
      reason: 'serpapi_error',
      error: data?.error || `HTTP ${res.status}`,
      items: [],
    }
  }

  const posts =
    data?.profile_results?.posts ||
    data?.posts ||
    data?.media ||
    []
  const items = (Array.isArray(posts) ? posts : [])
    .map(normalizeSerpIgPost)
    .filter(Boolean)

  if (!items.length) {
    return { ok: false, reason: 'serpapi_empty', items: [] }
  }

  return { ok: true, source: 'serpapi', items: trimToGrid(items, IG_GRID_MAX) }
}

function mapPublicTimelineEdges(edges) {
  if (!Array.isArray(edges) || !edges.length) return []
  return edges
    .map((edge) => {
      const node = edge?.node || edge
      if (!node) return null
      const isVideo = Boolean(node.is_video)
      const sidecar = node.edge_sidecar_to_children
      const isCarousel =
        node.__typename === 'GraphSidecar' ||
        Number(sidecar?.count || sidecar?.edges?.length || 0) > 1
      const isReel = String(node.product_type || '') === 'clips'
      const imageUrl = node.display_url || node.thumbnail_src || node.thumbnail_resources?.[0]?.src || ''
      if (!imageUrl) return null
      const shortcode = node.shortcode || ''
      const caption =
        node.edge_media_to_caption?.edges?.[0]?.node?.text ||
        node.accessibility_caption ||
        ''
      return {
        id: String(node.id || shortcode),
        type: isReel ? 'REEL' : isCarousel ? 'CAROUSEL' : isVideo ? 'VIDEO' : 'IMAGE',
        imageUrl,
        videoUrl: isVideo ? node.video_url || undefined : undefined,
        permalink: shortcode
          ? `https://www.instagram.com/${isReel ? 'reel' : 'p'}/${shortcode}/`
          : IG_PROFILE_URL,
        caption: String(caption).slice(0, 280),
        timestamp: node.taken_at_timestamp
          ? new Date(Number(node.taken_at_timestamp) * 1000).toISOString()
          : null,
        childrenCount: isCarousel
          ? Number(sidecar?.count || sidecar?.edges?.length || 2)
          : undefined,
      }
    })
    .filter(Boolean)
}

function extractEdgesFromHtml(html) {
  if (!html || typeof html !== 'string') return []
  // Common Relay / shared-data payloads Instagram still embeds for some clients
  const patterns = [
    /"edge_owner_to_timeline_media"\s*:\s*\{"count":\s*\d+\s*,\s*"edges"\s*:\s*(\[[\s\S]*?\])\s*,\s*"page_info"/,
    /"xdt_api__v1__feed__user_timeline_graphql_connection"\s*:\s*\{[\s\S]*?"edges"\s*:\s*(\[[\s\S]*?\])\s*,\s*"page_info"/,
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (!m) continue
    try {
      const edges = JSON.parse(m[1])
      const mapped = mapPublicTimelineEdges(edges)
      if (mapped.length) return mapped
    } catch {
      /* keep trying */
    }
  }

  // Fallback: collect shortcodes + nearby display URLs from the HTML
  const shortcodes = [...html.matchAll(/\/(?:p|reel)\/([A-Za-z0-9_-]{5,})\//g)].map((m) => m[1])
  const unique = [...new Set(shortcodes)].slice(0, IG_GRID_MAX)
  if (!unique.length) return []

  const items = []
  for (const code of unique) {
    const around = html.indexOf(code)
    const slice = around >= 0 ? html.slice(Math.max(0, around - 800), around + 1200) : ''
    const img =
      (slice.match(/https:\\\/\\\/[^"\\]+(?:cdninstagram|scontent)[^"\\]+\.jpg[^"\\]*/)?.[0] || '')
        .replace(/\\\//g, '/')
        .replace(/\\u0026/g, '&') ||
      (slice.match(/https:\/\/[^"\\]+(?:cdninstagram|scontent)[^"\\]+\.jpg[^"\\]*/)?.[0] || '')
    if (!img) continue
    const isReel = html.includes(`/reel/${code}/`)
    items.push({
      id: code,
      type: isReel ? 'REEL' : 'IMAGE',
      imageUrl: img,
      permalink: `https://www.instagram.com/${isReel ? 'reel' : 'p'}/${code}/`,
      caption: '',
      timestamp: null,
    })
  }
  return items
}

/**
 * Best-effort public profile scrape (Workers egress). Used only when Graph + SerpAPI
 * are unavailable — Instagram often blocks this; failures are non-fatal.
 */
async function fetchInstagramFromPublicWeb() {
  const headers = {
    accept: 'text/html,application/json,*/*',
    'accept-language': 'en-US,en;q=0.9',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'x-ig-app-id': '936619743392459',
    'x-requested-with': 'XMLHttpRequest',
    referer: IG_PROFILE_URL,
  }
  const errors = []

  try {
    const apiRes = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${IG_HANDLE}`,
      { headers },
    )
    const apiData = await apiRes.json().catch(() => ({}))
    if (apiRes.ok) {
      const edges = apiData?.data?.user?.edge_owner_to_timeline_media?.edges
      const items = mapPublicTimelineEdges(edges)
      if (items.length) {
        return { ok: true, source: 'public', items: trimToGrid(items, IG_GRID_MAX) }
      }
      errors.push('web_profile_info:empty')
    } else {
      errors.push(`web_profile_info:HTTP ${apiRes.status}`)
    }
  } catch (err) {
    errors.push(`web_profile_info:${String(err?.message || err)}`)
  }

  for (const url of [IG_PROFILE_URL, `${IG_PROFILE_URL}embed/`, `${IG_PROFILE_URL}?__a=1&__d=dis`]) {
    try {
      const res = await fetch(url, { headers: { ...headers, accept: 'text/html,*/*' } })
      const html = await res.text()
      if (!res.ok) {
        errors.push(`${url}:HTTP ${res.status}`)
        continue
      }
      const items = extractEdgesFromHtml(html)
      if (items.length) {
        return { ok: true, source: 'public_html', items: trimToGrid(items, IG_GRID_MAX) }
      }
      errors.push(`${url}:no_media`)
    } catch (err) {
      errors.push(`${url}:${String(err?.message || err)}`)
    }
  }

  return {
    ok: false,
    reason: 'public_blocked',
    error: errors.slice(0, 6).join(' | '),
    items: [],
  }
}

/** Discover public shortcodes (seed + DuckDuckGo) then hydrate via /media + embed. */
async function discoverIgShortcodes() {
  const codes = new Set(IG_SEED_SHORTCODES)
  const queries = [
    `${IG_HANDLE} site:instagram.com/p`,
    `${IG_HANDLE} site:instagram.com/reel`,
    `@${IG_HANDLE} Instagram`,
    `${IG_HANDLE} Warszawa Instagram`,
  ]
  for (const q of queries) {
    try {
      const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`, {
        headers: {
          accept: 'text/html',
          'user-agent': IG_UA,
          'accept-language': 'en-US,en;q=0.9',
        },
      })
      const html = await res.text()
      for (const m of html.matchAll(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/g)) {
        codes.add(m[1])
      }
      for (const m of html.matchAll(/uddg=([^&"]+)/g)) {
        try {
          const u = decodeURIComponent(m[1])
          for (const n of u.matchAll(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/g)) {
            codes.add(n[1])
          }
        } catch {
          /* ignore bad encoding */
        }
      }
    } catch {
      /* non-fatal */
    }
  }
  return [...codes]
}

async function hydrateIgShortcode(code, { trusted = false } = {}) {
  const headers = {
    accept: 'text/html,image/avif,image/webp,image/*,*/*',
    'user-agent': IG_UA,
    'accept-language': 'en-US,en;q=0.9',
    referer: IG_PROFILE_URL,
  }

  // Caption / type via embed (CF IPs often get a shell — seed codes stay trusted)
  let embedHtml = ''
  let isReel = false
  let owned = trusted
  for (const kind of ['p', 'reel']) {
    try {
      const res = await fetch(`https://www.instagram.com/${kind}/${code}/embed/captioned/`, {
        headers,
      })
      if (!res.ok) continue
      const html = await res.text()
      if (html.includes(IG_HANDLE) || trusted) {
        embedHtml = html
        owned = html.includes(IG_HANDLE) || trusted
        isReel = kind === 'reel' || html.includes('/reel/')
        if (html.includes(IG_HANDLE)) break
      }
    } catch {
      /* try next */
    }
  }
  if (!owned && !trusted) return null

  // Stable thumbnail endpoint (redirects to CDN jpeg)
  const mediaUrl = `https://www.instagram.com/p/${code}/media/?size=l`
  let imageOk = false
  try {
    const mediaRes = await fetch(mediaUrl, { headers, method: 'GET', redirect: 'follow' })
    const ctype = mediaRes.headers.get('content-type') || ''
    imageOk = mediaRes.ok && ctype.includes('image')
  } catch {
    imageOk = false
  }
  if (!imageOk) {
    const og = embedHtml.match(/property="og:image"\s+content="([^"]+)"/i)
    if (!og && !trusted) return null
    if (!og && trusted) {
      // Still publish the stable media URL — browsers resolve it with no-referrer
      imageOk = true
    }
  }

  let caption = ''
  const captionBlock = embedHtml.match(/class="Caption"[^>]*>([\s\S]*?)<\/div>/i)
  if (captionBlock) {
    caption = captionBlock[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  if (!caption) {
    const ogTitle = embedHtml.match(/property="og:title"\s+content="([^"]+)"/i)
    if (ogTitle) caption = ogTitle[1]
  }
  caption = String(caption || '')
    .replace(new RegExp(`^@?${IG_HANDLE}\\s*`, 'i'), '')
    .slice(0, 280)

  const isCarousel =
    /CoreCarousel|Sidecar|media-slideshow|Carousel/i.test(embedHtml) ||
    (embedHtml.match(/media-image/gi) || []).length > 1

  return {
    id: code,
    type: isReel ? 'REEL' : isCarousel ? 'CAROUSEL' : 'IMAGE',
    imageUrl: mediaUrl,
    permalink: `https://www.instagram.com/${isReel ? 'reel' : 'p'}/${code}/`,
    caption,
    timestamp: null,
    childrenCount: isCarousel ? 2 : undefined,
  }
}

async function fetchInstagramFromShortcodes() {
  const discovered = await discoverIgShortcodes()
  const seed = new Set(IG_SEED_SHORTCODES)
  const codes = [...new Set([...IG_SEED_SHORTCODES, ...discovered])]
  const items = []
  for (const code of codes.slice(0, IG_FETCH_LIMIT)) {
    try {
      const item = await hydrateIgShortcode(code, { trusted: seed.has(code) })
      if (item) items.push(item)
    } catch {
      /* skip bad code */
    }
  }
  if (!items.length) {
    return { ok: false, reason: 'shortcodes_empty', items: [] }
  }
  // Newest-looking shortcodes first (Instagram codes trend upward)
  items.sort((a, b) => String(b.id).localeCompare(String(a.id)))
  return { ok: true, source: 'shortcodes', items: trimToGrid(items, IG_GRID_MAX) }
}

async function fetchInstagramLive(env) {
  const errors = []
  if (igConfigured(env)) {
    const graph = await fetchInstagramFromGraph(env)
    if (graph.ok && graph.items.length) return graph
    errors.push(`graph:${graph.error || graph.reason || 'failed'}`)
  }
  if (env.SERPAPI_KEY) {
    const serp = await fetchInstagramFromSerpApi(env)
    if (serp.ok && serp.items.length) return serp
    errors.push(`serpapi:${serp.error || serp.reason || 'failed'}`)
  }
  const shortcodes = await fetchInstagramFromShortcodes()
  if (shortcodes.ok && shortcodes.items.length) return shortcodes
  errors.push(`shortcodes:${shortcodes.error || shortcodes.reason || 'failed'}`)

  const pub = await fetchInstagramFromPublicWeb()
  if (pub.ok && pub.items.length) return pub
  errors.push(`public:${pub.error || pub.reason || 'failed'}`)
  return {
    ok: false,
    reason: 'all_sources_failed',
    error: errors.slice(0, 4).join(' · '),
    items: [],
  }
}

async function refreshInstagramCache(env, { force = false } = {}) {
  const cached = await readIgCache(env)
  const age = cached?.fetchedAt ? Date.now() - Number(cached.fetchedAt) : Infinity
  if (!force && cached?.items?.length && age < IG_CACHE_TTL_MS) {
    return {
      ...cached,
      ok: true,
      configured: igSourceAvailable(env) || Boolean(cached.items?.length),
      fresh: false,
      source: cached.source || 'cache',
    }
  }

  const result = await fetchInstagramLive(env)
  if (!result.ok || !result.items?.length) {
    if (cached?.items?.length) {
      return {
        ...cached,
        ok: true,
        configured: igSourceAvailable(env) || true,
        fresh: false,
        source: 'cache_stale',
        lastError: result.error || result.reason,
      }
    }
    return {
      ok: false,
      configured: igSourceAvailable(env),
      reason: result.reason || 'missing_credentials',
      error: result.error,
      items: [],
      fetchedAt: null,
      fresh: false,
      source: igSourceAvailable(env) ? 'error' : 'unconfigured',
    }
  }

  const payload = {
    ok: true,
    configured: true,
    items: result.items,
    fetchedAt: Date.now(),
    count: result.items.length,
    source: result.source || 'live',
  }
  await writeIgCache(env, payload)
  return { ...payload, fresh: true }
}

function reviewsConfigured(env) {
  return Boolean(env.SERPAPI_KEY)
}

async function readReviewsCache(env) {
  try {
    const raw = await env.BOOKINGS.get(REVIEWS_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.items)) return null
    return parsed
  } catch {
    return null
  }
}

async function writeReviewsCache(env, payload) {
  await env.BOOKINGS.put(REVIEWS_CACHE_KEY, JSON.stringify(payload))
}

function extractReviewPhotos(raw) {
  const photos = []
  const push = (url) => {
    const value = String(url || '').trim()
    if (!value) return
    if (!/^https?:\/\//i.test(value)) return
    if (photos.includes(value)) return
    photos.push(value)
  }

  if (Array.isArray(raw?.images)) {
    for (const image of raw.images) {
      if (typeof image === 'string') push(image)
      else if (image && typeof image === 'object') {
        push(image.image || image.thumbnail || image.large || image.url || image.link)
      }
    }
  }
  if (Array.isArray(raw?.photos)) {
    for (const photo of raw.photos) {
      if (typeof photo === 'string') push(photo)
      else if (photo && typeof photo === 'object') {
        push(photo.url || photo.image || photo.thumbnail || photo.large)
      }
    }
  }
  return photos
}

function normalizeSerpReview(raw, index) {
  const rating = Number(raw?.rating)
  const text = String(raw?.snippet || raw?.extracted_snippet?.original || raw?.text || '').trim()
  const name = String(raw?.user?.name || raw?.author || '').trim()
  const photos = extractReviewPhotos(raw)

  // Hard rules: only real 5★ Google reviews that include guest photos + text.
  if (!(rating >= 5) || !text || !name || photos.length === 0) return null

  const idSeed = String(raw?.review_id || raw?.link || `${name}-${raw?.iso_date || raw?.date || index}`)
  return {
    id: idSeed.slice(0, 120),
    name,
    rating: 5,
    text,
    relativeTime: String(raw?.date || raw?.relative_time || '').trim() || undefined,
    photos,
    authorPhoto: String(raw?.user?.thumbnail || raw?.user?.link || '').trim() || undefined,
    mapsUrl: String(raw?.link || GOOGLE_MAPS_URL),
    photoCount: photos.length,
    isoDate: String(raw?.iso_date || raw?.published_at || '').trim() || undefined,
  }
}

async function fetchReviewsFromSerpApi(env) {
  const apiKey = env.SERPAPI_KEY
  if (!apiKey) {
    return { ok: false, reason: 'missing_credentials', items: [], rating: null, reviewCount: null }
  }

  const placeId = String(env.GOOGLE_PLACE_ID || '').trim()
  const collected = []
  let rating = null
  let reviewCount = null
  let nextPageToken = ''
  let pages = 0

  while (pages < 4 && collected.length < REVIEWS_MAX) {
    const params = new URLSearchParams({
      engine: 'google_maps_reviews',
      hl: 'en',
      sort_by: 'newest',
      api_key: apiKey,
    })
    if (placeId) params.set('place_id', placeId)
    else params.set('data_id', GOOGLE_MAPS_DATA_ID)
    if (nextPageToken) params.set('next_page_token', nextPageToken)

    const res = await fetch(`${SERPAPI_ENDPOINT}?${params.toString()}`, {
      headers: { accept: 'application/json' },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || data?.error) {
      return {
        ok: false,
        reason: 'serpapi_error',
        error: data?.error || `HTTP ${res.status}`,
        items: collected,
        rating,
        reviewCount,
      }
    }

    if (rating == null && data?.place_info?.rating != null) {
      rating = Number(data.place_info.rating)
    }
    if (reviewCount == null && data?.place_info?.reviews != null) {
      reviewCount = Number(data.place_info.reviews)
    }

    const batch = Array.isArray(data.reviews) ? data.reviews : []
    for (let i = 0; i < batch.length; i++) {
      const item = normalizeSerpReview(batch[i], collected.length + i)
      if (item) collected.push(item)
    }

    nextPageToken = String(data?.serpapi_pagination?.next_page_token || '').trim()
    pages += 1
    if (!nextPageToken || batch.length === 0) break
  }

  // Priority: more guest photos first, then newest.
  collected.sort((a, b) => {
    const photoDiff = (b.photoCount || 0) - (a.photoCount || 0)
    if (photoDiff !== 0) return photoDiff
    return String(b.isoDate || '').localeCompare(String(a.isoDate || ''))
  })

  const items = collected.slice(0, REVIEWS_MAX).map(({ photoCount, isoDate, ...rest }) => rest)

  return {
    ok: true,
    items,
    rating,
    reviewCount,
  }
}

async function refreshReviewsCache(env, { force = false } = {}) {
  const cached = await readReviewsCache(env)
  const age = cached?.fetchedAt ? Date.now() - Number(cached.fetchedAt) : Infinity
  if (!force && cached?.items?.length && age < REVIEWS_CACHE_TTL_MS) {
    return {
      ...cached,
      ok: true,
      configured: true,
      fresh: false,
      source: cached.source || 'cache',
      mapsUrl: cached.mapsUrl || GOOGLE_MAPS_URL,
    }
  }

  // Serve last good Google Maps cache even without SerpAPI — never invent reviews.
  if (!reviewsConfigured(env)) {
    if (cached?.items?.length) {
      return {
        ...cached,
        ok: true,
        configured: true,
        fresh: false,
        source: 'cache',
        mapsUrl: cached.mapsUrl || GOOGLE_MAPS_URL,
      }
    }
    return {
      ok: false,
      configured: false,
      reason: 'missing_credentials',
      items: [],
      rating: null,
      reviewCount: null,
      fetchedAt: null,
      fresh: false,
      source: 'unconfigured',
      mapsUrl: GOOGLE_MAPS_URL,
    }
  }

  const result = await fetchReviewsFromSerpApi(env)
  if (!result.ok) {
    if (cached?.items?.length) {
      return {
        ...cached,
        ok: true,
        configured: true,
        fresh: false,
        source: 'cache_stale',
        lastError: result.error || result.reason,
        mapsUrl: GOOGLE_MAPS_URL,
      }
    }
    return {
      ok: false,
      configured: true,
      reason: result.reason,
      error: result.error,
      items: [],
      rating: result.rating ?? null,
      reviewCount: result.reviewCount ?? null,
      fetchedAt: null,
      fresh: false,
      source: 'error',
      mapsUrl: GOOGLE_MAPS_URL,
    }
  }

  const payload = {
    ok: true,
    configured: true,
    items: result.items,
    rating: result.rating,
    reviewCount: result.reviewCount,
    fetchedAt: Date.now(),
    count: result.items.length,
    mapsUrl: GOOGLE_MAPS_URL,
    source: 'serpapi',
  }
  await writeReviewsCache(env, payload)
  return { ...payload, fresh: true }
}

async function handleApi(request, env) {
  const url = new URL(request.url)
  const path = url.pathname

  if (path === '/api/health') {
    return json({
      ok: true,
      service: 'salute-21-booking',
      idFormat: 'S21-DLDLDL-MMYY',
      instagramConfigured: igSourceAvailable(env),
      reviewsConfigured: reviewsConfigured(env),
    })
  }

  if (path === '/api/reviews' && request.method === 'GET') {
    const force = url.searchParams.get('refresh') === '1' && isAdmin(request, env)
    const feed = await refreshReviewsCache(env, { force })
    return json({
      ok: Boolean(feed.ok ?? feed.items?.length),
      configured: Boolean(feed.configured ?? reviewsConfigured(env)),
      source: feed.source || 'unknown',
      fetchedAt: feed.fetchedAt || null,
      rating: feed.rating ?? null,
      reviewCount: feed.reviewCount ?? null,
      count: Array.isArray(feed.items) ? feed.items.length : 0,
      items: feed.items || [],
      mapsUrl: feed.mapsUrl || GOOGLE_MAPS_URL,
      error: feed.error || undefined,
      reason: feed.reason || undefined,
    })
  }

  if (path === '/api/reviews/refresh' && request.method === 'POST') {
    if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401)
    const feed = await refreshReviewsCache(env, { force: true })
    return json(feed)
  }

  if (path === '/api/instagram' && request.method === 'GET') {
    const force = url.searchParams.get('refresh') === '1' && isAdmin(request, env)
    const feed = await refreshInstagramCache(env, { force })
    return json(
      {
        ok: Boolean(feed.ok ?? feed.items?.length),
        configured: Boolean(feed.configured ?? igSourceAvailable(env)),
        source: feed.source || 'unknown',
        fetchedAt: feed.fetchedAt || null,
        count: Array.isArray(feed.items) ? feed.items.length : 0,
        items: feed.items || [],
        handle: `@${IG_HANDLE}`,
        profileUrl: IG_PROFILE_URL,
        grid: 4,
        error: feed.error || undefined,
        reason: feed.reason || undefined,
      },
      feed.items?.length || feed.configured === false ? 200 : 502,
    )
  }

  if (path === '/api/instagram/refresh' && request.method === 'POST') {
    if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401)
    const feed = await refreshInstagramCache(env, { force: true })
    return json(feed)
  }

  if (path === '/api/bookings' && request.method === 'GET') {
    if (!isAdmin(request, env)) {
      return json({ error: 'Unauthorized' }, 401)
    }
    const list = await readBookings(env)
    // Newest first (already unshifted on create); sort by date+time for staff view
    const sorted = [...list].sort((a, b) => {
      const da = `${a.date || ''}T${a.time || '00:00'}`
      const db = `${b.date || ''}T${b.time || '00:00'}`
      return db.localeCompare(da)
    })
    return json({ bookings: sorted, count: sorted.length })
  }

  if (path === '/api/bookings/availability' && request.method === 'GET') {
    const date = String(url.searchParams.get('date') || '')
    const time = url.searchParams.get('time')
    if (!date) return json({ error: 'date required' }, 400)

    const slots = slotsForDate(date)
    const list = await readBookings(env)
    const map = {}
    for (const slot of slots) {
      map[slot] = Math.max(0, CAPACITY - seatsUsed(list, date, slot))
    }

    if (time) {
      return json({
        date,
        time,
        capacity: CAPACITY,
        remaining: map[time] ?? 0,
        slots: map,
      })
    }
    return json({ date, capacity: CAPACITY, slots: map })
  }

  if (path === '/api/bookings' && request.method === 'POST') {
    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON' }, 400)
    }

    const name = String(body.name || '').trim()
    const email = String(body.email || '').trim()
    const phone = String(body.phone || '').trim()
    const date = String(body.date || '').trim()
    const time = String(body.time || '').trim()
    const guests = Number(body.guests || 0)
    const occasion = String(body.occasion || '').trim()
    const notes = String(body.notes || '').trim()
    const lang = body.lang === 'pl' ? 'pl' : 'en'
    const titleRaw = String(body.title || '').trim().toLowerCase()
    const title = titleRaw === 'mr' || titleRaw === 'ms' || titleRaw === 'mrs' ? titleRaw : ''

    if (!name || !email || !phone || !date || !time || !guests || !title) {
      return json({ error: 'Missing required fields' }, 400)
    }
    if (guests < 1 || guests > MAX_PARTY) {
      return json({ error: 'Invalid party size' }, 400)
    }

    const d = new Date(`${date}T12:00:00`)
    if (Number.isNaN(d.getTime())) return json({ error: 'Invalid date' }, 400)

    // Compare against Warsaw calendar day (UTC+2 summer / approximate UTC+1 winter via offset)
    const now = new Date()
    const warsawToday = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Warsaw',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now)
    if (date < warsawToday) return json({ error: 'Invalid date' }, 400)

    const allowed = slotsForDate(date)
    if (!allowed.includes(time)) return json({ error: 'Invalid time slot' }, 400)

    const list = await readBookings(env)
    const used = seatsUsed(list, date, time)
    if (used + guests > CAPACITY) {
      return json({ error: 'This time slot is fully booked' }, 409)
    }

    const booking = {
      id: createId(
        date,
        list.map((b) => b.id),
      ),
      title,
      name,
      email,
      phone,
      date,
      time,
      guests,
      occasion,
      notes,
      lang,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }

    list.unshift(booking)
    // Keep store bounded
    await writeBookings(env, list.slice(0, 2000))
    await env.BOOKINGS.put(`booking:${booking.id}`, JSON.stringify(booking))
    return json(booking, 201)
  }

  const byId = path.match(/^\/api\/bookings\/([^/]+)$/)
  if (byId && request.method === 'DELETE') {
    if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401)
    const id = decodeURIComponent(byId[1])
    const list = await readBookings(env)
    const next = list.filter((b) => b.id !== id)
    if (next.length === list.length) return json({ error: 'Not found' }, 404)
    await writeBookings(env, next)
    try {
      await env.BOOKINGS.delete(`booking:${id}`)
    } catch {
      /* list is source of truth */
    }
    return json({ ok: true, id })
  }

  if (byId && request.method === 'GET') {
    const id = decodeURIComponent(byId[1])
    const direct = await env.BOOKINGS.get(`booking:${id}`)
    if (direct) {
      try {
        return json(JSON.parse(direct))
      } catch {
        /* fall through */
      }
    }
    const list = await readBookings(env)
    const booking = list.find((b) => b.id === id)
    if (!booking) return json({ error: 'Not found' }, 404)
    return json(booking)
  }

  if (path.startsWith('/api/')) {
    return json({ error: 'Not found' }, 404)
  }

  return null
}

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://salute21.com/</loc>
    <lastmod>2026-07-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://salute21.com/menu</loc>
    <lastmod>2026-07-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://salute21.com/reserve</loc>
    <lastmod>2026-07-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
`

const ROBOTS_TXT = `# Salute 21 — https://salute21.com
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /reserve/success/
Disallow: /api/

Sitemap: https://salute21.com/sitemap.xml
Host: salute21.com
`

export default {
  /** Hourly cron — refresh Instagram gallery + Google reviews caches */
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(
      Promise.all([
        refreshInstagramCache(env, { force: true }),
        refreshReviewsCache(env, { force: true }),
      ]),
    )
  },

  async fetch(request, env) {
    const url = new URL(request.url)

    // Single canonical host for SEO (www → apex)
    if (url.hostname === 'www.salute21.com') {
      url.hostname = 'salute21.com'
      return Response.redirect(url.toString(), 301)
    }

    // Serve SEO files from the Worker (never SPA-fallback these)
    if (request.method === 'GET' && url.pathname === '/sitemap.xml') {
      return new Response(SITEMAP_XML, {
        headers: {
          'content-type': 'application/xml; charset=utf-8',
          'cache-control': 'public, max-age=3600',
        },
      })
    }
    if (request.method === 'GET' && url.pathname === '/robots.txt') {
      return new Response(ROBOTS_TXT, {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'cache-control': 'public, max-age=3600',
        },
      })
    }

    const apiResponse = await handleApi(request, env)
    if (apiResponse) return apiResponse

    const assetResponse = await env.ASSETS.fetch(request)
    const contentType = assetResponse.headers.get('content-type') || ''
    const looksLikeAssetFile = /\.[a-z0-9]+$/i.test(url.pathname)
    const isHtmlShell =
      contentType.includes('text/html') ||
      (request.method === 'GET' && !looksLikeAssetFile)

    // Keep SPA shell fresh; inject path SEO so Google/social see the right tags
    if (isHtmlShell) {
      const headers = new Headers(assetResponse.headers)
      headers.set('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate')
      headers.set('Pragma', 'no-cache')
      headers.set('content-type', 'text/html; charset=utf-8')

      const html = await assetResponse.text()
      const withSeo = injectSeo(html, request.url)
      return new Response(withSeo, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers,
      })
    }

    return assetResponse
  },
}
