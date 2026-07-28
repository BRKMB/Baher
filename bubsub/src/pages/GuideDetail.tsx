import { Link, useParams } from 'react-router-dom'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS, getService } from '../data/services'
import { useStore } from '../lib/store'
import { formatDate } from '../lib/dates'
import { Badge, Card, EmptyState, LogoTile, PageHeader, SectionTitle } from '../components/ui'
import { IconCheck, IconClock, IconExternal, IconShield, IconThumbDown, IconThumbUp, IconWarning } from '../components/icons'

export function GuideDetail() {
  const { id } = useParams<{ id: string }>()
  const { settings, setSettings, subscriptions } = useStore()
  const guide = id ? getService(id) : undefined

  if (!guide) {
    return (
      <div className="page-in">
        <PageHeader title="Guide" back />
        <EmptyState emoji="🤷" title="Guide not found" text="This cancellation guide doesn't exist yet." />
      </div>
    )
  }

  const myVote = settings.guideVotes[guide.id]
  const vote = (kind: 'works' | 'broken') => {
    const next = { ...settings.guideVotes }
    if (myVote === kind) delete next[guide.id]
    else next[guide.id] = kind
    setSettings({ guideVotes: next })
  }
  const mySub = subscriptions.find((s) => s.serviceId === guide.id && s.status !== 'cancelled')
  const worksTotal = guide.votes.works + (myVote === 'works' ? 1 : 0)
  const brokenTotal = guide.votes.broken + (myVote === 'broken' ? 1 : 0)
  const trustPct = Math.round((worksTotal / Math.max(worksTotal + brokenTotal, 1)) * 100)

  return (
    <div className="page-in">
      <PageHeader title={guide.name} back subtitle={guide.domain} />
      <div className="px-5" style={{ paddingBottom: 'calc(var(--sab, 0px) + 96px)' }}>
        {/* Summary card */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <LogoTile name={guide.name} color={guide.color} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className="text-[12px] font-bold px-2.5 py-1 rounded-full"
                  style={{ color: DIFFICULTY_COLORS[guide.difficulty], background: `${DIFFICULTY_COLORS[guide.difficulty]}1a` }}
                >
                  {DIFFICULTY_LABELS[guide.difficulty]} to cancel
                </span>
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-500 dark:text-ink-400">
                  <IconClock className="w-4 h-4" /> ~{guide.estMinutes} min
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {guide.verified && (
                  <Badge tone="good">
                    <IconCheck className="w-3 h-3" strokeWidth={3} /> VERIFIED
                  </Badge>
                )}
                <span className="text-[11px] text-ink-400 font-medium">Checked {formatDate(guide.lastVerified)}</span>
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-semibold text-ink-500 dark:text-ink-400">Community trust</span>
              <span className="text-[12px] font-bold text-mint-600 dark:text-mint-400 tabular-nums">{trustPct}% works</span>
            </div>
            <div className="h-[7px] rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
              <div className="h-full rounded-full bg-mint-500" style={{ width: `${trustPct}%` }} />
            </div>
          </div>

          <a
            href={guide.cancelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 w-full h-[50px] rounded-2xl bg-ink-900 dark:bg-ink-50 text-white dark:text-ink-900 text-[15px] font-bold active:scale-[0.98] transition-transform"
          >
            Open cancellation page <IconExternal className="w-4 h-4" strokeWidth={2.2} />
          </a>
          <p className="text-center text-[11px] text-ink-400 mt-2 truncate">{guide.cancelUrl}</p>
        </Card>

        {mySub && (
          <Link
            to={`/subs/${mySub.id}`}
            className="mt-3 flex items-center gap-3 p-4 rounded-3xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200/70 dark:border-blue-500/25"
          >
            <span className="text-[18px]" aria-hidden>💡</span>
            <p className="text-[13px] font-medium text-blue-800 dark:text-blue-300 leading-snug">
              You track {mySub.name} in BUB SUB — after cancelling, mark it as cancelled to count your savings.
            </p>
          </Link>
        )}

        {/* Steps */}
        <SectionTitle>Step-by-step</SectionTitle>
        <Card className="p-5">
          <ol className="space-y-4">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex gap-3.5">
                <span className="w-[26px] h-[26px] rounded-full bg-mint-500 text-white text-[13px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[14px] leading-relaxed text-ink-700 dark:text-ink-200 font-medium">{step}</p>
              </li>
            ))}
          </ol>
        </Card>

        {/* Known issues / dark patterns */}
        {guide.issues.length > 0 && (
          <>
            <SectionTitle>Dark patterns & gotchas</SectionTitle>
            <div className="space-y-2.5">
              {guide.issues.map((issue, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-3xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/25"
                >
                  <IconWarning className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" strokeWidth={2} />
                  <p className="text-[13px] leading-snug text-amber-800 dark:text-amber-300 font-medium">{issue}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Alternative methods */}
        {guide.altMethods.length > 0 && (
          <>
            <SectionTitle>Alternative methods</SectionTitle>
            <Card className="p-5 space-y-3">
              {guide.altMethods.map((m, i) => (
                <p key={i} className="text-[14px] leading-relaxed text-ink-700 dark:text-ink-200 font-medium">
                  • {m}
                </p>
              ))}
            </Card>
          </>
        )}

        {/* Country notes */}
        {guide.countryNotes.length > 0 && (
          <>
            <SectionTitle>Country notes</SectionTitle>
            <Card className="p-5 space-y-3">
              {guide.countryNotes.map((n, i) => (
                <p key={i} className="text-[14px] leading-relaxed text-ink-700 dark:text-ink-200 font-medium">
                  🌍 {n}
                </p>
              ))}
            </Card>
          </>
        )}

        {/* Alternatives */}
        {guide.alternatives.length > 0 && (
          <>
            <SectionTitle>Cheaper alternatives</SectionTitle>
            <Card className="divide-y divide-ink-100/70 dark:divide-ink-800/70">
              {guide.alternatives.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-ink-900 dark:text-ink-50">{a.name}</p>
                    <p className="text-[12px] text-ink-400">{a.note}</p>
                  </div>
                  {a.free && <Badge tone="good">FREE</Badge>}
                </div>
              ))}
            </Card>
          </>
        )}

        {/* Voting */}
        <SectionTitle>Did this guide work?</SectionTitle>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => vote('works')}
            className={`flex items-center justify-center gap-2 h-[52px] rounded-2xl text-[14px] font-bold transition-colors ${
              myVote === 'works'
                ? 'bg-mint-500 text-white'
                : 'bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-200 border border-ink-100/80 dark:border-ink-800'
            }`}
          >
            <IconThumbUp className="w-5 h-5" /> Works · {worksTotal}
          </button>
          <button
            onClick={() => vote('broken')}
            className={`flex items-center justify-center gap-2 h-[52px] rounded-2xl text-[14px] font-bold transition-colors ${
              myVote === 'broken'
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-200 border border-ink-100/80 dark:border-ink-800'
            }`}
          >
            <IconThumbDown className="w-5 h-5" /> Broken · {brokenTotal}
          </button>
        </div>

        {guide.supportUrl && (
          <a
            href={guide.supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full h-[48px] rounded-2xl bg-white dark:bg-ink-900 border border-ink-100/80 dark:border-ink-800 text-[14px] font-semibold text-ink-600 dark:text-ink-300"
          >
            Official support <IconExternal className="w-4 h-4" />
          </a>
        )}

        <div className="flex items-start gap-2.5 mt-8 px-2">
          <IconShield className="w-4 h-4 text-ink-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-ink-400 dark:text-ink-500">
            Community-maintained guide — not legal advice, and cancellation is not guaranteed. Consumer protection laws in your country may give you extra rights.
          </p>
        </div>
      </div>
    </div>
  )
}
