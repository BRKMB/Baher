import { useNavigate } from 'react-router-dom'
import type { Subscription } from '../lib/types'
import { useStore } from '../lib/store'
import { monthlyCost } from '../lib/money'
import { formatMoney } from '../lib/currency'
import { daysUntil, effectiveNextRenewal, relativeLabel } from '../lib/dates'
import { categoryLabel } from '../lib/categories'
import { Badge, Card, LogoTile } from './ui'
import { IconChevronRight } from './icons'

export function SubscriptionCard({ sub }: { sub: Subscription }) {
  const navigate = useNavigate()
  const { settings } = useStore()
  const renewal = effectiveNextRenewal(sub)
  const days = daysUntil(renewal)
  const cancelled = sub.status === 'cancelled'
  const cost = monthlyCost(sub, settings.currency)

  return (
    <Card onClick={() => navigate(`/subs/${sub.id}`)} className={`p-4 ${cancelled ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-3.5">
        <LogoTile name={sub.name} color={sub.color} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-semibold text-ink-900 dark:text-ink-50 truncate">{sub.name}</h3>
            {sub.isTrial && !cancelled && <Badge tone="warn">TRIAL</Badge>}
            {cancelled && <Badge tone="neutral">CANCELLED</Badge>}
            {sub.status === 'paused' && <Badge tone="info">PAUSED</Badge>}
          </div>
          <p className="text-[13px] text-ink-500 dark:text-ink-400 truncate mt-0.5">
            {categoryLabel(sub.category)}
            {!cancelled && (
              <>
                {' · '}
                <span className={days <= 3 ? 'text-amber-600 dark:text-amber-400 font-medium' : ''}>
                  {sub.isTrial ? 'trial ends' : 'renews'} {relativeLabel(sub.isTrial && sub.trialEndsAt ? sub.trialEndsAt : renewal)}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[16px] font-bold tabular-nums text-ink-900 dark:text-ink-50">
            {formatMoney(cost, settings.currency)}
          </p>
          <p className="text-[11px] text-ink-400 dark:text-ink-500 font-medium">/month</p>
        </div>
        <IconChevronRight className="w-4 h-4 text-ink-300 dark:text-ink-600 shrink-0" />
      </div>
    </Card>
  )
}
