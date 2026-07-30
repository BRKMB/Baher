import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCw, Search } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { listBookings, type Booking } from '../lib/booking'

const KEY_STORAGE = 'salute21-admin-key'

export function AdminBookingsPage() {
  const [key, setKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || '')
  const [draftKey, setDraftKey] = useState(key)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

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

  const upcoming = filtered.filter((b) => b.date >= new Date().toISOString().slice(0, 10))
  const past = filtered.filter((b) => b.date < new Date().toISOString().slice(0, 10))

  return (
    <div className="min-h-screen">
      <Header variant="page" />
      <main className="px-4 pb-20 pt-24 sm:px-5 md:px-8 md:pb-28 md:pt-32">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>

          <p className="text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">Staff</p>
          <h1 className="mt-2 font-display text-4xl text-ink italic md:text-5xl">Bookings</h1>
          <div className="luxury-rule my-5 max-w-xs" />
          <p className="max-w-xl text-sm text-muted">
            Private list of reservations stored in Cloudflare KV. Enter the admin key to unlock.
          </p>

          {!key ? (
            <form onSubmit={onUnlock} className="mt-10 max-w-md space-y-4">
              <label className="grid gap-2 text-sm">
                <span className="text-[11px] font-semibold tracking-[0.18em] text-muted uppercase">
                  Admin key
                </span>
                <input
                  type="password"
                  value={draftKey}
                  onChange={(e) => setDraftKey(e.target.value)}
                  className="field-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </label>
              {error && <p className="text-sm text-red-800">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading ? 'Opening…' : 'Open bookings'}
              </button>
            </form>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-md flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="field-input pl-7"
                    placeholder="Search name, phone, ref…"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void load(key)}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink transition hover:border-ink"
                  >
                    <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem(KEY_STORAGE)
                      setKey('')
                      setDraftKey('')
                      setBookings([])
                    }}
                    className="rounded-full border border-line px-4 py-2.5 text-sm font-medium text-muted transition hover:border-ink hover:text-ink"
                  >
                    Lock
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-800">{error}</p>}

              <p className="text-sm text-muted">
                {filtered.length} booking{filtered.length === 1 ? '' : 's'}
                {query ? ' matched' : ''} · {upcoming.length} upcoming
              </p>

              <BookingGroup title="Upcoming" items={upcoming} />
              <BookingGroup title="Past" items={past} />

              {filtered.length === 0 && !loading && (
                <p className="border-l-2 border-amber/40 bg-champagne/40 px-4 py-3 text-sm text-muted">
                  No bookings yet.
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function BookingGroup({ title, items }: { title: string; items: Booking[] }) {
  if (items.length === 0) return null
  return (
    <section>
      <h2 className="font-display text-2xl text-ink italic">{title}</h2>
      <ul className="mt-4 divide-y divide-line/70 border-y border-line/70">
        {items.map((b, i) => (
          <motion.li
            key={b.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3) }}
            className="grid gap-2 py-4 sm:grid-cols-[7.5rem_1fr_auto] sm:items-start sm:gap-6"
          >
            <div>
              <p className="font-display text-xl text-ink">{b.time}</p>
              <p className="text-xs text-muted">{b.date}</p>
            </div>
            <div>
              <p className="font-medium text-ink">
                {b.name}{' '}
                <span className="font-normal text-muted">
                  · {b.guests} guest{b.guests === 1 ? '' : 's'}
                </span>
              </p>
              <p className="mt-1 text-sm text-muted">
                {b.phone} · {b.email}
              </p>
              {(b.occasion || b.notes) && (
                <p className="mt-1 text-sm text-ink/70">
                  {[b.occasion, b.notes].filter(Boolean).join(' — ')}
                </p>
              )}
            </div>
            <p className="font-mono text-xs tracking-wide text-amber sm:text-right">{b.id}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
