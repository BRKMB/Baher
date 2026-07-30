import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { brand } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'
import { InstagramIcon } from './icons'

export function Contact() {
  const { t } = useI18n()

  const hours = [
    { day: t('dayMonThu'), time: '12:00 – 22:00', note: t('hoursNoteLunch') },
    { day: t('dayFri'), time: '12:00 – 24:00', note: t('hoursNoteLunch') },
    { day: t('daySat'), time: '10:00 – 24:00', note: t('hoursNoteBreakfast') },
    { day: t('daySun'), time: '10:00 – 22:00', note: t('hoursNoteBreakfast') },
  ]

  return (
    <section id="kontakt" className="px-5 pb-20 md:px-8 md:pb-28">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.8rem] bg-ink text-white">
        <div className="grid lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12"
          >
            <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
              {t('contactEyebrow')}
            </p>
            <h2 className="font-display text-4xl tracking-[-0.02em] md:text-5xl text-white">
              {t('contactTitle')}
            </h2>
            <p className="mt-4 max-w-md text-white/80">{t('contactText')}</p>

            <div className="mt-10 space-y-5 text-sm text-white md:text-base">
              <a
                href={brand.address.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition hover:text-gold"
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
                <span>
                  {brand.address.street}
                  <br />
                  {brand.address.district}, {brand.address.city}
                </span>
              </a>
              <Link to="/reserve" className="flex items-center gap-3 transition hover:text-gold">
                <Phone className="size-5 shrink-0 text-gold" />
                {t('reserveCta')}
              </Link>
              <a
                href={`mailto:${brand.email}`}
                className="flex items-center gap-3 transition hover:text-gold"
              >
                <Mail className="size-5 shrink-0 text-gold" />
                {brand.email}
              </a>
              <a
                href={brand.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition hover:text-gold"
              >
                <InstagramIcon className="size-5 shrink-0 text-gold" />
                {brand.instagramHandle}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="border-t border-white/15 p-8 md:p-12 lg:border-t-0 lg:border-l"
          >
            <div className="mb-6 flex items-center gap-2 text-gold">
              <Clock3 className="size-5" />
              <h3 className="font-display text-2xl text-white">{t('hoursTitle')}</h3>
            </div>
            <ul className="space-y-5 text-white">
              {hours.map((row) => (
                <li
                  key={row.day}
                  className="grid gap-1 border-b border-white/15 pb-4 last:border-0 last:pb-0 sm:grid-cols-[1.2fr_0.8fr] sm:items-start"
                >
                  <div>
                    <p className="font-medium">{row.day}</p>
                    <p className="text-sm text-white/65">{row.note}</p>
                  </div>
                  <p className="font-display text-xl sm:text-right">{row.time}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-paper/10">
          <iframe
            title="Salute 21 map"
            src="https://maps.google.com/maps?q=Marcina%20Kasprzaka%2024A%2C%20Warszawa&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="h-64 w-full grayscale invert-[0.92] contrast-125 md:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
