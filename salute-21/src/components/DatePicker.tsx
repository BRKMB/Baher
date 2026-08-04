import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatLocalDate } from '../lib/booking'
import { useI18n } from '../i18n/LanguageContext'

type DatePickerProps = {
  value: string
  min: string
  max: string
  onChange: (value: string) => void
  required?: boolean
  id?: string
}

function parseYmd(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const d = new Date(`${value}T12:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12)
}

function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1, 12)
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function DatePicker({ value, min, max, onChange, required, id }: DatePickerProps) {
  const { lang, t } = useI18n()
  const locale = lang === 'pl' ? 'pl-PL' : 'en-GB'
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = parseYmd(value)
  const minDate = parseYmd(min)
  const maxDate = parseYmd(max)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => startOfMonth(selected ?? minDate ?? new Date()))

  useEffect(() => {
    if (selected) setView(startOfMonth(selected))
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent | TouchEvent) => {
      const el = rootRef.current
      if (!el) return
      if (event.target instanceof Node && !el.contains(event.target)) {
        setOpen(false)
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const weekdays = useMemo(() => {
    const base = new Date(2024, 0, 1) // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      return d.toLocaleDateString(locale, { weekday: 'short' }).replace(/\.$/, '')
    })
  }, [locale])

  const monthLabel = view.toLocaleDateString(locale, { month: 'long', year: 'numeric' })

  const displayValue = selected
    ? selected.toLocaleDateString(locale, {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : t('reservePickDate')

  const days = useMemo(() => {
    const first = startOfMonth(view)
    // Monday-based calendar
    const mondayOffset = (first.getDay() + 6) % 7
    const gridStart = new Date(first)
    gridStart.setDate(first.getDate() - mondayOffset)
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart)
      d.setDate(gridStart.getDate() + i)
      return d
    })
  }, [view])

  const canPrev = !minDate || addMonths(view, -1) >= startOfMonth(minDate)
  const canNext = !maxDate || addMonths(view, 1) <= startOfMonth(maxDate)

  const isDisabled = (d: Date) => {
    const ymd = formatLocalDate(d)
    if (min && ymd < min) return true
    if (max && ymd > max) return true
    return false
  }

  const pick = (d: Date) => {
    if (isDisabled(d)) return
    onChange(formatLocalDate(d))
    setOpen(false)
  }

  const today = parseYmd(formatLocalDate(new Date()))

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" id={id} value={value} required={required} readOnly />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="date-picker__trigger group"
      >
        <span className={`min-w-0 flex-1 truncate text-left ${selected ? 'text-ink' : 'text-muted/70'}`}>
          {displayValue}
        </span>
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line/80 bg-champagne/80 text-amber transition group-hover:border-ink/40">
          <CalendarDays className="size-4" strokeWidth={1.6} />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={t('reserveDate')}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="date-picker__panel"
          >
            <div className="flex items-center justify-between gap-3 px-1 pb-4">
              <button
                type="button"
                disabled={!canPrev}
                onClick={() => setView((v) => addMonths(v, -1))}
                className="date-picker__nav"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" strokeWidth={1.7} />
              </button>
              <p className="font-display text-xl tracking-wide text-ink capitalize italic">{monthLabel}</p>
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setView((v) => addMonths(v, 1))}
                className="date-picker__nav"
                aria-label="Next month"
              >
                <ChevronRight className="size-4" strokeWidth={1.7} />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {weekdays.map((day) => (
                <span
                  key={day}
                  className="py-1 text-center text-[10px] font-semibold tracking-[0.14em] text-muted/70 uppercase"
                >
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((d) => {
                const inMonth = d.getMonth() === view.getMonth()
                const disabled = isDisabled(d)
                const isSelected = selected ? sameDay(d, selected) : false
                const isToday = today ? sameDay(d, today) : false
                return (
                  <button
                    key={formatLocalDate(d)}
                    type="button"
                    disabled={disabled}
                    onClick={() => pick(d)}
                    className={[
                      'date-picker__day',
                      !inMonth ? 'is-outside' : '',
                      isSelected ? 'is-selected' : '',
                      isToday && !isSelected ? 'is-today' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
              <button
                type="button"
                className="text-xs font-semibold tracking-[0.16em] text-muted uppercase transition hover:text-ink"
                onClick={() => setOpen(false)}
              >
                {t('reserveClose')}
              </button>
              {today && !isDisabled(today) && (
                <button
                  type="button"
                  className="text-xs font-semibold tracking-[0.16em] text-amber uppercase transition hover:text-ink"
                  onClick={() => pick(today)}
                >
                  {t('reserveToday')}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
