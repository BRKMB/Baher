import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarPlus, BookOpen, Sparkles } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BrandLogo } from '../components/BrandLogo'
import { downloadIcs, getBooking, type Booking } from '../lib/booking'
import { useI18n } from '../i18n/LanguageContext'

export function BookingSuccessPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const { t, lang } = useI18n()
  const [booking, setBooking] = useState<Booking | null>(
    (location.state as { booking?: Booking } | null)?.booking ?? null,
  )

  useEffect(() => {
    if (booking || !id) return
    getBooking(id).then((b) => setBooking(b))
  }, [booking, id])

  const formatDate = (value: string) => {
    try {
      return new Date(`${value}T12:00:00`).toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    } catch {
      return value
    }
  }

  return (
    <div className="min-h-screen success-glow">
      <Header variant="page" />
      <main className="relative overflow-hidden px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32">
        <div
          className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-72 max-w-3xl opacity-[0.14]"
          aria-hidden
        >
          <img
            src="/images/reserve-dish.jpg"
            alt=""
            className="h-full w-full object-cover blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-paper via-transparent to-paper" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 14 }}
            className="mx-auto inline-flex size-16 items-center justify-center rounded-full border border-gold/40 bg-olive text-gold"
          >
            <Sparkles className="size-6" strokeWidth={1.5} />
          </motion.div>

          <p className="mt-7 font-script text-4xl text-amber md:text-5xl">{t('reserveSuccessScript')}</p>
          <BrandLogo className="mt-4 text-[2.4rem] md:text-[2.8rem]" />
          <h1 className="mt-5 font-display text-4xl text-ink italic md:text-5xl text-balance">
            {t('reserveSuccessTitle')}
          </h1>
          <div className="luxury-rule mx-auto my-6 max-w-xs" />
          <p className="mx-auto max-w-md text-base leading-relaxed text-muted md:text-lg">
            {t('reserveSuccessText')}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted/90">
            {t('reserveSuccessNote')}
          </p>

          {booking ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.55 }}
              className="mt-10 border-y border-line/80 bg-champagne/35 px-5 py-7 text-left backdrop-blur-[2px] md:px-8"
            >
              <p className="text-[10px] font-semibold tracking-[0.28em] text-amber uppercase">
                {t('reserveRef')}
              </p>
              <p className="mt-2 font-display text-3xl tracking-wide text-ink md:text-4xl">
                {booking.id}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
                    {t('reserveName')}
                  </p>
                  <p className="mt-1 font-medium text-ink">{booking.name}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
                    {t('reserveGuests')}
                  </p>
                  <p className="mt-1 font-medium text-ink">
                    {booking.guests} {t('guestsLabel')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
                    {t('reserveDate')}
                  </p>
                  <p className="mt-1 font-medium text-ink">{formatDate(booking.date)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-muted uppercase">
                    {t('reserveTime')}
                  </p>
                  <p className="mt-1 font-medium text-ink">
                    {t('at')} {booking.time}
                  </p>
                </div>
              </div>

              <p className="mt-6 text-sm text-muted">
                {booking.email} · {booking.phone}
              </p>
            </motion.div>
          ) : (
            <p className="mt-10 font-display text-2xl text-ink">{id}</p>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {booking && (
              <button
                type="button"
                onClick={() => downloadIcs(booking)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
              >
                <CalendarPlus className="size-4" strokeWidth={1.7} />
                {t('reserveAddCalendar')}
              </button>
            )}
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink transition hover:border-ink"
            >
              <BookOpen className="size-4" strokeWidth={1.7} />
              {t('reserveViewMenu')}
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-amber/40 bg-amber/10 px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-amber/25"
            >
              {t('navHome')}
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
