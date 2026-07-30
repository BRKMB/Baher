import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, Clock3, Minus, Plus, Users } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import {
  createBooking,
  getAvailability,
  getSlotsForDate,
  maxBookableDate,
  minBookableDate,
  MAX_PARTY_SIZE,
} from '../lib/booking'
import { useI18n } from '../i18n/LanguageContext'

export function ReservePage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(minBookableDate())
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [occasion, setOccasion] = useState('')
  const [notes, setNotes] = useState('')
  const [availability, setAvailability] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const slots = useMemo(() => getSlotsForDate(date), [date])

  useEffect(() => {
    let cancelled = false
    setAvailability({})
    getAvailability(date)
      .then((data) => {
        if (!cancelled) setAvailability(data.slots ?? {})
      })
      .catch(() => {
        if (!cancelled) {
          const map: Record<string, number> = {}
          for (const s of getSlotsForDate(date)) map[s] = 28
          setAvailability(map)
        }
      })
    return () => {
      cancelled = true
    }
  }, [date])

  useEffect(() => {
    if (time && (!slots.includes(time) || (availability[time] ?? 28) < guests)) {
      setTime('')
      return
    }
    if (!time && slots.length > 0) {
      const firstOpen = slots.find((slot) => (availability[slot] ?? 28) >= guests)
      if (firstOpen) setTime(firstOpen)
    }
  }, [slots, time, guests, availability])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const booking = await createBooking({
        name,
        email,
        phone,
        date,
        time,
        guests,
        occasion,
        notes,
        lang,
      })
      navigate(`/reserve/success/${booking.id}`, { state: { booking } })
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('fully booked') || msg === 'SLOT_TAKEN') {
        setError(t('reserveSlotTaken'))
      } else {
        setError(t('reserveError'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const bumpGuests = (delta: number) => {
    setGuests((g) => Math.min(MAX_PARTY_SIZE, Math.max(1, g + delta)))
  }

  const formatDate = (value: string) => {
    try {
      return new Date(`${value}T12:00:00`).toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    } catch {
      return value
    }
  }

  return (
    <div className="min-h-screen">
      <Header variant="page" />
      <main className="px-4 pb-28 pt-24 sm:px-5 md:px-8 md:pb-28 md:pt-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-12">
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28"
          >
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
            >
              <ArrowLeft className="size-4" />
              {t('backHome')}
            </Link>

            <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
              {t('reservePageEyebrow')}
            </p>
            <h1 className="font-display text-[2.5rem] leading-[1.05] tracking-[-0.02em] text-ink italic md:text-6xl text-balance">
              {t('reservePageTitle')}
            </h1>
            <div className="luxury-rule my-5 max-w-xs" />
            <p className="max-w-md text-sm leading-relaxed text-muted md:text-base">
              {t('reservePageIntro')}
            </p>

            <div className="mt-7 hidden overflow-hidden md:block">
              <img
                src="/images/reserve-dining.jpg"
                alt=""
                className="aspect-[16/10] w-full object-cover"
              />
            </div>

            <ul className="mt-7 space-y-3 text-sm text-ink/80">
              <li className="flex items-center gap-3">
                <CalendarDays className="size-4 shrink-0 text-amber" />
                {t('hoursNoteLunch')} · {t('hoursNoteBreakfast')}
              </li>
              <li className="flex items-center gap-3">
                <Users className="size-4 shrink-0 text-amber" />
                Max {MAX_PARTY_SIZE} {t('guestsLabel')}
              </li>
              <li className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-amber" />
                <span>{t('reservePolicy')}</span>
              </li>
            </ul>

            {(date || time || guests) && (
              <div className="mt-8 hidden border-t border-line pt-6 lg:block">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-amber uppercase">
                  {t('reserveSummary')}
                </p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">{t('reserveDate')}</dt>
                    <dd className="font-medium text-ink">{formatDate(date)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">{t('reserveTime')}</dt>
                    <dd className="font-medium text-ink">{time || '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">{t('reserveGuests')}</dt>
                    <dd className="font-medium text-ink">
                      {guests} {t('guestsLabel')}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </motion.aside>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="border border-line bg-champagne/90 p-5 shadow-[0_24px_60px_rgba(12,11,10,0.07)] sm:p-7 md:p-8"
          >
            <section className="space-y-4">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl text-ink italic">{t('reserveDate')}</h2>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-amber uppercase">
                  01
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-ink/75">{t('reserveDate')}</span>
                  <input
                    required
                    type="date"
                    min={minBookableDate()}
                    max={maxBookableDate()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="field-input"
                  />
                </label>
                <div className="grid gap-2 text-sm">
                  <span className="font-medium text-ink/75">{t('reserveGuests')}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => bumpGuests(-1)}
                      className="inline-flex size-11 items-center justify-center border border-line bg-paper text-ink transition hover:border-ink"
                      aria-label="-"
                    >
                      <Minus className="size-4" />
                    </button>
                    <p className="min-w-12 text-center font-display text-3xl text-ink tabular-nums">
                      {guests}
                    </p>
                    <button
                      type="button"
                      onClick={() => bumpGuests(1)}
                      className="inline-flex size-11 items-center justify-center border border-line bg-paper text-ink transition hover:border-ink"
                      aria-label="+"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 space-y-4 border-t border-line pt-7">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl text-ink italic">{t('reserveAvailable')}</h2>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-amber uppercase">
                  02
                </span>
              </div>
              {slots.length === 0 ? (
                <p className="border border-line bg-paper/70 px-4 py-3 text-sm text-muted">
                  {t('reserveNoSlots')}
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 min-[420px]:grid-cols-4 sm:grid-cols-4 md:grid-cols-5">
                  {slots.map((slot) => {
                    const remaining = availability[slot] ?? 28
                    const disabled = remaining < guests
                    const selected = time === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={disabled}
                        onClick={() => setTime(slot)}
                        className={`min-h-12 border px-1.5 py-2 text-center transition ${
                          selected
                            ? 'border-ink bg-ink text-white'
                            : disabled
                              ? 'cursor-not-allowed border-line/50 bg-paper-deep/30 text-muted/35'
                              : 'border-line bg-paper text-ink/85 hover:border-ink'
                        }`}
                      >
                        <span className="block text-sm font-semibold tabular-nums">{slot}</span>
                        <span
                          className={`mt-0.5 block text-[9px] tracking-wide uppercase ${
                            selected ? 'text-white/65' : 'text-muted/70'
                          }`}
                        >
                          {disabled ? '—' : `${remaining}`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
              {slots.length > 0 && !time && (
                <p className="text-xs text-muted">{t('reservePickTime')}</p>
              )}
            </section>

            <section className="mt-8 space-y-4 border-t border-line pt-7">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-2xl text-ink italic">{t('reserveName')}</h2>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-amber uppercase">
                  03
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm sm:col-span-2">
                  <span className="font-medium text-ink/75">{t('reserveName')}</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field-input"
                    autoComplete="name"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-ink/75">{t('reservePhone')}</span>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="field-input"
                    placeholder="+48 ..."
                    autoComplete="tel"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium text-ink/75">{t('reserveEmail')}</span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field-input"
                    autoComplete="email"
                  />
                </label>
                <label className="grid gap-2 text-sm sm:col-span-2">
                  <span className="font-medium text-ink/75">{t('reserveOccasion')}</span>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="field-input"
                  >
                    <option value="">{t('occasionNone')}</option>
                    <option value="birthday">{t('occasionBirthday')}</option>
                    <option value="business">{t('occasionBusiness')}</option>
                    <option value="date">{t('occasionDate')}</option>
                    <option value="other">{t('occasionOther')}</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm sm:col-span-2">
                  <span className="font-medium text-ink/75">{t('reserveNotes')}</span>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="field-input resize-none"
                  />
                </label>
              </div>
            </section>

            {error && (
              <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !time}
              className="mt-7 hidden w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex"
            >
              {submitting ? t('reserveSubmitting') : t('reserveSubmit')}
            </button>
          </motion.form>
        </div>
      </main>

      {/* Mobile sticky confirm bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-champagne/95 px-4 py-3 backdrop-blur-md sm:hidden safe-bottom">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted">
              {formatDate(date)}
              {time ? ` · ${time}` : ''}
            </p>
            <p className="truncate text-sm font-semibold text-ink">
              {guests} {t('guestsLabel')}
              {!time ? ` · ${t('reserveAvailable')}` : ''}
            </p>
          </div>
          <button
            type="button"
            disabled={submitting || !time}
            onClick={() => {
              const form = document.querySelector('form')
              form?.requestSubmit()
            }}
            className="shrink-0 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-45"
          >
            {submitting ? t('reserveSubmitting') : t('reserveSubmit')}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
