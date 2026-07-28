import type { Subscription } from './types'
import { convert } from './currency'

const CYCLES_PER_MONTH: Record<Subscription['cycle'], number> = {
  weekly: 52 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
}

/** Price of one subscription normalized to a monthly amount, in the display currency. */
export function monthlyCost(sub: Subscription, displayCurrency: string): number {
  const monthly = sub.price * CYCLES_PER_MONTH[sub.cycle]
  return convert(monthly, sub.currency, displayCurrency)
}

export function yearlyCost(sub: Subscription, displayCurrency: string): number {
  return monthlyCost(sub, displayCurrency) * 12
}

export function isCounted(sub: Subscription): boolean {
  return sub.status === 'active' || sub.status === 'trial'
}

export function totalMonthly(subs: Subscription[], displayCurrency: string): number {
  return subs.filter(isCounted).reduce((sum, s) => sum + monthlyCost(s, displayCurrency), 0)
}

export function totalYearly(subs: Subscription[], displayCurrency: string): number {
  return totalMonthly(subs, displayCurrency) * 12
}

/** Yearly savings from everything the user already cancelled. */
export function cancelledSavings(subs: Subscription[], displayCurrency: string): number {
  return subs
    .filter((s) => s.status === 'cancelled')
    .reduce((sum, s) => sum + yearlyCost(s, displayCurrency), 0)
}
