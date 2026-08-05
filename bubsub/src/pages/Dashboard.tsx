import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { cancelledSavings, isCounted, monthlyCost, totalMonthly, totalYearly } from '../lib/money'
import { formatMoney } from '../lib/currency'
import { daysUntil, effectiveNextRenewal } from '../lib/dates'
import { upcomingReminders } from '../lib/insights'
import { CATEGORIES } from '../lib/categories'
import { SubscriptionCard } from '../components/SubscriptionCard'
import { Badge, Card, EmptyState, LogoTile, SectionTitle } from '../components/ui'
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
      <button className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div
        className="absolute bottom-0 left-0 right-0 glass-strong rounded-t-[32px] sheet-in max-h-[72%] overflow-y-auto no-scrollbar"
        style={{ paddingBottom: 'calc(var(--sab, 0px) + 20px)' }}
      >
        <div className="sticky top-0 px-6 pt-5 pb-3 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-ink-900 dark:text-ink-50">Reminders</h2>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full glass flex items-center justify-center text-ink-500">
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
              className="flex items-center gap-3 p-3.5 rounded-[22px] glass-soft"
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
    <Link to={`/subs/${sub.id}`} className="block">
      <Card className="p-3.5" variant="soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <IconWarning className="w-5 h-5 text-amber-500" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-ink-900 dark:text-ink-50">
              {sub.name} trial ends {d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`}
            </p>
            <p className="text-[12px] text-ink-500 dark:text-ink-400">Cancel before then to avoid being charged.</p>
          </div>
          <LogoTile name={sub.name} color={sub.color} serviceId={sub.serviceId} size="sm" />
        </div>
      </Card>
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
      <header className="sticky top-0 z-30" style={{ paddingTop: 'var(--sat, 0px)' }}>
        <div className="flex items-center justify-between px-5 h-[56px]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">Subscription OS</p>
            <h1 className="text-[26px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50 leading-none">
              BUB <span className="text-mint-500">SUB</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBell(true)}
              aria-label={`Notifications${reminders.length ? ` (${reminders.length})` : ''}`}
              className="relative w-10 h-10 rounded-full glass flex items-center justify-center text-ink-700 dark:text-ink-200"
            >
              <IconBell className="w-[20px] h-[20px]" />
              {reminders.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white/70 dark:ring-ink-900">
                  {reminders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/settings')}
              aria-label="Settings"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-ink-700 dark:text-ink-200"
            >
              <IconGear className="w-[20px] h-[20px]" />
            </button>
          </div>
        </div>
      </header>

      <div className="px-5" style={{ paddingBottom: 'calc(var(--sab, 0px) + 110px)' }}>
        {/* Hero spend — full-bleed glass plane, not a boxed card cluster */}
        <div className="relative overflow-hidden rounded-[32px] glass-dark specular p-6 text-white">
          <div className="orb absolute -top-16 -right-10 w-44 h-44 rounded-full bg-mint-400/25 blur-2xl" aria-hidden />
          <div className="absolute -bottom-20 -left-10 w-40 h-40 rounded-full bg-sky-400/20 blur-2xl" aria-hidden />
          <div className="relative z-[1]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">Monthly spend</p>
            <p className="text-[44px] font-extrabold tracking-tight tabular-nums mt-1 leading-none">
              {formatMoney(monthly, settings.currency)}
            </p>
            <div className="flex items-end gap-5 mt-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">Yearly</p>
                <p className="text-[15px] font-bold tabular-nums">{formatMoney(yearly, settings.currency, { compact: true })}</p>
              </div>
              <div className="w-px h-8 bg-white/15" aria-hidden />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">Active</p>
                <p className="text-[15px] font-bold tabular-nums">{subscriptions.filter(isCounted).length}</p>
              </div>
              {savings > 0 && (
                <>
                  <div className="w-px h-8 bg-white/15" aria-hidden />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-mint-300/90">Saved / yr</p>
                    <p className="text-[15px] font-bold tabular-nums text-mint-300">
                      {formatMoney(savings, settings.currency, { compact: true })}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {endingTrials.length > 0 && (
          <div className="mt-3 space-y-2.5">
            {endingTrials.map((s) => (
              <TrialBanner key={s.id} sub={s} />
            ))}
          </div>
        )}

        <div className="relative mt-5">
          <IconSearch className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 z-[1]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subscriptions"
            aria-label="Search subscriptions"
            className="w-full h-[48px] pl-11 pr-4 rounded-[20px] glass-strong text-[15px] text-ink-900 dark:text-ink-50 placeholder:text-ink-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 mt-3.5 pb-1">
          <button
            onClick={() => setCategory('all')}
            className={`shrink-0 px-3.5 h-[34px] rounded-full text-[13px] font-semibold transition-all ${
              category === 'all'
                ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900 shadow-sm'
                : 'glass-soft text-ink-600 dark:text-ink-300'
            }`}
          >
            All
          </button>
          {CATEGORIES.filter((c) => usedCategories.has(c.id)).map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(category === c.id ? 'all' : c.id)}
              className={`shrink-0 px-3.5 h-[34px] rounded-full text-[13px] font-semibold transition-all ${
                category === c.id
                  ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900 shadow-sm'
                  : 'glass-soft text-ink-600 dark:text-ink-300'
              }`}
            >
              {c.label}
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
