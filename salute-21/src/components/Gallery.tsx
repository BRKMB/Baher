import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { brand, gallery as fallbackGallery } from '../data/content'
import { fetchInstagramFeed, type IgFeedItem } from '../lib/instagram'
import { useI18n } from '../i18n/LanguageContext'
import { InstagramIcon } from './icons'

type Tile =
  | { kind: 'ig'; item: IgFeedItem }
  | { kind: 'fallback'; src: string; alt: string; href: string }

function toFallbackTiles(): Tile[] {
  const items = fallbackGallery.slice(0, 6)
  const n = Math.floor(items.length / 3) * 3
  return items.slice(0, n).map((item) => ({
    kind: 'fallback' as const,
    src: item.src,
    alt: item.alt,
    href: brand.instagram,
  }))
}

export function Gallery() {
  const { t } = useI18n()
  const [tiles, setTiles] = useState<Tile[]>(() => toFallbackTiles())
  const [live, setLive] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const feed = await fetchInstagramFeed()
        if (cancelled) return
        if (feed.items.length >= 3) {
          setTiles(feed.items.map((item) => ({ kind: 'ig', item })))
          setLive(true)
        } else {
          setTiles(toFallbackTiles())
          setLive(false)
        }
      } catch {
        if (!cancelled) {
          setTiles(toFallbackTiles())
          setLive(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="galeria" className="rounded-b-[1.8rem] bg-ink px-5 py-20 text-white md:rounded-b-[2.2rem] md:px-8 md:py-28">
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
              {live ? t('galleryTextLive') : t('galleryText')}
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

        <div
          className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${loading ? 'opacity-80' : ''}`}
          aria-busy={loading}
        >
          {tiles.map((tile, index) => {
            const key = tile.kind === 'ig' ? tile.item.id : tile.src
            const href = tile.kind === 'ig' ? tile.item.permalink : tile.href
            const src = tile.kind === 'ig' ? tile.item.imageUrl : tile.src
            const alt =
              tile.kind === 'ig'
                ? tile.item.caption || `Salute 21 on Instagram`
                : tile.alt
            const isVideo =
              tile.kind === 'ig' && (tile.item.type === 'REEL' || tile.item.type === 'VIDEO')

            return (
              <motion.a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                className="group relative block overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <img
                  src={src}
                  alt={alt}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                {isVideo && (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/20">
                    <span className="inline-flex size-12 items-center justify-center rounded-full border border-white/40 bg-ink/55 text-white backdrop-blur-sm">
                      <Play className="size-5 fill-white" />
                    </span>
                  </span>
                )}
                {tile.kind === 'ig' && tile.item.type === 'REEL' && (
                  <span className="absolute top-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
                    Reel
                  </span>
                )}
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
