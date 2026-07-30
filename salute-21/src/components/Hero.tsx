import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { useI18n } from '../i18n/LanguageContext'
import { BrandLogo } from './BrandLogo'
import { EgyptMotif } from './EgyptMotif'

export function Hero() {
  const { t, lang } = useI18n()

  return (
    <section className="relative min-h-[100svh] overflow-hidden grain">
      <div className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="Salute 21"
          className="h-full w-full scale-[1.02] object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/50" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24 lg:justify-center">
        <motion.div
          key={lang}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-white"
        >
          <BrandLogo tone="light" className="mb-7 text-[3.4rem] drop-shadow-md md:text-[4.6rem]" />
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <p className="text-[11px] font-semibold tracking-[0.32em] text-gold uppercase md:text-xs">
              {t('brandTag')} · @salute__21
            </p>
          </div>
          <h1 className="font-display text-[clamp(2.8rem,8vw,5.8rem)] leading-[0.94] tracking-[-0.02em] text-balance text-white">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 md:text-lg">
            {t('heroSubtitle')}
          </p>
          <EgyptMotif className="mt-6 max-w-md text-gold/80" />

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/reserve"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold tracking-wide text-ink transition hover:bg-champagne"
            >
              {t('reserveCta')}
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </Link>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-ink/35 px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:border-white hover:bg-white/15"
            >
              <BookOpen className="size-4" strokeWidth={1.75} />
              {t('menuCta')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
