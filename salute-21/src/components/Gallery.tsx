import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Images, Play } from 'lucide-react'
import { brand, gallery as fallbackGallery } from '../data/content'
import { fetchInstagramFeed, type IgFeedItem } from '../lib/instagram'
import { useI18n } from '../i18n/LanguageContext'
import { BrandLogo } from './BrandLogo'
import { EgyptMotif } from './EgyptMotif'
import { InstagramIcon } from './icons'

/** Hosted @salute__21 profile tiles — media type for CSS badges (baked IG glyphs removed). */
const HOSTED_META: Record<string, IgFeedItem['type']> = {
  grid_01: 'REEL',
  grid_02: 'REEL',
  grid_03: 'CAROUSEL',
  grid_06: 'REEL',
  grid_08: 'REEL',
}

/** Bust CDN cache after re-cropping hosted tiles */
const IG_ASSET_VER = '20261014b'

type Tile =
  | { kind: 'ig'; item: IgFeedItem }
  | { kind: 'fallback'; id: string; src: string; alt: string; href: string; type?: IgFeedItem['type'] }

function toFallbackTiles(): Tile[] {
  const hosted = Array.from({ length: 10 }, (_, i) => {
    const id = `grid_${String(i + 1).padStart(2, '0')}`
    return {
      kind: 'fallback' as const,
      id,
      src: `/images/instagram/${id}.jpg?v=${IG_ASSET_VER}`,
      alt: 'Salute 21 on Instagram',
      href: brand.instagram,
      type: HOSTED_META[id],
    }
  })
  if (hosted.length) return hosted
  const items = fallbackGallery.slice(0, 10)
  return items.map((item, i) => ({
    kind: 'fallback' as const,
    id: `fallback-${i}`,
    src: item.src,
    alt: item.alt,
    href: brand.instagram,
  }))
}

function MediaBadge({ type, childrenCount }: { type?: IgFeedItem['type']; childrenCount?: number }) {
  if (type === 'CAROUSEL' || (childrenCount && childrenCount > 1)) {
    return (
      <span className="ig-feed__badge" aria-hidden>
        <Images className="size-3.5" strokeWidth={2.25} />
      </span>
    )
  }
  if (type === 'VIDEO' || type === 'REEL') {
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
        alt="Salute 21 on Instagram"
        loading="lazy"
        decoding="async"
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
      <MediaBadge type={item.type} childrenCount={item.childrenCount} />
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
          setTiles(
            feed.items.map((item) => {
              const hostedType = HOSTED_META[item.id]
              const imageUrl = item.imageUrl.startsWith('/images/instagram/')
                ? item.imageUrl.includes('?')
                  ? item.imageUrl
                  : `${item.imageUrl}?v=${IG_ASSET_VER}`
                : item.imageUrl
              return {
                kind: 'ig' as const,
                item: {
                  ...item,
                  imageUrl,
                  type: hostedType || item.type,
                },
              }
            }),
          )
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
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="ig-feed__brand"
          >
            <p className="ig-feed__kicker">{t('galleryKicker')}</p>
            <h2 id="ig-feed-title" className="ig-feed__title">
              <BrandLogo tone="dark" className="ig-feed__logo" />
              <span className="sr-only">{t('galleryTitle')}</span>
            </h2>
            <EgyptMotif className="ig-feed__motif" />
            <p className="ig-feed__lede">{t('galleryText')}</p>
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
                <MediaBadge type={tile.type} />
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
