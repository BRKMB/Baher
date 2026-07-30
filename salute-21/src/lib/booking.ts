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

/** Opening slots by weekday (0=Sun … 6=Sat) */
const WEEKDAY_SLOTS: Record<number, string[]> = {
  0: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  1: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  2: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  3: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  4: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
  5: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'],
  6: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'],
}

function createId() {
  const part = Math.random().toString(36).slice(2, 6).toUpperCase()
  const stamp = Date.now().toString(36).toUpperCase().slice(-4)
  return `S21-${stamp}${part}`
}

export function getSlotsForDate(dateStr: string): string[] {
  if (!dateStr) return []
  const date = new Date(`${dateStr}T12:00:00`)
  if (Number.isNaN(date.getTime())) return []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date < today) return []
  return WEEKDAY_SLOTS[date.getDay()] ?? []
}

export function minBookableDate(): string {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

export function maxBookableDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 60)
  return d.toISOString().slice(0, 10)
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || 'Request failed')
  }
  return data as T
}

export async function getAvailability(date: string, time?: string) {
  const q = new URLSearchParams({ date })
  if (time) q.set('time', time)
  return api<{ date: string; capacity: number; slots: Record<string, number>; remaining?: number }>(
    `/api/bookings/availability?${q}`,
  )
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  if (!input.name.trim() || !input.email.trim() || !input.phone.trim()) {
    throw new Error('Missing required fields')
  }
  if (input.guests < 1 || input.guests > MAX_PARTY_SIZE) {
    throw new Error('Invalid party size')
  }
  const slots = getSlotsForDate(input.date)
  if (!slots.includes(input.time)) {
    throw new Error('Invalid time slot')
  }

  try {
    return await api<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  } catch (err) {
    // Offline / preview without API — local fallback store
    const message = err instanceof Error ? err.message : ''
    if (message.includes('fully booked') || message.includes('zajęty')) throw err
    return createLocalBooking(input)
  }
}

export async function getBooking(id: string): Promise<Booking | null> {
  try {
    return await api<Booking>(`/api/bookings/${encodeURIComponent(id)}`)
  } catch {
    const local = readLocal().find((b) => b.id === id)
    return local ?? null
  }
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
    id: createId(),
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
    `UID:${booking.id}@salute21.pl`,
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
