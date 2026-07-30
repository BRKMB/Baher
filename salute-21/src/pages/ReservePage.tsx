import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, CalendarDays, Clock3, Minus, Plus, Users } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BrandLogo } from '../components/BrandLogo'
import { DatePicker } from '../components/DatePicker'
import {
  createBooking,
  getAvailability,
  getSlotsForDate,
  maxBookableDate,
  minBookableDate,
  MAX_PARTY_SIZE,
} from '../lib/booking'
import {
  answerMatchesChallenge,
  fetchCaptcha,
  type CaptchaChallenge,
} from '../lib/captcha'
import { useI18n } from '../i18n/LanguageContext'

const OCCASIONS = [
  { value: '', labelKey: 'occasionNone' as const },
  { value: 'birthday', labelKey: 'occasionBirthday' as const },
  { value: 'business', labelKey: 'occasionBusiness' as const },
  { value: 'date', labelKey: 'occasionDate' as const },
  { value: 'other', labelKey: 'occasionOther' as const },
]

export function ReservePage() {
  const { t, lang } = useI18n()
  const navigate = useNavigate()
  const formRef = useRef<HTMLElement>(null)
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
  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [website, setWebsite] = useState('') // honeypot

  const slots = useMemo(() => getSlotsForDate(date), [date])

  const loadCaptcha = async () => {
    const challenge = await fetchCaptcha()
    setCaptcha(challenge)
    setCaptchaAnswer('')
  }

  useEffect(() => {
    let cancelled = false
    fetchCaptcha().then((challenge) => {
      if (!cancelled) setCaptcha(challenge)
    })
    return () => {
      cancelled = true
    }
  }, [])

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
    if (website.trim()) return
    if (!captcha || !answerMatchesChallenge(captcha, captchaAnswer)) {
      setError(t('reserveCaptchaError'))
      await loadCaptcha()
      return
    }
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
        captchaToken: captcha.token,
        captchaAnswer: String(captchaAnswer).trim(),
      })
      navigate(`/reserve/success/${booking.id}`, { state: { booking } })
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('fully booked') || msg === 'SLOT_TAKEN') {
        setError(t('reserveSlotTaken'))
      } else if (msg.includes('CAPTCHA') || msg.toLowerCase().includes('captcha')) {
        setError(t('reserveCaptchaError'))
        await loadCaptcha()
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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen">
      <Header variant="page" />

      <section className="reserve-hero">
        <div className="reserve-hero__media" aria-hidden>
          <motion.img
            src="/images/reserve-dish.jpg"
            alt=""
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="reserve-hero__veil" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-6 md:px-8 md:pb-20 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
            >
              <ArrowLeft className="size-4" />
              {t('navHome')}
            </Link>

            <BrandLogo tone="light" className="text-[clamp(2.8rem,8vw,4.6rem)]" />
            <p className="mt-3 text-[11px] font-semibold tracking-[0.32em] text-gold uppercase">
              {t('reservePageEyebrow')}
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-white italic text-balance">
              {t('reservePageTitle')}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
              {t('reservePageIntro')}
            </p>

            <motion.button
              type="button"
              onClick={scrollToForm}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.55 }}
              className="mt-9 inline-flex items-center gap-3 rounded-full border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-white/18"
            >
              {t('reserveContinue')}
              <ArrowDown className="size-4 animate-bounce" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <main
        ref={formRef}
        id="reserve-form"
        className="relative scroll-mt-24 px-4 pb-16 pt-14 sm:px-5 md:px-8 md:pb-24 md:pt-20"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-14">
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28"
          >
            <p className="text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
              {t('reserveDetails')}
            </p>
            <h2 className="mt-3 font-display text-4xl text-ink italic md:text-5xl text-balance">
              {t('reserveFormTitle')}
            </h2>
            <div className="luxury-rule my-5 max-w-xs" />
            <p className="max-w-md text-sm leading-relaxed text-muted md:text-[0.95rem]">
              {t('reserveFormIntro')}
            </p>

            <ul className="mt-8 space-y-4 text-sm text-ink/80">
              <li className="flex items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line/80 bg-champagne/70">
                  <CalendarDays className="size-4 text-amber" strokeWidth={1.6} />
                </span>
                {t('hoursNoteLunch')} · {t('hoursNoteBreakfast')}
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line/80 bg-champagne/70">
                  <Users className="size-4 text-amber" strokeWidth={1.6} />
                </span>
                Max {MAX_PARTY_SIZE} {t('guestsLabel')}
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line/80 bg-champagne/70">
                  <Clock3 className="size-4 text-amber" strokeWidth={1.6} />
                </span>
                <span>{t('reservePolicy')}</span>
              </li>
            </ul>

            <div className="mt-10 hidden border-t border-line/70 pt-6 lg:block">
              <p className="text-[10px] font-semibold tracking-[0.24em] text-amber uppercase">
                {t('reserveSummary')}
              </p>
              <dl className="mt-4 space-y-3 text-sm">
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
          </motion.aside>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.65, delay: 0.06 }}
            className="relative bg-gradient-to-b from-champagne/40 via-transparent to-transparent px-1 py-1 sm:px-2"
          >
            <section className="space-y-5">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl text-ink italic md:text-3xl">
                  {t('reserveWhenTitle')}
                </h3>
                <span className="font-script text-2xl text-amber/80">01</span>
              </div>
              <div className="reserve-when-row">
                <DatePicker
                  required
                  value={date}
                  min={minBookableDate()}
                  max={maxBookableDate()}
                  onChange={setDate}
                />
                <div className="guest-stepper" aria-label={t('reserveGuests')}>
                  <button
                    type="button"
                    onClick={() => bumpGuests(-1)}
                    className="guest-stepper__btn"
                    aria-label="-"
                  >
                    <Minus className="size-4" strokeWidth={1.75} />
                  </button>
                  <p className="guest-stepper__count">
                    <span className="guest-stepper__value">{guests}</span>
                    <span className="guest-stepper__label">{t('reserveGuests')}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => bumpGuests(1)}
                    className="guest-stepper__btn"
                    aria-label="+"
                  >
                    <Plus className="size-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-10 space-y-5 border-t border-line/60 pt-9">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl text-ink italic md:text-3xl">
                  {t('reserveAvailable')}
                </h3>
                <span className="font-script text-2xl text-amber/80">02</span>
              </div>
              {slots.length === 0 ? (
                <p className="border-l-2 border-amber/50 bg-champagne/50 px-4 py-3 text-sm text-muted">
                  {t('reserveNoSlots')}
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2.5 min-[420px]:grid-cols-4 sm:grid-cols-4 md:grid-cols-5">
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
                        className={`slot-chip ${selected ? 'is-selected' : ''}`}
                      >
                        <span className="block text-sm font-semibold tabular-nums tracking-wide">
                          {slot}
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

            <section className="mt-10 space-y-5 border-t border-line/60 pt-9">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl text-ink italic md:text-3xl">{t('reserveDetails')}</h3>
                <span className="font-script text-2xl text-amber/80">03</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="grid gap-2 text-sm sm:col-span-2">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                    {t('reserveName')}
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field-input"
                    autoComplete="name"
                    placeholder={t('reserveNamePh')}
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                    {t('reservePhone')}
                  </span>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="field-input"
                    placeholder="+48 …"
                    autoComplete="tel"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                    {t('reserveEmail')}
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field-input"
                    placeholder="you@email.com"
                    autoComplete="email"
                  />
                </label>
                <label className="grid gap-2 text-sm sm:col-span-2">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                    {t('reserveOccasion')}
                  </span>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="field-input field-select"
                  >
                    {OCCASIONS.map((item) => (
                      <option key={item.value || 'none'} value={item.value}>
                        {t(item.labelKey)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm sm:col-span-2">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                    {t('reserveNotes')}
                  </span>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="field-input resize-none"
                    placeholder={t('reserveNotesPh')}
                  />
                </label>
              </div>
            </section>

            <section className="mt-10 space-y-4 border-t border-line/60 pt-9">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl text-ink italic md:text-3xl">
                  {t('reserveCaptcha')}
                </h3>
                <span className="font-script text-2xl text-amber/80">04</span>
              </div>
              <p className="text-sm text-muted">{t('reserveCaptchaHint')}</p>
              <div className="flex flex-wrap items-end gap-3">
                <label className="grid min-w-[10rem] flex-1 gap-2 text-sm">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                    {captcha ? captcha.question : '…'} =
                  </span>
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="off"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className="field-input max-w-[10rem]"
                    aria-label={t('reserveCaptcha')}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void loadCaptcha()}
                  className="rounded-full border border-line/80 bg-champagne/60 px-4 py-3 text-xs font-semibold tracking-wide text-ink transition hover:border-ink/40"
                >
                  {t('reserveCaptchaRefresh')}
                </button>
              </div>
              {/* Honeypot — leave empty */}
              <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0" aria-hidden>
                <label>
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>
            </section>

            {error && (
              <p className="mt-6 border-l-2 border-red-400 bg-red-50/80 px-4 py-3 text-sm text-red-900">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !time || !captcha}
              className="mt-9 inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 text-base font-semibold tracking-wide text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? t('reserveSubmitting') : t('reserveSubmit')}
            </button>
          </motion.form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
