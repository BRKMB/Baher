import type { Subscription } from './types'
import { daysUntil, effectiveNextRenewal } from './dates'
import { formatMoney } from './currency'
import { isCounted, monthlyCost, totalMonthly, yearlyCost } from './money'
import { categoryLabel } from './categories'

export interface Insight {
  id: string
  icon: string
  text: string
  tone: 'info' | 'warn' | 'good'
}

/** Local, private insight generation — no external AI services. */
export function generateInsights(subs: Subscription[], currency: string): Insight[] {
  const insights: Insight[] = []
  const counted = subs.filter(isCounted)

  // Trials ending soon
  for (const s of counted) {
    if (s.isTrial && s.trialEndsAt) {
      const d = daysUntil(s.trialEndsAt)
      if (d >= 0 && d <= 7) {
        insights.push({
          id: `trial-${s.id}`,
          icon: '⏳',
          text: `Your ${s.name} free trial ends ${d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`} — cancel before then to avoid a charge.`,
          tone: 'warn',
        })
      }
    }
  }

  // Yearly renewals within 30 days
  for (const s of counted) {
    if (s.cycle === 'yearly') {
      const d = daysUntil(effectiveNextRenewal(s))
      if (d >= 0 && d <= 30) {
        insights.push({
          id: `yearly-${s.id}`,
          icon: '📅',
          text: `${s.name} renews for a full year in ${d} day${d === 1 ? '' : 's'} (${formatMoney(yearlyCost(s, currency), currency)}). Decide before it charges.`,
          tone: 'warn',
        })
      }
    }
  }

  // Most expensive subscription
  if (counted.length >= 2) {
    const sorted = [...counted].sort((a, b) => monthlyCost(b, currency) - monthlyCost(a, currency))
    const top = sorted[0]
    const share = monthlyCost(top, currency) / Math.max(totalMonthly(subs, currency), 0.01)
    if (share > 0.3) {
      insights.push({
        id: 'top-spend',
        icon: '💸',
        text: `${top.name} alone is ${Math.round(share * 100)}% of your monthly spend (${formatMoney(monthlyCost(top, currency), currency)}/mo).`,
        tone: 'info',
      })
    }
  }

  // Category comparison
  const byCategory = new Map<string, number>()
  for (const s of counted) {
    byCategory.set(s.category, (byCategory.get(s.category) ?? 0) + monthlyCost(s, currency))
  }
  if (byCategory.size >= 2) {
    const ranked = [...byCategory.entries()].sort((a, b) => b[1] - a[1])
    const [firstCat, firstAmt] = ranked[0]
    const [secondCat, secondAmt] = ranked[1]
    if (firstAmt > secondAmt * 1.5) {
      insights.push({
        id: 'cat-compare',
        icon: '📊',
        text: `You spend more on ${categoryLabel(firstCat as Subscription['category'])} than on ${categoryLabel(secondCat as Subscription['category'])} — ${formatMoney(firstAmt, currency)}/mo vs ${formatMoney(secondAmt, currency)}/mo.`,
        tone: 'info',
      })
    }
  }

  // Potential savings from flagged/noted subscriptions
  const flagged = counted.filter((s) => s.notes?.toLowerCase().includes('cancel') || s.tags.includes('unused'))
  if (flagged.length > 0) {
    const savings = flagged.reduce((sum, s) => sum + yearlyCost(s, currency), 0)
    insights.push({
      id: 'savings',
      icon: '💰',
      text: `You could save ${formatMoney(savings, currency)}/year by cancelling ${flagged.length === 1 ? flagged[0].name : `${flagged.length} subscriptions you flagged`}.`,
      tone: 'good',
    })
  }

  // Auto-renew disabled reminder
  for (const s of counted) {
    if (!s.autoRenew) {
      const d = daysUntil(effectiveNextRenewal(s))
      if (d >= 0 && d <= 14) {
        insights.push({
          id: `expire-${s.id}`,
          icon: '🔕',
          text: `${s.name} has auto-renew off and expires in ${d} day${d === 1 ? '' : 's'}.`,
          tone: 'info',
        })
      }
    }
  }

  return insights.slice(0, 5)
}

export interface Reminder {
  subId: string
  subName: string
  color: string
  date: string
  daysLeft: number
  kind: 'renewal' | 'trial'
  amountText: string
}

/** Upcoming reminders based on each subscription's reminder offsets. */
export function upcomingReminders(subs: Subscription[], currency: string): Reminder[] {
  const out: Reminder[] = []
  for (const s of subs) {
    if (!isCounted(s)) continue
    const renewal = effectiveNextRenewal(s)
    const d = daysUntil(renewal)
    const maxWindow = Math.max(...s.remindDaysBefore, 7)
    if (d >= 0 && d <= maxWindow) {
      out.push({
        subId: s.id,
        subName: s.name,
        color: s.color,
        date: renewal,
        daysLeft: d,
        kind: s.isTrial ? 'trial' : 'renewal',
        amountText: formatMoney(monthlyCost(s, currency), currency),
      })
    }
  }
  return out.sort((a, b) => a.daysLeft - b.daysLeft)
}
