import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

const testimonials: Array<{
  name: string
  roleKey: TranslationKey
  quoteKey: TranslationKey
}> = [
  { name: 'Aleksandra Nowak', roleKey: 'testi1Role', quoteKey: 'testi1Quote' },
  { name: 'Magdalena Wiśniewska', roleKey: 'testi2Role', quoteKey: 'testi2Quote' },
  { name: 'Karolina Zielińska', roleKey: 'testi3Role', quoteKey: 'testi3Quote' },
  { name: 'Piotr Kowalski', roleKey: 'testi4Role', quoteKey: 'testi4Quote' },
  { name: 'Tomasz Lewandowski', roleKey: 'testi5Role', quoteKey: 'testi5Quote' },
  { name: 'Michał Kamiński', roleKey: 'testi6Role', quoteKey: 'testi6Quote' },
]

export function Testimonials() {
  const { t } = useI18n()
  const [active, setActive] = useState(0)
  const items = testimonials.map((item) => ({
    name: item.name,
    role: t(item.roleKey),
    quote: t(item.quoteKey),
  }))
  const current = items[active]

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length)
    }, 5600)
    return () => window.clearInterval(id)
  }, [items.length])

  return (
    <section id="opinie" className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,181,106,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      <div className="relative mx-auto max-w-5xl px-5 py-24 md:px-8 md:py-32">
        <div className="text-center">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.34em] text-gold uppercase">
            {t('testimonialsEyebrow')}
          </p>
          <h2 className="font-display text-4xl tracking-[-0.02em] text-white italic md:text-5xl">
            {t('testimonialsTitle')}
          </h2>
          <div className="mx-auto my-7 h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
            {t('testimonialsIntro')}
          </p>
        </div>

        <div className="relative mx-auto mt-14 min-h-[280px] max-w-3xl md:min-h-[300px] md:mt-16">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-6 left-0 font-display text-[7rem] leading-none text-gold/20 select-none md:-top-10 md:text-[9rem]"
          >
            “
          </span>

          <AnimatePresence mode="wait">
            <motion.figure
              key={current.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative px-2 text-center md:px-8"
            >
              <blockquote className="font-display text-[1.65rem] leading-[1.35] text-balance text-white italic md:text-[2.15rem] md:leading-[1.3]">
                {current.quote}
              </blockquote>
              <figcaption className="mt-10">
                <div className="mx-auto mb-5 h-px w-10 bg-gold/50" />
                <p className="text-sm font-semibold tracking-wide text-white">{current.name}</p>
                <p className="mt-2 text-[11px] font-medium tracking-[0.22em] text-gold uppercase">
                  {current.role}
                </p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 md:mt-14">
          {items.map((item, index) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setActive(index)}
              aria-label={item.name}
              aria-current={index === active}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === active
                  ? 'w-8 bg-gold'
                  : 'w-1.5 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>

        <div className="mt-16 overflow-hidden border-t border-white/10 pt-8">
          <div className="testimonial-names flex w-max gap-10 whitespace-nowrap px-4 text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">
            {[...items, ...items].map((item, i) => (
              <button
                key={`${item.name}-strip-${i}`}
                type="button"
                onClick={() => setActive(i % items.length)}
                className={`transition hover:text-gold ${
                  i % items.length === active ? 'text-gold' : ''
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
