import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { addCycle, daysUntil, effectiveNextRenewal, monthName, parseISO, todayISO, toISO } from '../lib/dates'
import { isCounted, monthlyCost } from '../lib/money'
import { formatMoney } from '../lib/currency'
import { Card, EmptyState, LogoTile, PageHeader, SectionTitle } from '../components/ui'
import { Badge } from '../components/ui'
import { IconChevronLeft, IconChevronRight } from '../components/icons'

interface CalEvent {
  date: string
  subId: string
  name: string
  color: string
  amountText: string
  kind: 'renewal' | 'trial'
}

export function Calendar() {
  const { subscriptions, settings } = useStore()
  const today = todayISO()
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [selected, setSelected] = useState<string | null>(null)

  const events = useMemo<CalEvent[]>(() => {
    const first = new Date(cursor.year, cursor.month, 1)
    const last = new Date(cursor.year, cursor.month + 1, 0)
    const firstISO = toISO(first)
    const lastISO = toISO(last)
    const out: CalEvent[] = []
    for (const s of subscriptions) {
      if (!isCounted(s)) continue
      // project renewal occurrences into the visible month
      let date = effectiveNextRenewal(s)
      let guard = 0
      while (date <= lastISO && guard < 60) {
        if (date >= firstISO) {
          out.push({
            date,
            subId: s.id,
            name: s.name,
            color: s.color,
            amountText: formatMoney(monthlyCost(s, settings.currency), settings.currency),
            kind: 'renewal',
          })
        }
        date = addCycle(date, s.cycle)
        guard++
      }
      if (s.isTrial && s.trialEndsAt && s.trialEndsAt >= firstISO && s.trialEndsAt <= lastISO) {
        out.push({
          date: s.trialEndsAt,
          subId: s.id,
          name: s.name,
          color: s.color,
          amountText: 'Trial ends',
          kind: 'trial',
        })
      }
    }
    return out.sort((a, b) => a.date.localeCompare(b.date))
  }, [subscriptions, cursor, settings.currency])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalEvent[]>()
    for (const e of events) {
      const list = map.get(e.date) ?? []
      list.push(e)
      map.set(e.date, list)
    }
    return map
  }, [events])

  const firstDow = new Date(cursor.year, cursor.month, 1).getDay()
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
  const cells: (string | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => toISO(new Date(cursor.year, cursor.month, i + 1))),
  ]

  const move = (delta: number) => {
    setSelected(null)
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const visibleEvents = selected ? (eventsByDay.get(selected) ?? []) : events

  return (
    <div className="page-in">
      <PageHeader title="Calendar" subtitle="Renewals & trial deadlines" />
      <div className="px-5" style={{ paddingBottom: 'calc(var(--sab, 0px) + 96px)' }}>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <button onClick={() => move(-1)} aria-label="Previous month" className="p-1.5 rounded-full text-ink-500 active:bg-ink-100 dark:active:bg-ink-800">
              <IconChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-[15px] font-bold text-ink-900 dark:text-ink-50">{monthName(cursor.year, cursor.month)}</h2>
            <button onClick={() => move(1)} aria-label="Next month" className="p-1.5 rounded-full text-ink-500 active:bg-ink-100 dark:active:bg-ink-800">
              <IconChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-center text-[11px] font-bold text-ink-400 py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((iso, i) => {
              if (!iso) return <div key={`x-${i}`} />
              const dayEvents = eventsByDay.get(iso) ?? []
              const isToday = iso === today
              const isSelected = iso === selected
              return (
                <button
                  key={iso}
                  onClick={() => setSelected(isSelected ? null : iso)}
                  aria-label={`${iso}${dayEvents.length ? `, ${dayEvents.length} events` : ''}`}
                  className={`relative h-[44px] rounded-2xl flex flex-col items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-ink-900 dark:bg-ink-50'
                      : isToday
                        ? 'bg-mint-100 dark:bg-mint-700/25'
                        : 'active:bg-ink-100 dark:active:bg-ink-800'
                  }`}
                >
                  <span
                    className={`text-[14px] font-semibold tabular-nums ${
                      isSelected
                        ? 'text-white dark:text-ink-900'
                        : isToday
                          ? 'text-mint-700 dark:text-mint-300'
                          : 'text-ink-700 dark:text-ink-200'
                    }`}
                  >
                    {Number(iso.slice(8))}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="flex gap-[3px] mt-[3px]">
                      {dayEvents.slice(0, 3).map((e, j) => (
                        <span key={j} className="w-[5px] h-[5px] rounded-full" style={{ background: isSelected ? '#fff' : e.color }} />
                      ))}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </Card>

        <SectionTitle
          action={
            selected && (
              <button onClick={() => setSelected(null)} className="text-[13px] font-semibold text-mint-600 dark:text-mint-400">
                Show all
              </button>
            )
          }
        >
          {selected ? 'On this day' : 'This month'}
        </SectionTitle>

        <div className="space-y-2.5">
          {visibleEvents.length === 0 && (
            <EmptyState emoji="🗓️" title="Nothing scheduled" text="No renewals or trial deadlines in this view." />
          )}
          {visibleEvents.map((e, i) => {
            const d = daysUntil(e.date)
            return (
              <Link key={`${e.subId}-${e.date}-${i}`} to={`/subs/${e.subId}`} className="block">
                <Card className="p-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 text-center shrink-0">
                      <p className="text-[16px] font-bold text-ink-900 dark:text-ink-50 leading-none tabular-nums">{Number(e.date.slice(8))}</p>
                      <p className="text-[10px] font-semibold uppercase text-ink-400 mt-0.5">
                        {parseISO(e.date).toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                    </div>
                    <LogoTile name={e.name} color={e.color} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-ink-900 dark:text-ink-50 truncate">{e.name}</p>
                      <p className="text-[12px] text-ink-400">
                        {d < 0 ? 'passed' : d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`}
                      </p>
                    </div>
                    {e.kind === 'trial' ? (
                      <Badge tone="warn">TRIAL ENDS</Badge>
                    ) : (
                      <p className="text-[14px] font-bold tabular-nums text-ink-900 dark:text-ink-50">{e.amountText}</p>
                    )}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
