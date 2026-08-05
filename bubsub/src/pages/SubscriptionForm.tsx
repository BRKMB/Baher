import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore, uid } from '../lib/store'
import { SERVICES } from '../data/services'
import { CATEGORIES } from '../lib/categories'
import { CURRENCIES } from '../lib/currency'
import { addDays, todayISO } from '../lib/dates'
import { LogoTile, PageHeader, SectionTitle } from '../components/ui'
import { IconSearch } from '../components/icons'
import type { BillingCycle, Category, Subscription } from '../lib/types'

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#f59e0b', '#14b8a6', '#71747f', '#191919']
const CYCLES: { id: BillingCycle; label: string }[] = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly' },
  { id: 'yearly', label: 'Yearly' },
]
const REMINDER_OPTIONS = [1, 3, 7, 30]

const inputCls =
  'w-full h-[46px] px-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-100/80 dark:border-ink-800 text-[15px] text-ink-900 dark:text-ink-50 placeholder:text-ink-400'
const labelCls = 'block text-[12px] font-bold uppercase tracking-[0.1em] text-ink-400 mb-1.5 px-1'

export function SubscriptionForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { subscriptions, addSubscription, updateSubscription, settings } = useStore()
  const editing = id ? subscriptions.find((s) => s.id === id) : undefined

  const [name, setName] = useState(editing?.name ?? '')
  const [serviceId, setServiceId] = useState(editing?.serviceId)
  const [color, setColor] = useState(editing?.color ?? COLORS[0])
  const [category, setCategory] = useState<Category>(editing?.category ?? 'entertainment')
  const [price, setPrice] = useState(editing ? String(editing.price) : '')
  const [currency, setCurrency] = useState(editing?.currency ?? settings.currency)
  const [cycle, setCycle] = useState<BillingCycle>(editing?.cycle ?? 'monthly')
  const [nextRenewal, setNextRenewal] = useState(editing?.nextRenewal ?? addDays(todayISO(), 30))
  const [isTrial, setIsTrial] = useState(editing?.isTrial ?? false)
  const [trialEndsAt, setTrialEndsAt] = useState(editing?.trialEndsAt ?? addDays(todayISO(), 7))
  const [autoRenew, setAutoRenew] = useState(editing?.autoRenew ?? true)
  const [paymentMethod, setPaymentMethod] = useState(editing?.paymentMethod ?? '')
  const [notes, setNotes] = useState(editing?.notes ?? '')
  const [tags, setTags] = useState(editing?.tags.join(', ') ?? '')
  const [reminders, setReminders] = useState<number[]>(editing?.remindDaysBefore ?? [3, 1])
  const [pickerQuery, setPickerQuery] = useState('')
  const [error, setError] = useState('')

  const suggestions = useMemo(() => {
    if (editing) return []
    const q = pickerQuery.toLowerCase()
    return SERVICES.filter((s) => !q || s.name.toLowerCase().includes(q)).slice(0, 8)
  }, [pickerQuery, editing])

  const pickService = (svcId: string) => {
    const svc = SERVICES.find((s) => s.id === svcId)
    if (!svc) return
    setServiceId(svc.id)
    setName(svc.name)
    setColor(svc.color)
    setCategory(svc.category)
    if (svc.typicalPrice) setPrice(String(svc.typicalPrice))
  }

  const save = () => {
    const p = Number(price)
    if (!name.trim()) return setError('Give it a name.')
    if (!price || Number.isNaN(p) || p < 0) return setError('Enter a valid price.')
    const data: Subscription = {
      id: editing?.id ?? uid(),
      serviceId,
      name: name.trim(),
      color,
      category,
      price: p,
      currency,
      cycle,
      nextRenewal: isTrial ? trialEndsAt : nextRenewal,
      status: editing?.status === 'cancelled' ? 'cancelled' : isTrial ? 'trial' : 'active',
      autoRenew,
      isTrial,
      trialEndsAt: isTrial ? trialEndsAt : undefined,
      paymentMethod: paymentMethod.trim() || undefined,
      notes: notes.trim() || undefined,
      tags: tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean),
      remindDaysBefore: reminders.sort((a, b) => b - a),
      createdAt: editing?.createdAt ?? todayISO(),
      cancelledAt: editing?.cancelledAt,
    }
    if (editing) {
      updateSubscription(editing.id, data)
      navigate(`/subs/${editing.id}`)
    } else {
      addSubscription(data)
      navigate('/')
    }
  }

  return (
    <div className="page-in">
      <PageHeader title={editing ? 'Edit subscription' : 'New subscription'} back />
      <div className="px-5" style={{ paddingBottom: 'calc(var(--sab, 0px) + 110px)' }}>
        {/* Quick pick from catalog */}
        {!editing && (
          <>
            <div className="relative mb-3">
              <IconSearch className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                value={pickerQuery}
                onChange={(e) => setPickerQuery(e.target.value)}
                placeholder="Quick add: Netflix, Spotify, Adobe…"
                aria-label="Search known services"
                className={`${inputCls} pl-11`}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => pickService(s.id)}
                  className={`shrink-0 flex items-center gap-2 pl-1.5 pr-3.5 h-[42px] rounded-full border transition-colors ${
                    serviceId === s.id
                      ? 'border-mint-500 bg-mint-50 dark:bg-mint-700/20'
                      : 'border-ink-100/80 dark:border-ink-800 bg-white dark:bg-ink-900'
                  }`}
                >
                  <LogoTile name={s.name} color={s.color} serviceId={s.id} size="sm" />
                  <span className="text-[13px] font-semibold text-ink-800 dark:text-ink-100 whitespace-nowrap">{s.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        <SectionTitle>Basics</SectionTitle>
        <div className="space-y-4">
          <div>
            <label htmlFor="f-name" className={labelCls}>Name</label>
            <input id="f-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Netflix" className={inputCls} />
          </div>
          <div className="grid grid-cols-[1fr_110px] gap-2.5">
            <div>
              <label htmlFor="f-price" className={labelCls}>Price</label>
              <input
                id="f-price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9.99"
                inputMode="decimal"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="f-currency" className={labelCls}>Currency</label>
              <select id="f-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCls}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <span className={labelCls}>Billing cycle</span>
            <div className="grid grid-cols-4 gap-2">
              {CYCLES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCycle(c.id)}
                  className={`h-[40px] rounded-xl text-[13px] font-semibold transition-colors ${
                    cycle === c.id
                      ? 'bg-ink-900 text-white dark:bg-ink-50 dark:text-ink-900'
                      : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-300 border border-ink-100/80 dark:border-ink-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="f-category" className={labelCls}>Category</label>
            <select id="f-category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <span className={labelCls}>Color</span>
            <div className="flex gap-2.5 flex-wrap px-1">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  className={`w-[34px] h-[34px] rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-ink-900 dark:ring-ink-50 ring-offset-ink-50 dark:ring-offset-ink-950 scale-110' : ''}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <SectionTitle>Renewal</SectionTitle>
        <div className="space-y-4">
          <button
            onClick={() => setIsTrial(!isTrial)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-100/80 dark:border-ink-800"
            role="switch"
            aria-checked={isTrial}
          >
            <div className="text-left">
              <p className="text-[15px] font-semibold text-ink-900 dark:text-ink-50">Free trial</p>
              <p className="text-[12px] text-ink-400">Track the trial deadline with a countdown</p>
            </div>
            <span className={`w-[50px] h-[30px] rounded-full p-[3px] transition-colors ${isTrial ? 'bg-mint-500' : 'bg-ink-200 dark:bg-ink-700'}`}>
              <span className={`block w-[24px] h-[24px] rounded-full bg-white shadow transition-transform ${isTrial ? 'translate-x-[20px]' : ''}`} />
            </span>
          </button>
          {isTrial ? (
            <div>
              <label htmlFor="f-trial" className={labelCls}>Trial ends on</label>
              <input id="f-trial" type="date" value={trialEndsAt} onChange={(e) => setTrialEndsAt(e.target.value)} className={inputCls} />
            </div>
          ) : (
            <div>
              <label htmlFor="f-renewal" className={labelCls}>Next renewal</label>
              <input id="f-renewal" type="date" value={nextRenewal} onChange={(e) => setNextRenewal(e.target.value)} className={inputCls} />
            </div>
          )}
          <button
            onClick={() => setAutoRenew(!autoRenew)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-ink-900 border border-ink-100/80 dark:border-ink-800"
            role="switch"
            aria-checked={autoRenew}
          >
            <div className="text-left">
              <p className="text-[15px] font-semibold text-ink-900 dark:text-ink-50">Auto-renew</p>
              <p className="text-[12px] text-ink-400">Charges repeat automatically</p>
            </div>
            <span className={`w-[50px] h-[30px] rounded-full p-[3px] transition-colors ${autoRenew ? 'bg-mint-500' : 'bg-ink-200 dark:bg-ink-700'}`}>
              <span className={`block w-[24px] h-[24px] rounded-full bg-white shadow transition-transform ${autoRenew ? 'translate-x-[20px]' : ''}`} />
            </span>
          </button>
          <div>
            <span className={labelCls}>Remind me before</span>
            <div className="flex gap-2">
              {REMINDER_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setReminders((r) => (r.includes(d) ? r.filter((x) => x !== d) : [...r, d]))}
                  className={`flex-1 h-[40px] rounded-xl text-[13px] font-semibold transition-colors ${
                    reminders.includes(d)
                      ? 'bg-mint-500 text-white'
                      : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-300 border border-ink-100/80 dark:border-ink-800'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>

        <SectionTitle>Extras</SectionTitle>
        <div className="space-y-4">
          <div>
            <label htmlFor="f-payment" className={labelCls}>Payment method</label>
            <input id="f-payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="Visa •• 4242" className={inputCls} />
          </div>
          <div>
            <label htmlFor="f-tags" className={labelCls}>Tags (comma separated)</label>
            <input id="f-tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="work, family, unused" className={inputCls} />
          </div>
          <div>
            <label htmlFor="f-notes" className={labelCls}>Notes</label>
            <textarea
              id="f-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything worth remembering…"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-ink-900 border border-ink-100/80 dark:border-ink-800 text-[15px] text-ink-900 dark:text-ink-50 placeholder:text-ink-400 resize-none"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-center text-[13px] font-semibold text-red-500">{error}</p>}

        <button
          onClick={save}
          className="mt-6 w-full h-[52px] rounded-2xl bg-mint-500 text-white text-[16px] font-bold active:scale-[0.98] transition-transform shadow-float"
        >
          {editing ? 'Save changes' : 'Add subscription'}
        </button>
      </div>
    </div>
  )
}
