import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')
const dataDir = path.join(root, 'data')
const storeFile = path.join(dataDir, 'bookings.json')

const CAPACITY = 28
const MAX_PARTY = 12
const PORT = Number(process.env.PORT || 4173)

const WEEKDAY_SLOTS = {
  0: [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  ],
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

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
if (!fs.existsSync(storeFile)) fs.writeFileSync(storeFile, '[]')

function readBookings() {
  try {
    return JSON.parse(fs.readFileSync(storeFile, 'utf8'))
  } catch {
    return []
  }
}

function writeBookings(list) {
  fs.writeFileSync(storeFile, JSON.stringify(list, null, 2))
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
      const pool = i % 2 === 0 ? digits : letters
      code += pool[randomByte() % pool.length]
    }
    const id = `S21-${code}-${stamp}`
    if (!taken.has(id)) return id
  }

  return `S21-${digits[randomByte() % digits.length]}${letters[randomByte() % letters.length]}${digits[randomByte() % digits.length]}${letters[randomByte() % letters.length]}${digits[randomByte() % digits.length]}${letters[randomByte() % letters.length]}-${stamp}`
}

function seatsUsed(list, date, time) {
  return list
    .filter((b) => b.date === date && b.time === time && b.status === 'confirmed')
    .reduce((sum, b) => sum + Number(b.guests || 0), 0)
}

const app = express()
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'salute-21-booking' })
})

app.get('/api/bookings/availability', (req, res) => {
  const date = String(req.query.date || '')
  const time = req.query.time ? String(req.query.time) : null
  if (!date) return res.status(400).json({ error: 'date required' })

  const d = new Date(`${date}T12:00:00`)
  const slots = WEEKDAY_SLOTS[d.getDay()] || []
  const list = readBookings()
  const map = {}
  for (const slot of slots) {
    map[slot] = Math.max(0, CAPACITY - seatsUsed(list, date, slot))
  }

  if (time) {
    return res.json({ date, time, capacity: CAPACITY, remaining: map[time] ?? 0, slots: map })
  }
  res.json({ date, capacity: CAPACITY, slots: map })
})

app.post('/api/bookings', (req, res) => {
  const body = req.body || {}
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
    return res.status(400).json({ error: 'Missing required fields' })
  }
  if (guests < 1 || guests > MAX_PARTY) {
    return res.status(400).json({ error: 'Invalid party size' })
  }

  const d = new Date(`${date}T12:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (Number.isNaN(d.getTime()) || d < today) {
    return res.status(400).json({ error: 'Invalid date' })
  }

  const allowed = WEEKDAY_SLOTS[d.getDay()] || []
  if (!allowed.includes(time)) {
    return res.status(400).json({ error: 'Invalid time slot' })
  }

  const list = readBookings()
  const used = seatsUsed(list, date, time)
  if (used + guests > CAPACITY) {
    return res.status(409).json({ error: 'This time slot is fully booked' })
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
  writeBookings(list)
  res.status(201).json(booking)
})

app.get('/api/bookings', (req, res) => {
  const key = req.get('X-Admin-Key') || String(req.query.key || '')
  if (key !== String(process.env.ADMIN_KEY || 'baher')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const sorted = [...readBookings()].sort((a, b) => {
    const da = `${a.date || ''}T${a.time || '00:00'}`
    const db = `${b.date || ''}T${b.time || '00:00'}`
    return db.localeCompare(da)
  })
  res.json({ bookings: sorted, count: sorted.length })
})

app.delete('/api/bookings/:id', (req, res) => {
  const key = req.get('X-Admin-Key') || String(req.query.key || '')
  if (key !== String(process.env.ADMIN_KEY || 'baher')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const id = String(req.params.id || '')
  const list = readBookings()
  const next = list.filter((b) => b.id !== id)
  if (next.length === list.length) return res.status(404).json({ error: 'Not found' })
  writeBookings(next)
  res.json({ ok: true, id })
})

app.get('/api/bookings/:id', (req, res) => {
  const booking = readBookings().find((b) => b.id === req.params.id)
  if (!booking) return res.status(404).json({ error: 'Not found' })
  res.json(booking)
})

app.use(express.static(dist))

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  if (req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(dist, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Salute 21 running on http://0.0.0.0:${PORT}`)
})
