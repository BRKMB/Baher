import { useEffect, useRef, useState } from 'react'
import { CalendarDays, CheckCircle2, Clock3, ImageUp, ScanLine, Users, XCircle } from 'lucide-react'
import { formatGuestName, getBooking, type Booking } from '../lib/booking'
import type { Html5Qrcode } from 'html5-qrcode'

export function extractBookingId(raw: string) {
  const text = String(raw || '').trim()
  if (!text) return ''
  const direct = text.toUpperCase().match(/S21-[A-Z0-9]{6}-\d{4}/)
  if (direct) return direct[0]
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

/** Full reference field: always `S21-XXXXXX-XXXX`, letters+digits, uppercase. */
export function formatFullReference(raw: string) {
  let alnum = String(raw || '')
    .toLocaleUpperCase('en-US')
    .replace(/[^A-Z0-9]/g, '')
  if (alnum.startsWith('S21')) alnum = alnum.slice(3)
  const body = alnum.slice(0, 10)
  if (body.length <= 6) return `S21-${body}`
  return `S21-${body.slice(0, 6)}-${body.slice(6)}`
}

/** Editable tail after fixed `S21-` → `XXXXXX-XXXX` (auto dash + uppercase). */
export function formatReferenceTail(raw: string) {
  return formatFullReference(raw).replace(/^S21-/, '')
}

export function fullReferenceFromTail(tail: string) {
  return formatFullReference(`S21-${tail}`)
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
  const [manual, setManual] = useState('S21-')
  const [check, setCheck] = useState<CheckState>({ status: 'idle' })
  const [camError, setCamError] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const lastHandledRef = useRef('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const regionId = 'admin-qr-reader'

  const lookup = async (raw: string) => {
    const ref = extractBookingId(raw)
    if (!ref || !/^S21-[A-Z0-9]{6}-\d{4}$/.test(ref)) {
      if (raw.trim()) {
        setCheck({
          status: 'invalid',
          ref: extractBookingId(raw) || raw.trim().toUpperCase(),
          message: 'This code is not a Salute 21 booking QR.',
        })
      }
      return
    }
    if (lastHandledRef.current === ref) return
    lastHandledRef.current = ref
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
      lastHandledRef.current = ''
      setCheck({
        status: 'invalid',
        ref,
        message: 'Could not verify this code. Try again.',
      })
    }
  }

  const resetResult = () => {
    lastHandledRef.current = ''
    setCheck({ status: 'idle' })
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
    resetResult()
    await stopScanner()
    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
      const scanner = new Html5Qrcode(regionId, {
        // Pass prints standard QR_CODE with booking reference payload
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
        useBarCodeDetectorIfSupported: true,
      } as ConstructorParameters<typeof Html5Qrcode>[1])
      scannerRef.current = scanner
      setScanning(true)
      await scanner.start(
        { facingMode: { exact: 'environment' } },
        {
          fps: 12,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const edge = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.78)
            return { width: edge, height: edge }
          },
          aspectRatio: 1.333,
          disableFlip: false,
        },
        (decoded) => {
          void lookup(decoded)
        },
        () => {
          /* frame miss — normal while aiming */
        },
      )
    } catch {
      // Fallback without exact rear camera constraint (desktop / iOS quirks)
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
        const scanner = new Html5Qrcode(regionId, {
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
          verbose: false,
          useBarCodeDetectorIfSupported: true,
        } as ConstructorParameters<typeof Html5Qrcode>[1])
        scannerRef.current = scanner
        setScanning(true)
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 12,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const edge = Math.floor(Math.min(viewfinderWidth, viewfinderHeight) * 0.78)
              return { width: edge, height: edge }
            },
          },
          (decoded) => {
            void lookup(decoded)
          },
          () => undefined,
        )
      } catch (err) {
        setScanning(false)
        scannerRef.current = null
        setCamError(
          err instanceof Error
            ? err.message
            : 'Camera unavailable. Use “Scan image” or enter the reference below.',
        )
      }
    }
  }

  const scanImageFile = async (file: File) => {
    setCamError('')
    resetResult()
    await stopScanner()
    try {
      const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
      const scanner = new Html5Qrcode(regionId, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      })
      const decoded = await scanner.scanFile(file, true)
      await scanner.clear()
      await lookup(decoded)
    } catch {
      setCamError('Could not read a booking QR from that image. Try a clearer photo of the pass QR.')
      setCheck({
        status: 'invalid',
        ref: file.name,
        message: 'No QR code detected in the image.',
      })
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
          Point the camera at the QR on the guest pass. It reads standard QR codes encoding the
          booking reference (S21-••••••-••••).
        </p>
      </div>

      <div className="admin-qr__grid">
        <section className="admin-qr__camera">
          <div id={regionId} className="admin-qr__viewport" />
          <div className="mt-4 flex flex-wrap gap-2">
            {!scanning ? (
              <button
                type="button"
                className="admin-btn admin-btn--solid"
                onClick={() => void startScanner()}
              >
                <ScanLine className="size-4" />
                Start camera
              </button>
            ) : (
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={() => void stopScanner()}
              >
                Stop camera
              </button>
            )}
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageUp className="size-4" />
              Scan image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void scanImageFile(file)
                e.target.value = ''
              }}
            />
          </div>
          {camError && <p className="mt-3 text-sm text-red-800">{camError}</p>}

          <form
            className="mt-5"
            onSubmit={(e) => {
              e.preventDefault()
              lastHandledRef.current = ''
              void lookup(formatFullReference(manual))
            }}
          >
            <label className="grid gap-2 text-sm">
              <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                Or enter reference
              </span>
              <input
                type="text"
                lang="en"
                value={manual}
                onChange={(e) => setManual(formatFullReference(e.target.value))}
                onKeyDown={(e) => {
                  const el = e.currentTarget
                  const start = el.selectionStart ?? 0
                  const end = el.selectionEnd ?? 0
                  // Keep the fixed S21- prefix
                  if (
                    (e.key === 'Backspace' && start <= 4 && end <= 4) ||
                    (e.key === 'Delete' && start < 4)
                  ) {
                    e.preventDefault()
                    el.setSelectionRange(4, 4)
                  }
                }}
                onClick={(e) => {
                  const el = e.currentTarget
                  if ((el.selectionStart ?? 0) < 4) el.setSelectionRange(4, 4)
                }}
                onFocus={(e) => {
                  const el = e.currentTarget
                  if ((el.selectionStart ?? 0) < 4) {
                    requestAnimationFrame(() => el.setSelectionRange(Math.max(4, el.value.length), Math.max(4, el.value.length)))
                  }
                }}
                className="field-input admin-ref-input__full"
                placeholder="S21-7L1R9S-0726"
                inputMode="text"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={15}
                aria-label="Booking reference"
              />
              <span className="text-xs text-muted">
                Letters and numbers — e.g. S21-7L1R9S-0726
              </span>
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
              <button type="button" className="admin-btn admin-btn--ghost mt-4" onClick={resetResult}>
                Scan again
              </button>
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
                    <dd>
                      {[check.booking.occasion, check.booking.notes].filter(Boolean).join(' — ')}
                    </dd>
                  </div>
                )}
              </dl>

              <button
                type="button"
                className="admin-btn admin-btn--ghost mt-5"
                onClick={resetResult}
              >
                Scan next guest
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
