import type { Subscription } from './types'
import { uid } from './store'
import { todayISO } from './dates'

const HEADERS = [
  'name',
  'price',
  'currency',
  'cycle',
  'category',
  'nextRenewal',
  'status',
  'autoRenew',
  'isTrial',
  'trialEndsAt',
  'paymentMethod',
  'notes',
  'tags',
] as const

function esc(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`
  return value
}

export function toCSV(subs: Subscription[]): string {
  const rows = subs.map((s) =>
    [
      s.name,
      String(s.price),
      s.currency,
      s.cycle,
      s.category,
      s.nextRenewal,
      s.status,
      String(s.autoRenew),
      String(s.isTrial),
      s.trialEndsAt ?? '',
      s.paymentMethod ?? '',
      s.notes ?? '',
      s.tags.join('|'),
    ]
      .map(esc)
      .join(','),
  )
  return [HEADERS.join(','), ...rows].join('\n')
}

function parseCSVRows(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"'
        i++
      } else if (ch === '"') {
        inQuotes = false
      } else {
        field += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.some((c) => c !== '')) rows.push(row)
      row = []
    } else {
      field += ch
    }
  }
  row.push(field)
  if (row.some((c) => c !== '')) rows.push(row)
  return rows
}

const VALID_CYCLES = new Set(['weekly', 'monthly', 'quarterly', 'yearly'])
const VALID_STATUS = new Set(['active', 'trial', 'paused', 'cancelled'])

/** Parses CSV text into subscriptions. Throws with a readable message on bad input. */
export function fromCSV(text: string): Subscription[] {
  const rows = parseCSVRows(text.trim())
  if (rows.length < 2) throw new Error('CSV needs a header row and at least one data row.')
  const header = rows[0].map((h) => h.trim())
  const idx = (name: string) => header.indexOf(name)
  if (idx('name') === -1 || idx('price') === -1) {
    throw new Error('CSV must include at least "name" and "price" columns.')
  }
  return rows.slice(1).map((cells, n) => {
    const get = (name: string) => {
      const i = idx(name)
      return i === -1 ? '' : (cells[i] ?? '').trim()
    }
    const price = Number(get('price'))
    if (!get('name') || Number.isNaN(price)) {
      throw new Error(`Row ${n + 2}: invalid name or price.`)
    }
    const cycleRaw = get('cycle').toLowerCase()
    const statusRaw = get('status').toLowerCase()
    return {
      id: uid(),
      name: get('name'),
      color: '#71747f',
      category: (get('category') || 'other') as Subscription['category'],
      price,
      currency: get('currency') || 'USD',
      cycle: (VALID_CYCLES.has(cycleRaw) ? cycleRaw : 'monthly') as Subscription['cycle'],
      nextRenewal: get('nextRenewal') || todayISO(),
      status: (VALID_STATUS.has(statusRaw) ? statusRaw : 'active') as Subscription['status'],
      autoRenew: get('autoRenew') !== 'false',
      isTrial: get('isTrial') === 'true',
      trialEndsAt: get('trialEndsAt') || undefined,
      paymentMethod: get('paymentMethod') || undefined,
      notes: get('notes') || undefined,
      tags: get('tags') ? get('tags').split('|').filter(Boolean) : [],
      remindDaysBefore: [3, 1],
      createdAt: todayISO(),
    } satisfies Subscription
  })
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
