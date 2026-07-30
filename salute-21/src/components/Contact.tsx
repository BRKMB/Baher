import { motion } from 'framer-motion'
import { Clock3, Mail, MapPin, Phone } from 'lucide-react'
import { brand, hours } from '../data/content'
import { InstagramIcon } from './icons'

export function Contact() {
  return (
    <section id="kontakt" className="px-5 pb-20 md:px-8 md:pb-28">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.8rem] bg-ink text-paper">
        <div className="grid lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12"
          >
            <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-amber uppercase">
              Kontakt
            </p>
            <h2 className="font-display text-4xl tracking-[-0.02em] md:text-5xl">Odwiedź nas</h2>
            <p className="mt-4 max-w-md text-paper/70">
              Salute 21 · Wola, Warszawa. Napisz, zadzwoń albo wpadnij bez zapowiedzi — przy barze
              zawsze znajdzie się miejsce na jedno spuntini i kieliszek.
            </p>

            <div className="mt-10 space-y-5 text-sm md:text-base">
              <a
                href={brand.address.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition hover:text-amber"
              >
                <MapPin className="mt-0.5 size-5 shrink-0 text-amber" />
                <span>
                  {brand.address.street}
                  <br />
                  {brand.address.district}, {brand.address.city}
                </span>
              </a>
              <a
                href={brand.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition hover:text-amber"
              >
                <Phone className="size-5 shrink-0 text-amber" />
                Rezerwacje: napisz na Instagramie
              </a>
              <a
                href={`mailto:${brand.email}`}
                className="flex items-center gap-3 transition hover:text-amber"
              >
                <Mail className="size-5 shrink-0 text-amber" />
                {brand.email}
              </a>
              <a
                href={brand.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition hover:text-amber"
              >
                <InstagramIcon className="size-5 shrink-0 text-amber" />
                {brand.instagramHandle}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="border-t border-paper/10 p-8 md:p-12 lg:border-t-0 lg:border-l"
          >
            <div className="mb-6 flex items-center gap-2 text-amber">
              <Clock3 className="size-5" />
              <h3 className="font-display text-2xl text-paper">Godziny otwarcia</h3>
            </div>
            <ul className="space-y-5">
              {hours.map((row) => (
                <li
                  key={row.day}
                  className="grid gap-1 border-b border-paper/10 pb-4 last:border-0 last:pb-0 sm:grid-cols-[1.2fr_0.8fr] sm:items-start"
                >
                  <div>
                    <p className="font-medium">{row.day}</p>
                    <p className="text-sm text-paper/55">{row.note}</p>
                  </div>
                  <p className="font-display text-xl sm:text-right">{row.time}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-paper/10">
          <iframe
            title="Mapa Salute 21 Warszawa"
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
