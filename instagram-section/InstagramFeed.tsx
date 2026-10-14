import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Images, Play } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { EgyptMotif } from './EgyptMotif'
import { InstagramIcon } from './icons'
import { igSectionConfig } from './config'
import { fetchInstagramFeed, type IgFeedItem } from './instagram'

type Tile =
  | { kind: 'ig'; item: IgFeedItem }
  | {
      kind: 'fallback'
      id: string
      src: string
      alt: string
      href: string
      type?: IgFeedItem['type']
    }

function toFallbackTiles(): Tile[] {
  const { assetsPath, assetVersion, instagramUrl, brandAriaLabel, hostedMeta } = igSectionConfig
  return Array.from({ length: 10 }, (_, i) => {
    const id = `grid_${String(i + 1).padStart(2, '0')}`
    return {
      kind: 'fallback' as const,
      id,
      src: `${assetsPath}/${id}.jpg?v=${assetVersion}`,
      alt: `${brandAriaLabel} on Instagram`,
      href: instagramUrl,
      type: hostedMeta[id],
    }
  })
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
        alt={`${igSectionConfig.brandAriaLabel} on Instagram`}
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

/**
 * Portable Instagram section (5×2 Shopify-style grid).
 * Drop into any React page: `<InstagramFeed />`
 */
export function InstagramFeed() {
  const cfg = igSectionConfig
  const [tiles, setTiles] = useState<Tile[]>(() => toFallbackTiles())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const feed = await fetchInstagramFeed(cfg.apiPath)
        if (cancelled) return
        if (feed.items.length >= 1) {
          setTiles(
            feed.items.map((item) => {
              const hostedType = cfg.hostedMeta[item.id]
              const imageUrl = item.imageUrl.startsWith(cfg.assetsPath)
                ? item.imageUrl.includes('?')
                  ? item.imageUrl
                  : `${item.imageUrl}?v=${cfg.assetVersion}`
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
    <section id="galeria" className="ig-feed" aria-labelledby="ig-feed-title">
      <div className="ig-feed__inner">
        <header className="ig-feed__header">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="ig-feed__brand"
          >
            <p className="ig-feed__kicker">{cfg.kicker}</p>
            <h2 id="ig-feed-title" className="ig-feed__title">
              <BrandLogo tone="dark" className="ig-feed__logo" />
            </h2>
            <EgyptMotif className="ig-feed__motif" />
            <p className="ig-feed__lede">{cfg.lede}</p>
            <a
              href={cfg.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="ig-feed__handle"
            >
              {cfg.instagramHandle}
            </a>
          </motion.div>
        </header>

        <div
          className={`ig-feed__grid ${loading ? 'is-loading' : ''}`}
          data-count={tiles.length}
          aria-busy={loading}
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
            href={cfg.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="ig-feed__cta"
          >
            <InstagramIcon className="size-4" />
            {cfg.followCta}
          </a>
        </div>
      </div>
    </section>
  )
}

export default InstagramFeed
