import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { CalendarPlus, Download, BookOpen, Navigation } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BrandLogo } from '../components/BrandLogo'
import { PassBarcode } from '../components/PassBarcode'
import { EgyptMotif } from '../components/EgyptMotif'
import { brand } from '../data/content'
import { downloadIcs, getBooking, type Booking } from '../lib/booking'
import { useI18n } from '../i18n/LanguageContext'

export function BookingSuccessPage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const { t, lang } = useI18n()
  const ticketRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [savedHint, setSavedHint] = useState(false)
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
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return value
    }
  }

  const refId = booking?.id || id

  const saveTicketImage = async () => {
    if (!ticketRef.current || !refId) return
    setSaving(true)
    setSavedHint(false)
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0f0d0b',
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${refId}.png`
      a.click()
      setSavedHint(true)
      window.setTimeout(() => setSavedHint(false), 2500)
    } catch {
      /* ignore */
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header variant="page" />
      <main className="px-4 pb-20 pt-24 sm:px-5 md:px-8 md:pb-28 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-lg"
        >
          <div className="mb-8 text-center">
            <motion.div
              className="success-check mx-auto"
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.05 }}
              aria-hidden
            >
              <svg viewBox="0 0 72 72" className="success-check__svg">
                <motion.circle
                  cx="36"
                  cy="36"
                  r="30"
                  className="success-check__ring"
                  initial={{ pathLength: 0, opacity: 0.35 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
                />
                <motion.path
                  d="M22.5 37.2 L31.2 45.6 L49.5 26.8"
                  className="success-check__mark"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
                />
              </svg>
            </motion.div>
            <p className="mt-5 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
              {t('reserveConfirmed')}
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink italic md:text-5xl text-balance">
              {t('reserveSuccessTitle')}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
              {t('reserveSuccessText')}
            </p>
            <EgyptMotif className="mt-5" />
          </div>

          <div ref={ticketRef} className="boarding-pass">
            <div className="boarding-pass__top">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <BrandLogo tone="light" className="text-[2.1rem] md:text-[2.35rem]" />
                  <p className="boarding-pass__pass-label mt-1 text-[10px] font-semibold tracking-[0.22em] uppercase">
                    {t('reservePassLabel')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="boarding-pass__guests-label text-[10px] font-semibold tracking-[0.18em] uppercase">
                    {t('reserveGuests')}
                  </p>
                  <p className="boarding-pass__guests-value mt-0.5 text-2xl font-semibold tabular-nums">
                    {booking ? booking.guests : '—'}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5">
                <div className="col-span-2">
                  <p className="boarding-pass__label">{t('reserveName')}</p>
                  <p className="boarding-pass__value">{booking?.name || '—'}</p>
                </div>
                <div>
                  <p className="boarding-pass__label">{t('reserveDate')}</p>
                  <p className="boarding-pass__value boarding-pass__value--meta">
                    {booking ? formatDate(booking.date) : '—'}
                  </p>
                </div>
                <div>
                  <p className="boarding-pass__label">{t('reserveTime')}</p>
                  <p className="boarding-pass__value boarding-pass__value--meta tabular-nums">
                    {booking ? booking.time : '—'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="boarding-pass__label">{t('contactTitle')}</p>
                  <p className="boarding-pass__address">
                    {brand.address.street}
                    <span> · {brand.address.city}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="boarding-pass__perforation" aria-hidden>
              <span />
            </div>

            <div className="boarding-pass__stub">
              {refId ? <PassBarcode value={refId} /> : null}
              <p className="boarding-pass__ref-label mt-4 text-[10px] font-semibold tracking-[0.24em] uppercase">
                {t('reserveRef')}
              </p>
              <p className="boarding-pass__ref">{refId}</p>
              <p className="boarding-pass__hint mx-auto mt-3 max-w-[18rem] text-center text-xs leading-relaxed">
                {t('reserveScanHint')}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => void saveTicketImage()}
              disabled={saving || !refId}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:opacity-50"
            >
              <Download className="size-4" strokeWidth={1.7} />
              {saving ? t('reserveSavingPass') : savedHint ? t('reservePassSaved') : t('reserveSavePass')}
            </button>

            {booking && (
              <button
                type="button"
                onClick={() => downloadIcs(booking)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber/45 bg-amber/12 px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-amber/22"
              >
                <CalendarPlus className="size-4" strokeWidth={1.7} />
                {t('reserveAddCalendar')}
              </button>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={brand.address.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-ink"
              >
                <Navigation className="size-4" strokeWidth={1.7} />
                {t('reserveGetDirections')}
              </a>
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-ink"
              >
                <BookOpen className="size-4" strokeWidth={1.7} />
                {t('reserveViewMenu')}
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
