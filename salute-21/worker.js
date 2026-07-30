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

/** Path → SEO (kept in Worker so bots get correct tags without waiting for JS) */
const SEO_BY_PATH = {
  '/': {
    title: 'Salute 21 — Restaurant in Warsaw Wola | Egyptian Soul Fine Dining',
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
  0: [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30',
  ],
  1: [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  ],
  2: [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  ],
  3: [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  ],
  4: [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  ],
  5: [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30',
    '22:00',
  ],
  6: [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00',
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

async function handleApi(request, env) {
  const url = new URL(request.url)
  const path = url.pathname

  if (path === '/api/health') {
    return json({ ok: true, service: 'salute-21-booking', idFormat: 'S21-DLDLDL-MMYY' })
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Single canonical host for SEO (www → apex)
    if (url.hostname === 'www.salute21.com') {
      url.hostname = 'salute21.com'
      return Response.redirect(url.toString(), 301)
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

    // Long-cache immutable hashed assets; short-cache SEO files
    if (url.pathname === '/sitemap.xml' || url.pathname === '/robots.txt') {
      const headers = new Headers(assetResponse.headers)
      headers.set('Cache-Control', 'public, max-age=3600')
      return new Response(assetResponse.body, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers,
      })
    }

    return assetResponse
  },
}
