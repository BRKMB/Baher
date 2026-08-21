import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Clock3,
  Lock,
  Mail,
  Phone,
  ScanBarcode,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { AdminQrChecker } from '../components/AdminQrChecker'
import { Seo } from '../components/Seo'
import { deleteBooking, formatGuestName, listBookings, type Booking } from '../lib/booking'

const KEY_STORAGE = 'salute21-admin-key'

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDate(value: string) {
  try {
    return new Date(`${value}T12:00:00`).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return value
  }
}

export function AdminBookingsPage() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || '')
  const [draftKey, setDraftKey] = useState(key)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'upcoming' | 'past' | 'all'>('upcoming')
  const [view, setView] = useState<'bookings' | 'checker'>('bookings')
  const [deletingId, setDeletingId] = useState('')

  const load = async (adminKey: string) => {
    if (!adminKey.trim()) return
    setLoading(true)
    setError('')
    try {
      const list = await listBookings(adminKey.trim())
      setBookings(list)
      sessionStorage.setItem(KEY_STORAGE, adminKey.trim())
      setKey(adminKey.trim())
    } catch (err) {
      setBookings([])
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (key) void load(key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onUnlock = (event: FormEvent) => {
    event.preventDefault()
    void load(draftKey)
  }

  const today = todayISO()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return bookings
    return bookings.filter((b) =>
      [b.id, b.name, b.email, b.phone, b.date, b.time, b.occasion, b.notes]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [bookings, query])

  const upcoming = useMemo(
    () =>
      filtered
        .filter((b) => b.date >= today)
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)),
    [filtered, today],
  )
  const past = useMemo(
    () =>
      filtered
        .filter((b) => b.date < today)
        .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)),
    [filtered, today],
  )
  const tonight = upcoming.filter((b) => b.date === today)
  const visible = tab === 'upcoming' ? upcoming : tab === 'past' ? past : filtered

  const lock = () => {
    sessionStorage.removeItem(KEY_STORAGE)
    setKey('')
    setDraftKey('')
    setBookings([])
    setQuery('')
    setTab('upcoming')
  }

  const onDelete = async (booking: Booking) => {
    if (!key) return
    const guest = formatGuestName(booking)
    const ok = window.confirm(
      `Delete booking for ${guest}?\n\n${booking.date} · ${booking.time} · ${booking.id}\n\nThis cannot be undone.`,
    )
    if (!ok) return
    setDeletingId(booking.id)
    setError('')
    try {
      await deleteBooking(key, booking.id)
      setBookings((prev) => prev.filter((b) => b.id !== booking.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete booking')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="min-h-screen">
      <Seo page="admin" />
      <Header variant="page" />
      <main className="admin-page px-4 pb-20 pt-24 sm:px-5 md:px-8 md:pb-28 md:pt-32">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>

          <div className="admin-header">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
                Staff console
              </p>
              <h1 className="mt-2 font-display text-4xl text-ink italic md:text-5xl">
                {view === 'checker' ? 'Barcode Checker' : 'Bookings'}
              </h1>
              <div className="luxury-rule my-4 max-w-xs" />
              <p className="max-w-lg text-sm text-muted">
                {view === 'checker'
                  ? 'Scan the wide barcode on a guest pass to confirm the reservation at the door.'
                  : 'Reservations from the live booking system — search, review, and prepare the floor.'}
              </p>
            </div>
            {key ? (
              <div className="admin-iconbar" role="toolbar" aria-label="Staff actions">
                <button
                  type="button"
                  className={`admin-iconbtn ${view === 'bookings' ? 'is-active' : ''}`}
                  aria-label="Bookings"
                  title="Bookings"
                  aria-pressed={view === 'bookings'}
                  onClick={() => setView('bookings')}
                >
                  <ClipboardList className="admin-iconbtn__icon" strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  className={`admin-iconbtn ${view === 'checker' ? 'is-active' : ''}`}
                  aria-label="Barcode Checker"
                  title="Barcode Checker"
                  aria-pressed={view === 'checker'}
                  onClick={() => setView('checker')}
                >
                  <ScanBarcode className="admin-iconbtn__icon" strokeWidth={1.6} />
                </button>
                <span className="admin-iconbar__divider" aria-hidden />
                <button
                  type="button"
                  className="admin-iconbtn"
                  aria-label="Refresh"
                  title="Refresh"
                  disabled={loading}
                  onClick={() => void load(key)}
                >
                  <RefreshCw
                    className={`admin-iconbtn__icon ${loading ? 'animate-spin' : ''}`}
                    strokeWidth={1.6}
                  />
                </button>
                <button
                  type="button"
                  className="admin-iconbtn"
                  aria-label="Lock"
                  title="Lock"
                  onClick={lock}
                >
                  <Lock className="admin-iconbtn__icon" strokeWidth={1.6} />
                </button>
              </div>
            ) : null}
          </div>

          {!key ? (
            <form onSubmit={onUnlock} className="admin-unlock mt-10">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                Admin password
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="grid flex-1 gap-2 text-sm">
                  <span className="sr-only">Password</span>
                  <input
                    type="password"
                    value={draftKey}
                    onChange={(e) => setDraftKey(e.target.value)}
                    className="field-input"
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                  />
                </label>
                <button type="submit" disabled={loading} className="admin-btn admin-btn--solid">
                  {loading ? 'Opening…' : 'Unlock'}
                </button>
              </div>
              {error && <p className="mt-3 text-sm text-red-800">{error}</p>}
            </form>
          ) : (
            <div className="mt-10 space-y-8">
              {view === 'checker' ? (
                <AdminQrChecker />
              ) : (
                <>
              <div className="admin-stats">
                <Stat label="Total" value={bookings.length} />
                <Stat label="Upcoming" value={upcoming.length} accent />
                <Stat label="Today" value={tonight.length} />
                <Stat label="Past" value={past.length} />
              </div>

              <div className="admin-toolbar">
                <label className="admin-search">
                  <Search className="admin-search__icon" aria-hidden />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name, phone, reference…"
                    aria-label="Search bookings"
                  />
                </label>

                <div className="admin-tabs" role="tablist" aria-label="Booking filters">
                  {(
                    [
                      ['upcoming', `Upcoming (${upcoming.length})`],
                      ['past', `Past (${past.length})`],
                      ['all', `All (${filtered.length})`],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={tab === id}
                      onClick={() => setTab(id)}
                      className={`admin-tabs__btn ${tab === id ? 'is-active' : ''}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="border-l-2 border-red-400 bg-red-50/80 px-4 py-3 text-sm text-red-900">
                  {error}
                </p>
              )}

              {visible.length === 0 && !loading ? (
                <p className="border-l-2 border-amber/40 bg-champagne/50 px-4 py-3 text-sm text-muted">
                  No bookings in this view.
                </p>
              ) : (
                <div className="admin-list">
                  <div className="admin-list__head" aria-hidden>
                    <span>When</span>
                    <span>Guest</span>
                    <span>Party</span>
                    <span>Contact</span>
                    <span>Reference</span>
                    <span className="admin-list__head-action">Delete</span>
                  </div>
                  <ul>
                    {visible.map((b, i) => (
                      <BookingRow
                        key={b.id}
                        booking={b}
                        index={i}
                        isToday={b.date === today}
                        deleting={deletingId === b.id}
                        onDelete={() => void onDelete(b)}
                      />
                    ))}
                  </ul>
                </div>
              )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className={`admin-stat ${accent ? 'is-accent' : ''}`}>
      <p className="admin-stat__label">{label}</p>
      <p className="admin-stat__value">{value}</p>
    </div>
  )
}

function BookingRow({
  booking: b,
  index,
  isToday,
  deleting,
  onDelete,
}: {
  booking: Booking
  index: number
  isToday: boolean
  deleting: boolean
  onDelete: () => void
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.25) }}
      className={`admin-row ${isToday ? 'is-today' : ''}`}
    >
      <div className="admin-row__when">
        <p className="admin-row__time">
          <Clock3 className="size-3.5" strokeWidth={1.75} />
          {b.time}
        </p>
        <p className="admin-row__date">
          <CalendarDays className="size-3.5" strokeWidth={1.75} />
          {formatDate(b.date)}
        </p>
        {isToday ? <span className="admin-row__badge">Today</span> : null}
      </div>

      <div className="admin-row__guest">
        <p className="admin-row__name">{formatGuestName(b)}</p>
        {(b.occasion || b.notes) && (
          <p className="admin-row__note">{[b.occasion, b.notes].filter(Boolean).join(' — ')}</p>
        )}
      </div>

      <div className="admin-row__party">
        <Users className="size-3.5" strokeWidth={1.75} />
        {b.guests}
      </div>

      <div className="admin-row__contact">
        <p>
          <Phone className="size-3.5" strokeWidth={1.75} />
          <a href={`tel:${b.phone}`}>{b.phone}</a>
        </p>
        <p>
          <Mail className="size-3.5" strokeWidth={1.75} />
          <a href={`mailto:${b.email}`}>{b.email}</a>
        </p>
      </div>

      <div className="admin-row__ref">
        <code>{b.id}</code>
      </div>

      <div className="admin-row__actions">
        <button
          type="button"
          className="admin-row__delete"
          aria-label={`Delete booking ${b.id}`}
          title="Delete booking"
          disabled={deleting}
          onClick={onDelete}
        >
          <Trash2 className={`size-4 ${deleting ? 'animate-pulse' : ''}`} strokeWidth={1.75} />
        </button>
      </div>
    </motion.li>
  )
}
