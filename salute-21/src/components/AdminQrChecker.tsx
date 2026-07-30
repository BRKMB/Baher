import { useEffect, useRef, useState } from 'react'
import { CalendarDays, CheckCircle2, Clock3, ScanLine, Users, XCircle } from 'lucide-react'
import { formatGuestName, getBooking, type Booking } from '../lib/booking'
import type { Html5Qrcode } from 'html5-qrcode'

function extractBookingId(raw: string) {
  const text = String(raw || '').trim()
  if (!text) return ''
  // Direct reference
  const direct = text.toUpperCase().match(/S21-[A-Z0-9]{6}-\d{4}/)
  if (direct) return direct[0]
  // URL ending with /reserve/success/S21-...
  try {
    const url = new URL(text)
    const parts = url.pathname.split('/').filter(Boolean)
    const last = parts[parts.length - 1] || ''
    const fromPath = last.toUpperCase().match(/S21-[A-Z0-9]{6}-\d{4}/)
    if (fromPath) return fromPath[0]
  } catch {
    /* not a URL */
  }
  return text.toUpperCase()
}

/** Editable tail after fixed `S21-` → `XXXXXX-XXXX` (auto dash + uppercase). */
function formatReferenceTail(raw: string) {
  const chars = String(raw || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10)
  if (chars.length <= 6) return chars
  return `${chars.slice(0, 6)}-${chars.slice(6)}`
}

function fullReferenceFromTail(tail: string) {
  const formatted = formatReferenceTail(tail)
  return formatted ? `S21-${formatted}` : 'S21-'
}

function formatDate(value: string) {
  try {
    return new Date(`${value}T12:00:00`).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

type CheckState =
  | { status: 'idle' }
  | { status: 'loading'; ref: string }
  | { status: 'valid'; booking: Booking }
  | { status: 'invalid'; ref: string; message: string }

export function AdminQrChecker() {
  const [scanning, setScanning] = useState(false)
  const [manual, setManual] = useState('')
  const [check, setCheck] = useState<CheckState>({ status: 'idle' })
  const [camError, setCamError] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const lastScanRef = useRef('')
  const regionId = 'admin-qr-reader'

  const lookup = async (raw: string) => {
    const ref = extractBookingId(raw)
    if (!ref) return
    if (lastScanRef.current === ref && check.status === 'valid') return
    lastScanRef.current = ref
    setCheck({ status: 'loading', ref })
    try {
      const booking = await getBooking(ref)
      if (!booking) {
        setCheck({
          status: 'invalid',
          ref,
          message: 'No reservation found for this code.',
        })
        return
      }
      setCheck({ status: 'valid', booking })
    } catch {
      setCheck({
        status: 'invalid',
        ref,
        message: 'Could not verify this code. Try again.',
      })
    }
  }

  const stopScanner = async () => {
    const scanner = scannerRef.current
    scannerRef.current = null
    setScanning(false)
    if (!scanner) return
    try {
      if (scanner.isScanning) await scanner.stop()
    } catch {
      /* ignore */
    }
    try {
      await scanner.clear()
    } catch {
      /* ignore */
    }
  }

  const startScanner = async () => {
    setCamError('')
    await stopScanner()
    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
      const scanner = new Html5Qrcode(regionId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      })
      scannerRef.current = scanner
      setScanning(true)
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 8, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
        (decoded) => {
          void lookup(decoded)
        },
        () => {
          /* frame miss */
        },
      )
    } catch (err) {
      setScanning(false)
      scannerRef.current = null
      setCamError(
        err instanceof Error
          ? err.message
          : 'Camera unavailable. Enter the reference manually below.',
      )
    }
  }

  useEffect(() => {
    return () => {
      void stopScanner()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="admin-qr">
      <div className="admin-qr__intro">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-amber uppercase">
          Door check
        </p>
        <h2 className="mt-2 font-display text-3xl text-ink italic">QR Code Checker</h2>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Scan the guest pass QR. If the reservation is valid, the host sees the guest title &
          name, party size, date and time instantly.
        </p>
      </div>

      <div className="admin-qr__grid">
        <section className="admin-qr__camera">
          <div id={regionId} className="admin-qr__viewport" />
          <div className="mt-4 flex flex-wrap gap-2">
            {!scanning ? (
              <button type="button" className="admin-btn admin-btn--solid" onClick={() => void startScanner()}>
                <ScanLine className="size-4" />
                Start camera
              </button>
            ) : (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => void stopScanner()}>
                Stop camera
              </button>
            )}
          </div>
          {camError && <p className="mt-3 text-sm text-red-800">{camError}</p>}

          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault()
              void lookup(fullReferenceFromTail(manual))
            }}
          >
            <label className="grid gap-2 text-sm">
              <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                Or enter reference
              </span>
              <div className="admin-ref-input">
                <span className="admin-ref-input__prefix" aria-hidden>
                  S21-
                </span>
                <input
                  value={manual}
                  onChange={(e) => setManual(formatReferenceTail(e.target.value))}
                  className="admin-ref-input__field"
                  placeholder="XXXXXX-XXXX"
                  inputMode="text"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={11}
                  aria-label="Booking reference after S21-"
                />
              </div>
            </label>
            <button type="submit" className="admin-btn admin-btn--ghost mt-3">
              Check reference
            </button>
          </form>
        </section>

        <section className="admin-qr__result" aria-live="polite">
          {check.status === 'idle' && (
            <div className="admin-qr__empty">
              <ScanLine className="size-8 text-amber/70" />
              <p>Waiting for a scan…</p>
            </div>
          )}

          {check.status === 'loading' && (
            <div className="admin-qr__empty">
              <p>Checking {check.ref}…</p>
            </div>
          )}

          {check.status === 'invalid' && (
            <div className="admin-qr__card is-invalid">
              <div className="admin-qr__status">
                <XCircle className="size-6" />
                <span>Not reserved</span>
              </div>
              <p className="mt-3 text-sm text-muted">{check.message}</p>
              <p className="mt-2 font-mono text-xs tracking-wide text-amber-deep">{check.ref}</p>
            </div>
          )}

          {check.status === 'valid' && (
            <div className="admin-qr__card is-valid">
              <div className="admin-qr__status">
                <CheckCircle2 className="size-6" />
                <span>Reserved — seat the guest</span>
              </div>

              <p className="admin-qr__guest-name">
                {formatGuestName(check.booking, check.booking.lang)}
              </p>

              <div className="admin-qr__highlights">
                <div>
                  <p className="admin-qr__k">
                    <Users className="size-3.5" /> Guests
                  </p>
                  <p className="admin-qr__v admin-qr__v--xl">{check.booking.guests}</p>
                </div>
                <div>
                  <p className="admin-qr__k">
                    <Clock3 className="size-3.5" /> Time
                  </p>
                  <p className="admin-qr__v admin-qr__v--xl">{check.booking.time}</p>
                </div>
                <div className="admin-qr__highlights-date">
                  <p className="admin-qr__k">
                    <CalendarDays className="size-3.5" /> Date
                  </p>
                  <p className="admin-qr__v">{formatDate(check.booking.date)}</p>
                </div>
              </div>

              <dl className="admin-qr__meta">
                <div>
                  <dt>Phone</dt>
                  <dd>{check.booking.phone}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{check.booking.email}</dd>
                </div>
                <div>
                  <dt>Reference</dt>
                  <dd>
                    <code>{check.booking.id}</code>
                  </dd>
                </div>
                {(check.booking.occasion || check.booking.notes) && (
                  <div>
                    <dt>Notes</dt>
                    <dd>{[check.booking.occasion, check.booking.notes].filter(Boolean).join(' — ')}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
