import { motion } from 'framer-motion'
import { Leaf, Sparkles, Users } from 'lucide-react'
import { useI18n } from '../i18n/LanguageContext'

const values = [
  { icon: Sparkles, title: 'value1Title' as const, text: 'value1Text' as const },
  { icon: Leaf, title: 'value2Title' as const, text: 'value2Text' as const },
  { icon: Users, title: 'value3Title' as const, text: 'value3Text' as const },
]

export function About() {
  const { t, lang } = useI18n()

  return (
    <section id="o-nas" className="relative px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <motion.div
          key={lang + '-about'}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
            {t('aboutEyebrow')}
          </p>
          <h2 className="font-display text-4xl leading-tight tracking-[-0.02em] text-ink md:text-5xl text-balance">
            {t('aboutTitle')}
          </h2>
          <div className="luxury-rule my-6 max-w-xs" />
          <div className="space-y-4 text-base leading-relaxed text-muted md:text-lg">
            <p>{t('aboutP1')}</p>
            <p>{t('aboutP2')}</p>
            <p className="font-medium text-ink">{t('aboutP3')}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[1.5rem] gold-border">
            <img
              src="/images/about-dining.jpg"
              alt="Salute 21"
              className="aspect-[4/5] w-full object-cover md:aspect-[5/6]"
            />
          </div>
          <div className="absolute -bottom-5 -left-3 max-w-[250px] rounded-2xl bg-ink px-5 py-4 text-white shadow-xl md:-left-6">
            <p className="font-script text-3xl leading-none text-white">Saluté 21</p>
            <p className="mt-2 text-sm text-white/80">{t('aboutCard')}</p>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-20 grid max-w-7xl gap-6 md:grid-cols-3">
        {values.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="border-t border-line pt-6"
            >
              <Icon className="mb-4 size-5 text-amber-deep" strokeWidth={1.75} />
              <h3 className="font-display text-2xl text-ink">{t(item.title)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">{t(item.text)}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
