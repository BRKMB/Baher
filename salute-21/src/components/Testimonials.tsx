import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { useI18n } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

const testimonials: Array<{
  name: string
  roleKey: TranslationKey
  quoteKey: TranslationKey
}> = [
  {
    name: 'Aleksandra Nowak',
    roleKey: 'testi1Role',
    quoteKey: 'testi1Quote',
  },
  {
    name: 'Magdalena Wiśniewska',
    roleKey: 'testi2Role',
    quoteKey: 'testi2Quote',
  },
  {
    name: 'Karolina Zielińska',
    roleKey: 'testi3Role',
    quoteKey: 'testi3Quote',
  },
  {
    name: 'Piotr Kowalski',
    roleKey: 'testi4Role',
    quoteKey: 'testi4Quote',
  },
  {
    name: 'Tomasz Lewandowski',
    roleKey: 'testi5Role',
    quoteKey: 'testi5Quote',
  },
  {
    name: 'Michał Kamiński',
    roleKey: 'testi6Role',
    quoteKey: 'testi6Quote',
  },
]

export function Testimonials() {
  const { t, lang } = useI18n()

  return (
    <section id="opinie" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
            {t('testimonialsEyebrow')}
          </p>
          <h2 className="font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl">
            {t('testimonialsTitle')}
          </h2>
          <div className="luxury-rule mx-auto my-6 max-w-xs" />
          <p className="text-base leading-relaxed text-muted">{t('testimonialsIntro')}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className="flex h-full flex-col rounded-[1.35rem] border border-line bg-white/70 p-6 shadow-[0_18px_40px_rgba(12,11,10,0.04)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <Quote className="size-7 text-amber" strokeWidth={1.5} />
                <div className="flex gap-0.5" aria-label="5/5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5 fill-amber text-amber"
                      strokeWidth={0}
                    />
                  ))}
                </div>
              </div>
              <p
                key={lang + item.quoteKey}
                className="flex-1 font-display text-[1.35rem] leading-snug text-ink"
              >
                “{t(item.quoteKey)}”
              </p>
              <div className="mt-6 border-t border-line pt-4">
                <p className="text-sm font-semibold tracking-wide text-ink">{item.name}</p>
                <p className="mt-1 text-xs font-medium tracking-[0.14em] text-amber uppercase">
                  {t(item.roleKey)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
