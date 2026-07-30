import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menu } from '../data/content'

export function MenuSection() {
  const [active, setActive] = useState(menu[0].id)
  const category = useMemo(
    () => menu.find((item) => item.id === active) ?? menu[0],
    [active],
  )

  return (
    <section id="menu" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-amber uppercase">
            Menu
          </p>
          <h2 className="font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl">
            Karta Salute 21
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Spuntini to niewielkie przekąski — rekomendujemy 3–4 na osobę. Kuchnię zamykamy godzinę
            przed zamknięciem baru. v — wegańskie, w — wegetariańskie.
          </p>
        </div>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menu.map((cat) => {
            const isActive = cat.id === active
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-ink text-paper'
                    : 'border border-line bg-paper/60 text-ink/70 hover:border-ink/40 hover:text-ink'
                }`}
              >
                {cat.title}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-6">
              <h3 className="font-display text-3xl text-ink">{category.title}</h3>
              <p className="mt-1 text-sm text-muted">{category.subtitle}</p>
            </div>

            <ul className="divide-y divide-line border-y border-line">
              {category.items.map((item) => (
                <li
                  key={item.name}
                  className="grid grid-cols-[1fr_auto] gap-4 py-5 md:grid-cols-[1.4fr_2fr_auto] md:gap-8"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-semibold text-ink md:text-lg">{item.name}</h4>
                      {item.tags?.includes('v') && (
                        <span className="rounded-full border border-olive/30 px-2 py-0.5 text-[10px] font-bold tracking-wider text-olive uppercase">
                          vegan
                        </span>
                      )}
                      {item.tags?.includes('w') && (
                        <span className="rounded-full border border-amber/40 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-deep uppercase">
                          vege
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted md:hidden">{item.desc}</p>
                  </div>
                  <p className="hidden text-sm leading-relaxed text-muted md:block">{item.desc}</p>
                  <p className="font-display text-xl text-ink tabular-nums">{item.price} zł</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
