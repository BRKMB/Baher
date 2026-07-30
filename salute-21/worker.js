/**
 * Salute 21 Worker — booking API + SPA assets.
 *
 * /api/bookings/* is handled here (KV-backed).
 * Everything else goes to the Assets binding (SPA).
 */

const CAPACITY = 28
const MAX_PARTY = 12

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

function createId() {
  const part = Math.random().toString(36).slice(2, 6).toUpperCase()
  const stamp = Date.now().toString(36).toUpperCase().slice(-4)
  return `S21-${stamp}${part}`
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

async function handleApi(request, env) {
  const url = new URL(request.url)
  const path = url.pathname

  if (path === '/api/health') {
    return json({ ok: true, service: 'salute-21-booking' })
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

    if (!name || !email || !phone || !date || !time || !guests) {
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
      id: createId(),
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
    const apiResponse = await handleApi(request, env)
    if (apiResponse) return apiResponse
    return env.ASSETS.fetch(request)
  },
}
