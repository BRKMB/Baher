import { useStore } from '../lib/store'
import { cancelledSavings, isCounted, monthlyCost, totalMonthly, totalYearly, yearlyCost } from '../lib/money'
import { formatMoney } from '../lib/currency'
import { daysUntil, effectiveNextRenewal, formatDateShort } from '../lib/dates'
import { generateInsights } from '../lib/insights'
import { categoryEmoji, categoryLabel } from '../lib/categories'
import { Card, EmptyState, LogoTile, PageHeader, SectionTitle } from '../components/ui'
import { IconSparkle } from '../components/icons'
import { Link } from 'react-router-dom'
import type { Category } from '../lib/types'

export function Analytics() {
  const { subscriptions, settings } = useStore()
  const currency = settings.currency
  const active = subscriptions.filter(isCounted)

  const monthly = totalMonthly(subscriptions, currency)
  const yearly = totalYearly(subscriptions, currency)
  const savings = cancelledSavings(subscriptions, currency)
  const insights = generateInsights(subscriptions, currency)

  const byCategory = new Map<Category, number>()
  for (const s of active) {
    byCategory.set(s.category, (byCategory.get(s.category) ?? 0) + monthlyCost(s, currency))
  }
  const categories = [...byCategory.entries()].sort((a, b) => b[1] - a[1])
  const maxCat = categories.length ? categories[0][1] : 1

  const topExpensive = [...active]
    .sort((a, b) => monthlyCost(b, currency) - monthlyCost(a, currency))
    .slice(0, 5)

  const upcoming = active
    .map((s) => ({ sub: s, date: effectiveNextRenewal(s), days: daysUntil(effectiveNextRenewal(s)) }))
    .filter((u) => u.days >= 0 && u.days <= 30)
    .sort((a, b) => a.days - b.days)
  const upcomingTotal = upcoming.reduce((sum, u) => sum + monthlyCost(u.sub, currency), 0)

  return (
    <div className="page-in">
      <PageHeader title="Spending" subtitle="Where your money actually goes" />
      <div className="px-5" style={{ paddingBottom: 'calc(var(--sab, 0px) + 96px)' }}>
        {/* Totals */}
        <div className="grid grid-cols-2 gap-2.5">
          <Card className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400">Monthly</p>
            <p className="text-[24px] font-extrabold tabular-nums text-ink-900 dark:text-ink-50 mt-1">
              {formatMoney(monthly, currency)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400">Yearly</p>
            <p className="text-[24px] font-extrabold tabular-nums text-ink-900 dark:text-ink-50 mt-1">
              {formatMoney(yearly, currency, { compact: true })}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400">Next 30 days</p>
            <p className="text-[24px] font-extrabold tabular-nums text-ink-900 dark:text-ink-50 mt-1">
              {formatMoney(upcomingTotal, currency)}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mint-600 dark:text-mint-400">Saved / year</p>
            <p className="text-[24px] font-extrabold tabular-nums text-mint-600 dark:text-mint-400 mt-1">
              {formatMoney(savings, currency, { compact: true })}
            </p>
          </Card>
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <>
            <SectionTitle>Insights</SectionTitle>
            <div className="space-y-2.5">
              {insights.map((i) => (
                <div
                  key={i.id}
                  className={`flex items-start gap-3 p-4 rounded-3xl border text-[14px] leading-snug ${
                    i.tone === 'warn'
                      ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200/70 dark:border-amber-500/25 text-amber-800 dark:text-amber-300'
                      : i.tone === 'good'
                        ? 'bg-mint-50 dark:bg-mint-700/15 border-mint-200/70 dark:border-mint-700/30 text-mint-700 dark:text-mint-300'
                        : 'bg-white dark:bg-ink-900 border-ink-100/60 dark:border-ink-800/60 text-ink-700 dark:text-ink-200'
                  }`}
                >
                  <span className="text-[18px] leading-none mt-0.5" aria-hidden>
                    {i.icon}
                  </span>
                  <p className="font-medium">{i.text}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Category breakdown */}
        <SectionTitle>By category</SectionTitle>
        <Card className="p-5">
          {categories.length === 0 && (
            <EmptyState emoji="📊" title="No data yet" text="Add subscriptions to see your category breakdown." />
          )}
          <div className="space-y-4">
            {categories.map(([cat, amount]) => (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-semibold text-ink-700 dark:text-ink-200">
                    {categoryEmoji(cat)} {categoryLabel(cat)}
                  </span>
                  <span className="text-[13px] font-bold tabular-nums text-ink-900 dark:text-ink-50">
                    {formatMoney(amount, currency)}
                    <span className="text-ink-400 font-medium text-[11px]"> /mo</span>
                  </span>
                </div>
                <div className="h-[8px] rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-mint-500 to-mint-400 transition-all duration-500"
                    style={{ width: `${Math.max((amount / maxCat) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top expensive */}
        <SectionTitle>Most expensive</SectionTitle>
        <Card className="divide-y divide-ink-100/70 dark:divide-ink-800/70">
          {topExpensive.map((s, i) => (
            <Link key={s.id} to={`/subs/${s.id}`} className="flex items-center gap-3 px-4 py-3">
              <span className="text-[13px] font-bold text-ink-300 dark:text-ink-600 w-4 tabular-nums">{i + 1}</span>
              <LogoTile name={s.name} color={s.color} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-ink-900 dark:text-ink-50 truncate">{s.name}</p>
                <p className="text-[11px] text-ink-400">{formatMoney(yearlyCost(s, currency), currency, { compact: true })}/year</p>
              </div>
              <p className="text-[14px] font-bold tabular-nums text-ink-900 dark:text-ink-50">
                {formatMoney(monthlyCost(s, currency), currency)}
              </p>
            </Link>
          ))}
          {topExpensive.length === 0 && (
            <EmptyState emoji="💳" title="Nothing here" text="Your priciest subscriptions will rank here." />
          )}
        </Card>

        {/* Upcoming charges */}
        <SectionTitle>Upcoming charges</SectionTitle>
        <Card className="divide-y divide-ink-100/70 dark:divide-ink-800/70">
          {upcoming.map(({ sub, date, days }) => (
            <Link key={sub.id} to={`/subs/${sub.id}`} className="flex items-center gap-3 px-4 py-3">
              <div className="w-11 text-center shrink-0">
                <p className="text-[15px] font-bold text-ink-900 dark:text-ink-50 leading-none">{formatDateShort(date).split(' ')[1]}</p>
                <p className="text-[10px] font-semibold uppercase text-ink-400 mt-0.5">{formatDateShort(date).split(' ')[0]}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-ink-900 dark:text-ink-50 truncate">{sub.name}</p>
                <p className="text-[11px] text-ink-400">
                  {days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`}
                </p>
              </div>
              <p className="text-[14px] font-bold tabular-nums text-ink-900 dark:text-ink-50">
                {formatMoney(monthlyCost(sub, currency), currency)}
              </p>
            </Link>
          ))}
          {upcoming.length === 0 && (
            <EmptyState emoji="😌" title="No charges soon" text="Nothing renews in the next 30 days." />
          )}
        </Card>

        <div className="flex items-center gap-2 justify-center mt-8 text-ink-400 dark:text-ink-500">
          <IconSparkle className="w-4 h-4" />
          <p className="text-[12px] font-medium">Insights are computed on your device. Your data never leaves it.</p>
        </div>
      </div>
    </div>
  )
}
