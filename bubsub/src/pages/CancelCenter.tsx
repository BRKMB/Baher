import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS, SERVICES } from '../data/services'
import { Card, EmptyState, LogoTile, PageHeader } from '../components/ui'
import { IconCheck, IconChevronRight, IconClock, IconSearch, IconShield } from '../components/icons'
import type { Difficulty } from '../lib/types'

const FILTERS: { id: Difficulty | 0; label: string }[] = [
  { id: 0, label: 'All' },
  { id: 1, label: 'Easy' },
  { id: 2, label: 'Medium' },
  { id: 3, label: 'Hard' },
  { id: 4, label: 'Very Hard' },
]

export function CancelCenter() {
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | 0>(0)

  const list = useMemo(() => {
    let out = [...SERVICES]
    if (query) out = out.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    if (difficulty !== 0) out = out.filter((s) => s.difficulty === difficulty)
    // Trust ranking: verified first, then community score
    return out.sort((a, b) => {
      const score = (s: typeof a) => (s.verified ? 1000 : 0) + s.votes.works - s.votes.broken * 2
      return score(b) - score(a)
    })
  }, [query, difficulty])

  return (
    <div className="page-in">
      <PageHeader title="Cancel anything" subtitle="Community-verified cancellation guides" />
      <div className="px-5" style={{ paddingBottom: 'calc(var(--sab, 0px) + 96px)' }}>
        <div className="flex items-start gap-3 p-4 rounded-[26px] glass mb-4">
          <IconShield className="w-5 h-5 text-mint-600 dark:text-mint-400 shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[13px] leading-snug text-ink-700 dark:text-ink-200 font-medium">
            No hidden buttons. No dark patterns. Every guide shows you exactly where to click — maintained and verified by the community.
          </p>
        </div>

        <div className="relative">
          <IconSearch className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 z-[1]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a service to cancel"
            aria-label="Search cancellation guides"
            className="w-full h-[48px] pl-11 pr-4 rounded-[20px] glass-strong text-[15px] text-ink-900 dark:text-ink-50 placeholder:text-ink-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 mt-3.5 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setDifficulty(f.id)}
              className={`shrink-0 px-3.5 h-[34px] rounded-full text-[13px] font-semibold transition-all ${
                difficulty === f.id
                  ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900 shadow-sm'
                  : 'glass-soft text-ink-600 dark:text-ink-300'
              }`}
            >
              {f.id !== 0 && (
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: DIFFICULTY_COLORS[f.id] }} />
              )}
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-2.5 mt-4">
          {list.length === 0 && (
            <EmptyState
              emoji="🔍"
              title="Not in the database yet"
              text="This service hasn't been documented by the community yet. New guides are added all the time."
            />
          )}
          {list.map((s) => (
            <Link key={s.id} to={`/cancel/${s.id}`} className="block">
              <Card className="p-4">
                <div className="flex items-center gap-3.5">
                  <LogoTile name={s.name} color={s.color} serviceId={s.id} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-[15px] font-semibold text-ink-900 dark:text-ink-50 truncate">{s.name}</h3>
                      {s.verified && (
                        <span className="inline-flex items-center justify-center w-[16px] h-[16px] rounded-full bg-mint-500 text-white shrink-0" aria-label="Verified guide">
                          <IconCheck className="w-[10px] h-[10px]" strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ color: DIFFICULTY_COLORS[s.difficulty], background: `${DIFFICULTY_COLORS[s.difficulty]}1a` }}
                      >
                        {DIFFICULTY_LABELS[s.difficulty]}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-400">
                        <IconClock className="w-3.5 h-3.5" /> ~{s.estMinutes} min
                      </span>
                      <span className="text-[11px] font-medium text-ink-400">👍 {s.votes.works}</span>
                    </div>
                  </div>
                  <IconChevronRight className="w-4 h-4 text-ink-300 dark:text-ink-600 shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <p className="text-[11px] leading-relaxed text-ink-400 dark:text-ink-500 text-center mt-8 px-4">
          Guides are community-maintained instructions, not legal advice. Steps can change when services update their websites — votes and verification dates show how fresh each guide is.
        </p>
      </div>
    </div>
  )
}
