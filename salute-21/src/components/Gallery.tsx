import { motion } from 'framer-motion'
import { brand, gallery } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'
import { InstagramIcon } from './icons'

export function Gallery() {
  const { t } = useI18n()

  return (
    <>
    <section id="galeria" className="bg-ink px-5 py-20 text-white md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
              {t('galleryEyebrow')}
            </p>
            <h2 className="font-display text-4xl tracking-[-0.02em] text-white md:text-5xl">
              {t('galleryTitle')}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
              {t('galleryText')}
            </p>
          </div>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold"
          >
            <InstagramIcon className="size-4" />
            {brand.instagramHandle}
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.slice(0, 6).map((item, index) => (
            <motion.figure
              key={item.src}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
              className="overflow-hidden rounded-2xl"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
    {/* Cream breathing room before contact card */}
    <div className="h-10 bg-transparent md:h-16" aria-hidden />
  </>
  )
}
