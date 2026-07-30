import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarPlus, Check, BookOpen } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { downloadIcs, getBooking, type Booking } from '../lib/booking'
import { useI18n } from '../i18n/LanguageContext'

export function BookingSuccessPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const { t } = useI18n()
  const [booking, setBooking] = useState<Booking | null>(
    (location.state as { booking?: Booking } | null)?.booking ?? null,
  )

  useEffect(() => {
    if (booking || !id) return
    getBooking(id).then((b) => setBooking(b))
  }, [booking, id])

  return (
    <div className="min-h-screen">
      <Header variant="page" />
      <main className="px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl rounded-[1.6rem] border border-line bg-champagne/90 p-8 text-center shadow-[0_24px_60px_rgba(12,11,10,0.07)] md:p-12"
        >
          <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-olive text-paper">
            <Check className="size-6" />
          </span>
          <p className="mt-6 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
            Salute 21
          </p>
          <h1 className="mt-3 font-display text-4xl text-ink md:text-5xl">
            {t('reserveSuccessTitle')}
          </h1>
          <div className="luxury-rule mx-auto my-5 max-w-xs" />
          <p className="text-muted">{t('reserveSuccessText')}</p>

          {booking ? (
            <div className="mt-8 rounded-2xl border border-line bg-paper/70 p-5 text-left">
              <p className="text-xs font-semibold tracking-[0.2em] text-amber uppercase">
                {t('reserveRef')}
              </p>
              <p className="mt-1 font-display text-3xl text-ink">{booking.id}</p>
              <div className="mt-4 space-y-2 text-sm text-ink/80">
                <p>
                  <strong>{booking.name}</strong>
                </p>
                <p>
                  {booking.date} {t('at')} {booking.time}
                </p>
                <p>
                  {booking.guests} {t('guestsLabel')}
                </p>
                <p>{booking.email}</p>
                <p>{booking.phone}</p>
              </div>
            </div>
          ) : (
            <p className="mt-8 font-display text-2xl text-ink">{id}</p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {booking && (
              <button
                type="button"
                onClick={() => downloadIcs(booking)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition hover:bg-ink-soft"
              >
                <CalendarPlus className="size-4" />
                {t('reserveAddCalendar')}
              </button>
            )}
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink"
            >
              <BookOpen className="size-4" />
              {t('reserveViewMenu')}
            </Link>
            <Link
              to="/reserve"
              className="inline-flex items-center justify-center rounded-full border border-amber/50 bg-amber/15 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-amber"
            >
              {t('reserveNew')}
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
