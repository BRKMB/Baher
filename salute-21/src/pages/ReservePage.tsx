import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, Clock3, Users } from 'lucide-react'
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
    getAvailability(date)
      .then((data) => {
        if (!cancelled) setAvailability(data.slots)
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
    if (time && !slots.includes(time)) setTime('')
  }, [slots, time])

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

  return (
    <div className="min-h-screen">
      <Header variant="page" />
      <main className="px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
            >
              <ArrowLeft className="size-4" />
              {t('backHome')}
            </Link>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
              {t('reservePageEyebrow')}
            </p>
            <h1 className="font-display text-4xl tracking-[-0.02em] text-ink md:text-6xl text-balance">
              {t('reservePageTitle')}
            </h1>
            <div className="luxury-rule my-6 max-w-xs" />
            <p className="max-w-md text-base leading-relaxed text-muted">{t('reservePageIntro')}</p>

            <div className="mt-8 space-y-4 text-sm text-ink/80">
              <p className="inline-flex items-center gap-3">
                <CalendarDays className="size-4 text-amber" />
                {t('hoursNoteLunch')} · {t('hoursNoteBreakfast')}
              </p>
              <p className="inline-flex items-center gap-3">
                <Users className="size-4 text-amber" />
                Max {MAX_PARTY_SIZE} {t('guestsLabel')}
              </p>
              <p className="inline-flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-amber" />
                <span>{t('reservePolicy')}</span>
              </p>
            </div>
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="rounded-[1.5rem] border border-line bg-champagne/80 p-6 shadow-[0_24px_60px_rgba(12,11,10,0.07)] md:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm sm:col-span-1">
                <span className="font-medium text-ink/80">{t('reserveName')}</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-ink/80">{t('reservePhone')}</span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                  placeholder="+48 ..."
                />
              </label>
              <label className="grid gap-2 text-sm sm:col-span-2">
                <span className="font-medium text-ink/80">{t('reserveEmail')}</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-ink/80">{t('reserveDate')}</span>
                <input
                  required
                  type="date"
                  min={minBookableDate()}
                  max={maxBookableDate()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-ink/80">{t('reserveGuests')}</span>
                <input
                  required
                  type="number"
                  min={1}
                  max={MAX_PARTY_SIZE}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                />
              </label>

              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-medium text-ink/80">{t('reserveAvailable')}</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
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
                        className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${
                          selected
                            ? 'border-amber bg-amber text-ink'
                            : disabled
                              ? 'cursor-not-allowed border-line/60 bg-paper-deep/40 text-muted/40'
                              : 'border-line bg-paper text-ink/80 hover:border-amber'
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>

              <label className="grid gap-2 text-sm sm:col-span-2">
                <span className="font-medium text-ink/80">{t('reserveOccasion')}</span>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                >
                  <option value="">{t('occasionNone')}</option>
                  <option value="birthday">{t('occasionBirthday')}</option>
                  <option value="business">{t('occasionBusiness')}</option>
                  <option value="date">{t('occasionDate')}</option>
                  <option value="other">{t('occasionOther')}</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm sm:col-span-2">
                <span className="font-medium text-ink/80">{t('reserveNotes')}</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                />
              </label>

              {error && (
                <p className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !time}
                className="sm:col-span-2 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? t('reserveSubmitting') : t('reserveSubmit')}
              </button>
            </div>
          </motion.form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
