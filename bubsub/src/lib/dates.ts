import type { BillingCycle, Subscription } from './types'

export function todayISO(): string {
  return toISO(new Date())
}

export function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(iso: string, days: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + days)
  return toISO(d)
}

export function addCycle(iso: string, cycle: BillingCycle): string {
  const d = parseISO(iso)
  if (cycle === 'weekly') d.setDate(d.getDate() + 7)
  else if (cycle === 'monthly') d.setMonth(d.getMonth() + 1)
  else if (cycle === 'quarterly') d.setMonth(d.getMonth() + 3)
  else d.setFullYear(d.getFullYear() + 1)
  return toISO(d)
}

/** Days from today until the given date (negative if in the past). */
export function daysUntil(iso: string): number {
  const target = parseISO(iso).getTime()
  const now = parseISO(todayISO()).getTime()
  return Math.round((target - now) / 86_400_000)
}

/**
 * Rolls the stored renewal date forward so it is always in the future.
 * Purely computed — we never mutate stored data for display.
 */
export function effectiveNextRenewal(sub: Subscription): string {
  if (sub.status === 'cancelled') return sub.nextRenewal
  let date = sub.nextRenewal
  let guard = 0
  while (daysUntil(date) < 0 && guard < 600) {
    date = addCycle(date, sub.cycle)
    guard++
  }
  return date
}

export function formatDate(iso: string): string {
  return parseISO(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateShort(iso: string): string {
  return parseISO(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function relativeLabel(iso: string): string {
  const days = daysUntil(iso)
  if (days < 0) return `${Math.abs(days)}d ago`
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days < 30) return `in ${days} days`
  const months = Math.round(days / 30)
  return months <= 1 ? 'in 1 month' : `in ${months} months`
}

export function monthName(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
