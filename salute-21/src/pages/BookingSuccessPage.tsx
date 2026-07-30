import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toPng } from 'html-to-image'
import { QRCodeSVG } from 'qrcode.react'
import { CalendarPlus, Download, BookOpen, Check } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BrandLogo } from '../components/BrandLogo'
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
  const qrValue =
    typeof window !== 'undefined'
      ? `${window.location.origin}/reserve/success/${encodeURIComponent(refId)}`
      : `https://salute21.brkmb.workers.dev/reserve/success/${encodeURIComponent(refId)}`

  const saveTicketImage = async () => {
    if (!ticketRef.current || !refId) return
    setSaving(true)
    setSavedHint(false)
    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#f6f1e6',
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
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
              <Check className="size-3.5" strokeWidth={2.2} />
              {t('reserveConfirmed')}
            </p>
            <h1 className="mt-3 font-display text-4xl text-ink italic md:text-5xl text-balance">
              {t('reserveSuccessTitle')}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base">
              {t('reserveSuccessText')}
            </p>
          </div>

          <div ref={ticketRef} className="boarding-pass">
            <div className="boarding-pass__top">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <BrandLogo className="text-[2.1rem] md:text-[2.35rem]" />
                  <p className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-amber uppercase">
                    {t('reservePassLabel')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-muted uppercase">
                    {t('reserveGuests')}
                  </p>
                  <p className="mt-0.5 text-2xl font-semibold tabular-nums text-ink">
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
                  <p className="boarding-pass__value">
                    {booking ? formatDate(booking.date) : '—'}
                  </p>
                </div>
                <div>
                  <p className="boarding-pass__label">{t('reserveTime')}</p>
                  <p className="boarding-pass__value tabular-nums">
                    {booking ? booking.time : '—'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="boarding-pass__label">{t('contactTitle')}</p>
                  <p className="boarding-pass__value text-[0.95rem]">
                    {brand.address.street}
                    <span className="text-muted"> · {brand.address.city}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="boarding-pass__perforation" aria-hidden>
              <span />
            </div>

            <div className="boarding-pass__stub">
              <div className="mx-auto w-fit rounded-xl bg-white p-3 shadow-[0_1px_0_rgba(12,11,10,0.04)]">
                <QRCodeSVG
                  value={qrValue}
                  size={168}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#0c0b0a"
                  includeMargin={false}
                />
              </div>
              <p className="mt-4 text-[10px] font-semibold tracking-[0.24em] text-amber uppercase">
                {t('reserveRef')}
              </p>
              <p className="boarding-pass__ref">{refId}</p>
              <p className="mx-auto mt-3 max-w-[16rem] text-center text-xs leading-relaxed text-muted">
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

            <div className="grid gap-3 sm:grid-cols-2">
              {booking && (
                <button
                  type="button"
                  onClick={() => downloadIcs(booking)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3.5 text-sm font-semibold text-ink transition hover:border-ink"
                >
                  <CalendarPlus className="size-4" strokeWidth={1.7} />
                  {t('reserveAddCalendar')}
                </button>
              )}
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
