import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { cancelledSavings, isCounted, monthlyCost, totalMonthly, totalYearly } from '../lib/money'
import { formatMoney } from '../lib/currency'
import { daysUntil, effectiveNextRenewal } from '../lib/dates'
import { upcomingReminders } from '../lib/insights'
import { CATEGORIES } from '../lib/categories'
import { SubscriptionCard } from '../components/SubscriptionCard'
import { Badge, EmptyState, SectionTitle } from '../components/ui'
import { IconBell, IconGear, IconSearch, IconWarning, IconX } from '../components/icons'
import type { Category, Subscription } from '../lib/types'

type SortKey = 'renewal' | 'priceDesc' | 'priceAsc' | 'name' | 'newest'

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'renewal', label: 'Renewal date' },
  { id: 'priceDesc', label: 'Highest price' },
  { id: 'priceAsc', label: 'Lowest price' },
  { id: 'name', label: 'A → Z' },
  { id: 'newest', label: 'Newest' },
]

function NotificationsSheet({ onClose }: { onClose: () => void }) {
  const { subscriptions, settings } = useStore()
  const reminders = upcomingReminders(subscriptions, settings.currency)
  return (
    <div className="absolute inset-0 z-50 fade-in" role="dialog" aria-label="Notifications">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-ink-900 rounded-t-[28px] sheet-in max-h-[70%] overflow-y-auto no-scrollbar"
        style={{ paddingBottom: 'calc(var(--sab, 0px) + 20px)' }}
      >
        <div className="sticky top-0 bg-white dark:bg-ink-900 px-6 pt-5 pb-3 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-ink-900 dark:text-ink-50">Reminders</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-300">
            <IconX className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </div>
        <div className="px-5 space-y-2.5 pt-1">
          {reminders.length === 0 && (
            <EmptyState emoji="🔕" title="All quiet" text="No renewals or trials due in the next few days." />
          )}
          {reminders.map((r) => (
            <Link
              key={r.subId}
              to={`/subs/${r.subId}`}
              onClick={onClose}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-ink-50 dark:bg-ink-850"
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: r.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-ink-900 dark:text-ink-50 truncate">
                  {r.subName} {r.kind === 'trial' ? 'trial ends' : 'renews'}{' '}
                  {r.daysLeft === 0 ? 'today' : r.daysLeft === 1 ? 'tomorrow' : `in ${r.daysLeft} days`}
                </p>
                <p className="text-[12px] text-ink-500 dark:text-ink-400">{r.amountText}/month</p>
              </div>
              {r.daysLeft <= 1 && <Badge tone="danger">URGENT</Badge>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function TrialBanner({ sub }: { sub: Subscription }) {
  const d = daysUntil(sub.trialEndsAt ?? sub.nextRenewal)
  return (
    <Link
      to={`/subs/${sub.id}`}
      className="flex items-center gap-3 p-4 rounded-3xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/25"
    >
      <IconWarning className="w-6 h-6 text-amber-500 shrink-0" strokeWidth={2} />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-amber-800 dark:text-amber-300">
          {sub.name} trial ends {d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`}
        </p>
        <p className="text-[12px] text-amber-700/80 dark:text-amber-400/80">Cancel before then to avoid being charged.</p>
      </div>
    </Link>
  )
}

export function Dashboard() {
  const { subscriptions, settings } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [sort, setSort] = useState<SortKey>('renewal')
  const [showBell, setShowBell] = useState(false)

  const monthly = totalMonthly(subscriptions, settings.currency)
  const yearly = totalYearly(subscriptions, settings.currency)
  const savings = cancelledSavings(subscriptions, settings.currency)
  const reminders = upcomingReminders(subscriptions, settings.currency)
  const endingTrials = subscriptions.filter(
    (s) => s.isTrial && isCounted(s) && s.trialEndsAt && daysUntil(s.trialEndsAt) >= 0 && daysUntil(s.trialEndsAt) <= 7,
  )

  const filtered = useMemo(() => {
    let list = subscriptions.filter((s) => s.status !== 'cancelled')
    if (query) list = list.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    if (category !== 'all') list = list.filter((s) => s.category === category)
    const sorters: Record<SortKey, (a: Subscription, b: Subscription) => number> = {
      renewal: (a, b) => daysUntil(effectiveNextRenewal(a)) - daysUntil(effectiveNextRenewal(b)),
      priceDesc: (a, b) => monthlyCost(b, settings.currency) - monthlyCost(a, settings.currency),
      priceAsc: (a, b) => monthlyCost(a, settings.currency) - monthlyCost(b, settings.currency),
      name: (a, b) => a.name.localeCompare(b.name),
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
    }
    return [...list].sort(sorters[sort])
  }, [subscriptions, query, category, sort, settings.currency])

  const cancelled = subscriptions.filter((s) => s.status === 'cancelled')
  const usedCategories = new Set(subscriptions.filter((s) => s.status !== 'cancelled').map((s) => s.category))

  return (
    <div className="page-in">
      <header className="sticky top-0 z-30 bg-ink-50/85 dark:bg-ink-950/85 backdrop-blur-xl" style={{ paddingTop: 'var(--sat, 0px)' }}>
        <div className="flex items-center justify-between px-5 h-[52px]">
          <h1 className="text-[24px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50">
            BUB <span className="text-mint-500">SUB</span>
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowBell(true)}
              aria-label={`Notifications${reminders.length ? ` (${reminders.length})` : ''}`}
              className="relative p-2 rounded-full text-ink-600 dark:text-ink-300 active:bg-ink-100 dark:active:bg-ink-800"
            >
              <IconBell className="w-[22px] h-[22px]" />
              {reminders.length > 0 && (
                <span className="absolute top-1 right-1 w-[16px] h-[16px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {reminders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/settings')}
              aria-label="Settings"
              className="p-2 rounded-full text-ink-600 dark:text-ink-300 active:bg-ink-100 dark:active:bg-ink-800"
            >
              <IconGear className="w-[22px] h-[22px]" />
            </button>
          </div>
        </div>
      </header>

      <div className="px-5" style={{ paddingBottom: 'calc(var(--sab, 0px) + 96px)' }}>
        {/* Spending hero */}
        <div className="rounded-[28px] p-6 text-white bg-gradient-to-br from-ink-900 via-ink-850 to-ink-800 dark:from-ink-850 dark:via-ink-900 dark:to-black shadow-float relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-mint-500/15 blur-2xl" aria-hidden />
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-300">Monthly spend</p>
          <p className="text-[40px] font-extrabold tracking-tight tabular-nums mt-1 leading-none">
            {formatMoney(monthly, settings.currency)}
          </p>
          <div className="flex items-center gap-5 mt-5">
            <div>
              <p className="text-[11px] font-medium text-ink-400">Per year</p>
              <p className="text-[15px] font-bold tabular-nums">{formatMoney(yearly, settings.currency, { compact: true })}</p>
            </div>
            <div className="w-px h-8 bg-white/10" aria-hidden />
            <div>
              <p className="text-[11px] font-medium text-ink-400">Active</p>
              <p className="text-[15px] font-bold tabular-nums">{subscriptions.filter(isCounted).length}</p>
            </div>
            {savings > 0 && (
              <>
                <div className="w-px h-8 bg-white/10" aria-hidden />
                <div>
                  <p className="text-[11px] font-medium text-mint-300">Saved / yr</p>
                  <p className="text-[15px] font-bold tabular-nums text-mint-300">
                    {formatMoney(savings, settings.currency, { compact: true })}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Trial warnings */}
        {endingTrials.length > 0 && (
          <div className="mt-4 space-y-2.5">
            {endingTrials.map((s) => (
              <TrialBanner key={s.id} sub={s} />
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative mt-5">
          <IconSearch className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subscriptions"
            aria-label="Search subscriptions"
            className="w-full h-[44px] pl-11 pr-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-100/60 dark:border-ink-800/60 text-[15px] text-ink-900 dark:text-ink-50 placeholder:text-ink-400 shadow-card dark:shadow-card-dark"
          />
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 mt-3.5 pb-1">
          <button
            onClick={() => setCategory('all')}
            className={`shrink-0 px-3.5 h-[32px] rounded-full text-[13px] font-semibold transition-colors ${
              category === 'all'
                ? 'bg-ink-900 text-white dark:bg-ink-50 dark:text-ink-900'
                : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-300 border border-ink-100/80 dark:border-ink-800'
            }`}
          >
            All
          </button>
          {CATEGORIES.filter((c) => usedCategories.has(c.id)).map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(category === c.id ? 'all' : c.id)}
              className={`shrink-0 px-3.5 h-[32px] rounded-full text-[13px] font-semibold transition-colors ${
                category === c.id
                  ? 'bg-ink-900 text-white dark:bg-ink-50 dark:text-ink-900'
                  : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-300 border border-ink-100/80 dark:border-ink-800'
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <SectionTitle
          action={
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort subscriptions"
              className="text-[13px] font-semibold text-mint-600 dark:text-mint-400 bg-transparent"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          }
        >
          Your subscriptions
        </SectionTitle>

        <div className="space-y-2.5">
          {filtered.length === 0 && (
            <EmptyState
              emoji="🫧"
              title={query || category !== 'all' ? 'Nothing matches' : 'No subscriptions yet'}
              text={
                query || category !== 'all'
                  ? 'Try a different search or filter.'
                  : 'Tap the + button to add your first subscription.'
              }
            />
          )}
          {filtered.map((s) => (
            <SubscriptionCard key={s.id} sub={s} />
          ))}
        </div>

        {cancelled.length > 0 && (
          <>
            <SectionTitle>Cancelled</SectionTitle>
            <div className="space-y-2.5">
              {cancelled.map((s) => (
                <SubscriptionCard key={s.id} sub={s} />
              ))}
            </div>
          </>
        )}
      </div>

      {showBell && <NotificationsSheet onClose={() => setShowBell(false)} />}
    </div>
  )
}
