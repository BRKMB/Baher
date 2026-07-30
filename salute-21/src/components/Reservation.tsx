import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, Check, Users } from 'lucide-react'
import { brand } from '../data/content'

export function Reservation() {
  const [sent, setSent] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <section id="rezerwacja" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
        >
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-amber uppercase">
            Rezerwacja
          </p>
          <h2 className="font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl text-balance">
            Zarezerwuj stolik
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Wieczory bywają pełne — szczególnie w piątki i soboty. Napisz do nas lub zadzwoń, a
            znajdziemy miejsce przy barze albo przy stole.
          </p>
          <div className="mt-8 space-y-4 text-sm text-ink/80">
            <p className="inline-flex items-center gap-3">
              <CalendarDays className="size-4 text-amber" />
              Lunch w tygodniu · śniadania w weekend
            </p>
            <p className="inline-flex items-center gap-3">
              <Users className="size-4 text-amber" />
              Eventy i grupy: napisz na {brand.email}
            </p>
          </div>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="rounded-[1.5rem] border border-line bg-paper/70 p-6 shadow-[0_20px_60px_rgba(17,17,17,0.06)] md:p-8"
        >
          {sent ? (
            <div className="flex min-h-[280px] flex-col items-start justify-center gap-4">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-olive text-paper">
                <Check className="size-5" />
              </span>
              <h3 className="font-display text-3xl text-ink">Dziękujemy</h3>
              <p className="max-w-md text-muted">
                Twoja prośba o rezerwację została zapisana. Skontaktujemy się, aby potwierdzić
                stolik — albo napisz od razu na Instagramie {brand.instagramHandle}.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm sm:col-span-1">
                <span className="font-medium text-ink/80">Imię</span>
                <input
                  required
                  name="name"
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                  placeholder="Twoje imię"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-ink/80">Telefon</span>
                <input
                  required
                  name="phone"
                  type="tel"
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                  placeholder="+48 ..."
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-ink/80">Data</span>
                <input
                  required
                  name="date"
                  type="date"
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-ink/80">Godzina</span>
                <input
                  required
                  name="time"
                  type="time"
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="font-medium text-ink/80">Liczba gości</span>
                <input
                  required
                  name="guests"
                  type="number"
                  min={1}
                  max={20}
                  defaultValue={2}
                  className="rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                />
              </label>
              <label className="grid gap-2 text-sm sm:col-span-2">
                <span className="font-medium text-ink/80">Wiadomość</span>
                <textarea
                  name="message"
                  rows={3}
                  className="resize-none rounded-xl border border-line bg-paper px-4 py-3 outline-none transition focus:border-amber"
                  placeholder="Preferencje, okazja, alergie..."
                />
              </label>
              <button
                type="submit"
                className="sm:col-span-2 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition hover:bg-ink-soft"
              >
                Wyślij prośbę o rezerwację
              </button>
            </div>
          )}
        </motion.form>
      </div>
    </section>
  )
}
