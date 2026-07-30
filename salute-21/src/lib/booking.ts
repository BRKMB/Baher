import { BOOKING_CAPACITY, MAX_PARTY_SIZE } from '../data/content'

export type BookingInput = {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  occasion?: string
  notes?: string
  lang: 'en' | 'pl'
}

export type Booking = BookingInput & {
  id: string
  createdAt: string
  status: 'confirmed'
}

/** Opening slots by weekday (0=Sun … 6=Sat) — Europe/Warsaw restaurant hours */
const WEEKDAY_SLOTS: Record<number, string[]> = {
  0: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  1: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  2: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  3: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  4: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  5: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'],
  6: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'],
}

function createId(dateStr?: string) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  const bytes =
    typeof crypto !== 'undefined' && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint8Array(6))
      : null
  for (let i = 0; i < 6; i++) {
    const n = bytes ? bytes[i] : Math.floor(Math.random() * alphabet.length)
    code += alphabet[n % alphabet.length]
  }
  const d = new Date(`${String(dateStr || '').slice(0, 10)}T12:00:00`)
  const valid = Number.isNaN(d.getTime()) ? new Date() : d
  const mm = String(valid.getMonth() + 1).padStart(2, '0')
  const yy = String(valid.getFullYear()).slice(-2)
  return `S21-${code}-${mm}${yy}`
}

/** Local calendar date YYYY-MM-DD (avoids UTC off-by-one from toISOString). */
export function formatLocalDate(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function warsawNowParts() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

export function getSlotsForDate(dateStr: string): string[] {
  if (!dateStr) return []
  const date = new Date(`${dateStr}T12:00:00`)
  if (Number.isNaN(date.getTime())) return []

  const { date: todayWarsaw, minutes: nowMinutes } = warsawNowParts()
  if (dateStr < todayWarsaw) return []

  const slots = WEEKDAY_SLOTS[date.getDay()] ?? []
  if (dateStr > todayWarsaw) return slots

  // Today: hide slots that already started (15-min buffer)
  return slots.filter((slot) => {
    const [hh, mm] = slot.split(':').map(Number)
    return hh * 60 + mm > nowMinutes + 15
  })
}

export function minBookableDate(): string {
  return warsawNowParts().date
}

export function maxBookableDate(): string {
  const d = new Date(`${minBookableDate()}T12:00:00`)
  d.setDate(d.getDate() + 60)
  return formatLocalDate(d)
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('API unavailable')
  }

  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) {
    throw new Error(data.error || 'Request failed')
  }
  return data
}

export async function getAvailability(date: string, time?: string) {
  const q = new URLSearchParams({ date })
  if (time) q.set('time', time)
  const data = await api<{
    date: string
    capacity: number
    slots: Record<string, number>
    remaining?: number
  }>(`/api/bookings/availability?${q}`)

  if (!data?.slots || typeof data.slots !== 'object') {
    throw new Error('API unavailable')
  }
  return data
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  if (!input.name.trim() || !input.email.trim() || !input.phone.trim()) {
    throw new Error('Missing required fields')
  }
  if (input.guests < 1 || input.guests > MAX_PARTY_SIZE) {
    throw new Error('Invalid party size')
  }
  if (!input.time) {
    throw new Error('Missing time slot')
  }
  const slots = getSlotsForDate(input.date)
  if (!slots.includes(input.time)) {
    throw new Error('Invalid time slot')
  }

  try {
    const booking = await api<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    if (!booking?.id) throw new Error('API unavailable')
    // Mirror to local so success page works offline / hard-refresh
    try {
      writeLocal([booking, ...readLocal().filter((b) => b.id !== booking.id)])
    } catch {
      /* ignore */
    }
    return booking
  } catch (err) {
    const message = err instanceof Error ? err.message : ''
    if (
      message.includes('fully booked') ||
      message.includes('zajęty') ||
      message === 'SLOT_TAKEN'
    ) {
      throw err
    }
    // Offline / preview without API — local fallback store
    return createLocalBooking(input)
  }
}

export async function getBooking(id: string): Promise<Booking | null> {
  try {
    const booking = await api<Booking>(`/api/bookings/${encodeURIComponent(id)}`)
    if (booking?.id) return booking
  } catch {
    /* fall through to local */
  }
  return readLocal().find((b) => b.id === id) ?? null
}

/** Staff-only list — requires admin key matching Worker ADMIN_KEY / default. */
export async function listBookings(adminKey: string): Promise<Booking[]> {
  const res = await fetch('/api/bookings', {
    headers: {
      Accept: 'application/json',
      'X-Admin-Key': adminKey,
    },
  })
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('API unavailable')
  }
  const data = (await res.json().catch(() => ({}))) as {
    bookings?: Booking[]
    error?: string
  }
  if (!res.ok) {
    throw new Error(data.error || 'Unauthorized')
  }
  return Array.isArray(data.bookings) ? data.bookings : []
}

function readLocal(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem('salute21-bookings') || '[]') as Booking[]
  } catch {
    return []
  }
}

function writeLocal(list: Booking[]) {
  localStorage.setItem('salute21-bookings', JSON.stringify(list))
}

function createLocalBooking(input: BookingInput): Booking {
  const list = readLocal()
  const used = list
    .filter((b) => b.date === input.date && b.time === input.time)
    .reduce((sum, b) => sum + b.guests, 0)
  if (used + input.guests > BOOKING_CAPACITY) {
    throw new Error('SLOT_TAKEN')
  }
  const booking: Booking = {
    ...input,
    id: createId(input.date),
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  }
  writeLocal([booking, ...list])
  return booking
}

export function buildIcs(booking: Booking): string {
  const start = booking.date.replace(/-/g, '') + 'T' + booking.time.replace(':', '') + '00'
  const [hh, mm] = booking.time.split(':').map(Number)
  const endHour = String(hh + 2).padStart(2, '0')
  const end = booking.date.replace(/-/g, '') + 'T' + endHour + String(mm).padStart(2, '0') + '00'
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Salute 21//Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.id}@salute21.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Salute 21 — ${booking.guests} guests`,
    `DESCRIPTION:Booking ${booking.id}\\nName: ${booking.name}\\nPhone: ${booking.phone}`,
    'LOCATION:ul. Marcina Kasprzaka 24A\\, 01-211 Warszawa',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs(booking: Booking) {
  const blob = new Blob([buildIcs(booking)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${booking.id}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

export { BOOKING_CAPACITY, MAX_PARTY_SIZE }
