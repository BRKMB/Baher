import { motion } from 'framer-motion'
import { brand, gallery } from '../data/content'
import { InstagramIcon } from './icons'

export function Gallery() {
  return (
    <section id="galeria" className="bg-ink px-5 py-20 text-paper md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-amber uppercase">
              Galeria
            </p>
            <h2 className="font-display text-4xl tracking-[-0.02em] md:text-5xl">
              Smak, światło, stół
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-paper/70 md:text-base">
              Zdjęcia z kuchni i baru — te same klimaty, które znajdziesz na naszym Instagramie.
            </p>
          </div>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-paper/25 px-5 py-3 text-sm font-semibold transition hover:border-amber hover:text-amber"
          >
            <InstagramIcon className="size-4" />
            {brand.instagramHandle}
          </a>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {gallery.map((item, index) => (
            <motion.figure
              key={item.src}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
