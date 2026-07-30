import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { highlights } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'

const copy = {
  spuntini: { title: 'highlightSpuntiniTitle', text: 'highlightSpuntiniText' },
  bar: { title: 'highlightBarTitle', text: 'highlightBarText' },
  breakfast: { title: 'highlightBreakfastTitle', text: 'highlightBreakfastText' },
} as const

export function Highlights() {
  const { t } = useI18n()

  return (
    <section className="px-5 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
              {t('highlightsEyebrow')}
            </p>
            <h2 className="font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl">
              {t('highlightsTitle')}
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink/80 transition hover:text-ink"
          >
            {t('menuCta')}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((item, index) => (
            <motion.article
              key={item.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[1.4rem]"
            >
              <img
                src={item.image}
                alt={t(copy[item.key].title)}
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
                <h3 className="font-display text-3xl">{t(copy[item.key].title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-paper/80">
                  {t(copy[item.key].text)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
