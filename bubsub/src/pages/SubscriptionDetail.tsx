import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { getService } from '../data/services'
import { monthlyCost, yearlyCost } from '../lib/money'
import { formatMoney } from '../lib/currency'
import { daysUntil, effectiveNextRenewal, formatDate, todayISO } from '../lib/dates'
import { categoryEmoji, categoryLabel } from '../lib/categories'
import { Badge, Card, EmptyState, LogoTile, PageHeader, SectionTitle } from '../components/ui'
import { IconChevronRight, IconPencil, IconScissors, IconTrash, IconWarning } from '../components/icons'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[14px] text-ink-500 dark:text-ink-400 font-medium">{label}</span>
      <span className="text-[14px] font-semibold text-ink-900 dark:text-ink-50 text-right">{value}</span>
    </div>
  )
}

export function SubscriptionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { subscriptions, settings, updateSubscription, deleteSubscription } = useStore()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const sub = subscriptions.find((s) => s.id === id)

  if (!sub) {
    return (
      <div className="page-in">
        <PageHeader title="Subscription" back />
        <EmptyState emoji="🫥" title="Not found" text="This subscription no longer exists." />
      </div>
    )
  }

  const guide = sub.serviceId ? getService(sub.serviceId) : undefined
  const renewal = effectiveNextRenewal(sub)
  const days = daysUntil(renewal)
  const cancelled = sub.status === 'cancelled'
  const trialDays = sub.trialEndsAt ? daysUntil(sub.trialEndsAt) : null

  const markCancelled = () => {
    updateSubscription(sub.id, { status: 'cancelled', autoRenew: false, cancelledAt: todayISO() })
  }
  const reactivate = () => {
    updateSubscription(sub.id, { status: 'active', autoRenew: true, cancelledAt: undefined })
  }

  return (
    <div className="page-in">
      <PageHeader
        title={sub.name}
        back
        action={
          <button
            onClick={() => navigate(`/edit/${sub.id}`)}
            aria-label="Edit subscription"
            className="p-2 rounded-full text-mint-600 dark:text-mint-400 active:bg-ink-100 dark:active:bg-ink-800"
          >
            <IconPencil className="w-5 h-5" />
          </button>
        }
      />
      <div className="px-5" style={{ paddingBottom: 'calc(var(--sab, 0px) + 96px)' }}>
        {/* Hero */}
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <LogoTile name={sub.name} color={sub.color} size="lg" />
            <h2 className="text-[20px] font-bold text-ink-900 dark:text-ink-50 mt-3">{sub.name}</h2>
            <p className="text-[13px] text-ink-400 font-medium mt-0.5">
              {categoryEmoji(sub.category)} {categoryLabel(sub.category)}
            </p>
            <p className="text-[34px] font-extrabold tabular-nums text-ink-900 dark:text-ink-50 mt-3 leading-none">
              {formatMoney(sub.price, sub.currency)}
              <span className="text-[15px] font-semibold text-ink-400"> /{sub.cycle === 'yearly' ? 'yr' : sub.cycle === 'weekly' ? 'wk' : sub.cycle === 'quarterly' ? 'qtr' : 'mo'}</span>
            </p>
            {sub.currency !== settings.currency && (
              <p className="text-[12px] text-ink-400 mt-1">
                ≈ {formatMoney(monthlyCost(sub, settings.currency), settings.currency)}/mo in {settings.currency}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3">
              {cancelled ? (
                <Badge tone="neutral">CANCELLED {sub.cancelledAt ? formatDate(sub.cancelledAt) : ''}</Badge>
              ) : sub.isTrial ? (
                <Badge tone="warn">FREE TRIAL</Badge>
              ) : (
                <Badge tone="good">ACTIVE</Badge>
              )}
              {!cancelled && <Badge tone={sub.autoRenew ? 'info' : 'neutral'}>{sub.autoRenew ? 'AUTO-RENEW ON' : 'AUTO-RENEW OFF'}</Badge>}
            </div>
          </div>
        </Card>

        {/* Trial countdown */}
        {sub.isTrial && !cancelled && trialDays !== null && trialDays >= 0 && (
          <div className="mt-3 p-5 rounded-3xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/25 text-center">
            <IconWarning className="w-6 h-6 text-amber-500 mx-auto" strokeWidth={2} />
            <p className="text-[28px] font-extrabold text-amber-700 dark:text-amber-300 mt-1 tabular-nums">
              {trialDays === 0 ? 'Last day!' : `${trialDays} day${trialDays === 1 ? '' : 's'} left`}
            </p>
            <p className="text-[13px] font-medium text-amber-700/80 dark:text-amber-400/80 mt-1">
              Trial ends {formatDate(sub.trialEndsAt!)} — cancel before then or you'll be charged{' '}
              {formatMoney(sub.price, sub.currency)}.
            </p>
          </div>
        )}

        {/* Details */}
        <SectionTitle>Details</SectionTitle>
        <Card className="divide-y divide-ink-100/70 dark:divide-ink-800/70">
          {!cancelled && <Row label="Next renewal" value={`${formatDate(renewal)} (${days === 0 ? 'today' : `${days}d`})`} />}
          <Row label="Billing cycle" value={sub.cycle.charAt(0).toUpperCase() + sub.cycle.slice(1)} />
          <Row label="Cost per month" value={formatMoney(monthlyCost(sub, settings.currency), settings.currency)} />
          <Row label="Cost per year" value={formatMoney(yearlyCost(sub, settings.currency), settings.currency)} />
          {sub.paymentMethod && <Row label="Payment method" value={sub.paymentMethod} />}
          <Row label="Reminders" value={sub.remindDaysBefore.length ? sub.remindDaysBefore.map((d) => `${d}d`).join(', ') + ' before' : 'Off'} />
          <Row label="Added" value={formatDate(sub.createdAt)} />
        </Card>

        {sub.tags.length > 0 && (
          <>
            <SectionTitle>Tags</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {sub.tags.map((t) => (
                <Badge key={t} tone="info">
                  #{t}
                </Badge>
              ))}
            </div>
          </>
        )}

        {sub.notes && (
          <>
            <SectionTitle>Notes</SectionTitle>
            <Card className="p-4">
              <p className="text-[14px] leading-relaxed text-ink-700 dark:text-ink-200">{sub.notes}</p>
            </Card>
          </>
        )}

        {/* Cancellation */}
        {!cancelled && (
          <>
            <SectionTitle>Want out?</SectionTitle>
            {guide ? (
              <Link to={`/cancel/${guide.id}`} className="block">
                <Card className="p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/15 flex items-center justify-center shrink-0">
                      <IconScissors className="w-6 h-6 text-red-500" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-ink-900 dark:text-ink-50">How to cancel {sub.name}</p>
                      <p className="text-[12px] text-ink-400">Verified guide · ~{guide.estMinutes} min · no dark patterns</p>
                    </div>
                    <IconChevronRight className="w-4 h-4 text-ink-300 dark:text-ink-600" />
                  </div>
                </Card>
              </Link>
            ) : (
              <Card className="p-4">
                <p className="text-[13px] text-ink-500 dark:text-ink-400 leading-snug">
                  No community guide linked to this subscription yet. Check the Guides tab — the community adds new services constantly.
                </p>
              </Card>
            )}
            <button
              onClick={markCancelled}
              className="mt-3 w-full h-[50px] rounded-2xl bg-red-500 text-white text-[15px] font-bold active:scale-[0.98] transition-transform"
            >
              I cancelled it — stop tracking charges
            </button>
          </>
        )}

        {cancelled && (
          <button
            onClick={reactivate}
            className="mt-6 w-full h-[50px] rounded-2xl bg-mint-500 text-white text-[15px] font-bold active:scale-[0.98] transition-transform"
          >
            Resubscribed? Mark as active
          </button>
        )}

        {/* Delete */}
        {confirmDelete ? (
          <div className="mt-3 p-4 rounded-3xl bg-red-50 dark:bg-red-500/10 border border-red-200/70 dark:border-red-500/25">
            <p className="text-[13px] font-semibold text-red-700 dark:text-red-300 text-center mb-3">
              Delete "{sub.name}" permanently? This can't be undone.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setConfirmDelete(false)}
                className="h-[44px] rounded-2xl bg-white dark:bg-ink-900 text-[14px] font-bold text-ink-700 dark:text-ink-200 border border-ink-100/80 dark:border-ink-800"
              >
                Keep it
              </button>
              <button
                onClick={() => {
                  deleteSubscription(sub.id)
                  navigate('/')
                }}
                className="h-[44px] rounded-2xl bg-red-500 text-white text-[14px] font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="mt-3 w-full h-[48px] rounded-2xl text-[14px] font-semibold text-red-500 flex items-center justify-center gap-2"
          >
            <IconTrash className="w-4.5 h-4.5" /> Delete subscription
          </button>
        )}
      </div>
    </div>
  )
}
