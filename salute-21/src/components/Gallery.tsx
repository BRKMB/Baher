import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Images, Play } from 'lucide-react'
import { brand, gallery as fallbackGallery } from '../data/content'
import { fetchInstagramFeed, type IgFeedItem } from '../lib/instagram'
import { useI18n } from '../i18n/LanguageContext'
import { InstagramIcon } from './icons'

type Tile =
  | { kind: 'ig'; item: IgFeedItem }
  | { kind: 'fallback'; id: string; src: string; alt: string; href: string }

function toFallbackTiles(): Tile[] {
  const items = fallbackGallery.slice(0, 8)
  const n = Math.floor(items.length / 4) * 4 || Math.floor(items.length / 2) * 2
  return items.slice(0, n).map((item, i) => ({
    kind: 'fallback' as const,
    id: `fallback-${i}`,
    src: item.src,
    alt: item.alt,
    href: brand.instagram,
  }))
}

function MediaBadge({ item }: { item: IgFeedItem }) {
  if (item.type === 'CAROUSEL' || (item.childrenCount && item.childrenCount > 1)) {
    return (
      <span className="ig-feed__badge" aria-hidden>
        <Images className="size-3.5" strokeWidth={2.25} />
      </span>
    )
  }
  if (item.type === 'VIDEO' || item.type === 'REEL') {
    return (
      <span className="ig-feed__badge" aria-hidden>
        <Play className="size-3.5 fill-white" strokeWidth={2} />
      </span>
    )
  }
  return null
}

function IgTile({ item, index }: { item: IgFeedItem; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canPreview = Boolean(item.videoUrl) && (item.type === 'VIDEO' || item.type === 'REEL')

  const onEnter = () => {
    const el = videoRef.current
    if (!el) return
    el.currentTime = 0
    void el.play().catch(() => {})
  }

  const onLeave = () => {
    const el = videoRef.current
    if (!el) return
    el.pause()
    el.currentTime = 0
  }

  return (
    <motion.a
      href={item.permalink}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: (index % 8) * 0.04 }}
      className="ig-feed__tile group"
      onMouseEnter={canPreview ? onEnter : undefined}
      onMouseLeave={canPreview ? onLeave : undefined}
      onFocus={canPreview ? onEnter : undefined}
      onBlur={canPreview ? onLeave : undefined}
    >
      <img
        src={item.imageUrl}
        alt={item.caption || `Salute 21 on Instagram`}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="ig-feed__media"
      />
      {canPreview && (
        <video
          ref={videoRef}
          className="ig-feed__video"
          src={item.videoUrl}
          muted
          playsInline
          loop
          preload="none"
          aria-hidden
        />
      )}
      <MediaBadge item={item} />
      <span className="ig-feed__overlay" aria-hidden>
        <InstagramIcon className="ig-feed__overlay-icon" />
        {item.caption ? <span className="ig-feed__caption">{item.caption}</span> : null}
      </span>
    </motion.a>
  )
}

export function Gallery() {
  const { t } = useI18n()
  const [tiles, setTiles] = useState<Tile[]>(() => toFallbackTiles())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const feed = await fetchInstagramFeed()
        if (cancelled) return
        if (feed.items.length >= 1) {
          setTiles(feed.items.map((item) => ({ kind: 'ig', item })))
        } else {
          setTiles(toFallbackTiles())
        }
      } catch {
        if (!cancelled) setTiles(toFallbackTiles())
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      id="galeria"
      className="ig-feed scroll-mt-[calc(var(--site-banner-offset,0px)+4.75rem)]"
      aria-labelledby="ig-feed-title"
    >
      <div className="ig-feed__inner">
        <header className="ig-feed__header">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="ig-feed__brand"
          >
            <span className="ig-feed__mark" aria-hidden>
              <InstagramIcon className="size-5" />
            </span>
            <h2 id="ig-feed-title" className="ig-feed__title">
              {t('galleryTitle')}
            </h2>
            <a
              href={brand.instagram}
              target="_blank"
              rel="noreferrer"
              className="ig-feed__handle"
            >
              {brand.instagramHandle}
            </a>
          </motion.div>
        </header>

        <div
          className={`ig-feed__grid ${loading ? 'is-loading' : ''}`}
          data-count={tiles.length}
          aria-busy={loading}
          style={{ minHeight: 'min(72vw, 22rem)' }}
        >
          {tiles.map((tile, index) => {
            if (tile.kind === 'ig') {
              return <IgTile key={tile.item.id} item={tile.item} index={index} />
            }

            return (
              <motion.a
                key={tile.id}
                href={tile.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: (index % 8) * 0.04 }}
                className="ig-feed__tile group"
              >
                <img
                  src={tile.src}
                  alt={tile.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="ig-feed__media"
                />
                <span className="ig-feed__overlay" aria-hidden>
                  <InstagramIcon className="ig-feed__overlay-icon" />
                </span>
              </motion.a>
            )
          })}
        </div>

        <div className="ig-feed__cta-wrap">
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="ig-feed__cta"
          >
            <InstagramIcon className="size-4" />
            {t('galleryFollow')}
          </a>
        </div>
      </div>
    </section>
  )
}
