import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { brand } from '../data/content'

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden grain">
      <div className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="Salute 21 — kuchnia i atmosfera"
          className="h-full w-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/55 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-20 lg:justify-center lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-paper"
        >
          <img
            src="/images/logo.png"
            alt="Salute!"
            className="mb-6 h-14 w-auto brightness-0 invert md:h-20"
          />
          <p className="mb-4 text-xs font-semibold tracking-[0.28em] text-amber uppercase md:text-sm">
            Warszawa · Wola · {brand.instagramHandle}
          </p>
          <h1 className="font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.95] tracking-[-0.02em] text-balance">
            Najważniejsze święto jest na co dzień
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/85 md:text-lg">
            {brand.description} Bar, w którym picie nierozerwalnie łączy się z jedzeniem.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-amber-deep hover:text-paper"
            >
              Zobacz menu
              <ArrowDownRight className="size-4" strokeWidth={2} />
            </a>
            <a
              href="#rezerwacja"
              className="inline-flex items-center gap-2 rounded-full border border-paper/35 px-6 py-3.5 text-sm font-semibold text-paper transition hover:border-paper hover:bg-paper/10"
            >
              Zarezerwuj stolik
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
