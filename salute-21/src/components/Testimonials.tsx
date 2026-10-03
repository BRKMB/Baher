import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Star } from 'lucide-react'
import {
  GOOGLE_MAPS_URL,
  GOOGLE_RATING,
  GOOGLE_REVIEW_COUNT,
  googleReviews,
} from '../data/reviews'
import { useI18n } from '../i18n/LanguageContext'

/** Pause long enough to read the quote (~14 chars/sec) + a short settle buffer. */
function dwellMsForQuote(quote: string) {
  const chars = quote.trim().length
  const reading = Math.ceil(chars / 14) * 1000
  return Math.min(18000, Math.max(7500, reading + 2800))
}

function StarSlot({ fill }: { fill: 'full' | 'half' | 'empty' }) {
  if (fill === 'half') {
    return (
      <span className="review-stars__slot relative inline-flex">
        <Star className="review-stars__icon is-empty" aria-hidden />
        <span className="review-stars__half" aria-hidden>
          <Star className="review-stars__icon is-full" />
        </span>
      </span>
    )
  }

  return (
    <span className="review-stars__slot inline-flex">
      <Star
        className={`review-stars__icon ${fill === 'full' ? 'is-full' : 'is-empty'}`}
        aria-hidden
      />
    </span>
  )
}

function StarRating({ value }: { value: number }) {
  const stars = [1, 2, 3, 4, 5].map((n) => {
    if (value >= n) return 'full' as const
    if (value >= n - 0.5) return 'half' as const
    return 'empty' as const
  })

  return (
    <div className="review-stars" aria-label={`${value} out of 5`}>
      <div className="review-stars__row">
        {stars.map((fill, i) => (
          <StarSlot key={i} fill={fill} />
        ))}
      </div>
      <span className="review-stars__score">{value.toFixed(1)}</span>
    </div>
  )
}

function GoogleMark({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M12 11.5v3.2h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.6 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12S6.8 21.5 12 21.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.7H12z"
      />
      <path fill="#4285F4" d="M12 11.5h9c.1.6.1 1.1.1 1.7 0 5.4-3.6 9.3-9.1 9.3-1.6 0-3.1-.4-4.4-1.2l3.4-2.6c.8.4 1.6.6 2.6.6 3.8 0 5.2-2.6 5.4-3.9H12v-3.9z" opacity=".001" />
      <path
        fill="#FBBC05"
        d="M5.3 14.3l-3.4 2.6C3.3 19.6 7.4 21.5 12 21.5c1.6 0 3.1-.4 4.4-1.2l-3.4-2.6c-.8.5-1.9.8-3 .8-2.3 0-4.2-1.5-4.9-3.6l-.8-.6z"
        opacity=".001"
      />
      <path
        fill="#34A853"
        d="M12 5.5c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 2.6 14.6 1.5 12 1.5 7.4 1.5 3.3 4.3 1.9 8.1l3.4 2.6C6.1 7.9 8.7 5.5 12 5.5z"
        opacity=".001"
      />
      {/* Simplified multicolor G */}
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.7-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.5z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.4 1.1-3.9 1.1-3 0-5.6-2-6.5-4.7H1.7v2.9C3.6 21.4 7.5 24 12 24z" />
      <path fill="#FBBC05" d="M5.5 14.7c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7.4H1.7C.9 8.9.5 10.4.5 12.5s.4 3.6 1.2 5.1l3.8-2.9z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.3 15.1.2 12 .2 7.5.2 3.6 2.8 1.7 6.9l3.8 2.9C6.4 6.8 9 4.8 12 4.8z" />
    </svg>
  )
}

export function Testimonials() {
  const { t, lang } = useI18n()
  const [active, setActive] = useState(0)
  const items = googleReviews.map((item) => ({
    id: item.id,
    name: item.name,
    quote: item.quote[lang],
    rating: item.rating,
    photos: item.photos ?? [],
  }))
  const current = items[active] ?? items[0]

  useEffect(() => {
    if (!current) return
    const delay = dwellMsForQuote(current.quote)
    const id = window.setTimeout(() => {
      setActive((i) => (i + 1) % items.length)
    }, delay)
    return () => window.clearTimeout(id)
  }, [active, current, items.length, lang])

  if (!current) return null

  return (
    <section id="opinie" className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,181,106,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

      <div className="relative mx-auto max-w-5xl px-5 py-24 md:px-8 md:py-32">
        <div className="text-center">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.34em] text-gold uppercase">
            {t('testimonialsEyebrow')}
          </p>
          <h2 className="font-display text-4xl tracking-[-0.02em] text-white italic md:text-5xl">
            {t('testimonialsTitle')}
          </h2>
          <div className="mx-auto my-7 h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
            {t('testimonialsIntro')}
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-white/85 transition hover:border-gold/50 hover:text-gold"
          >
            <GoogleMark className="size-4" />
            Google · {GOOGLE_RATING.toFixed(1)} · {GOOGLE_REVIEW_COUNT} {t('reviewsCountLabel')}
          </a>
        </div>

        <div className="relative mx-auto mt-14 min-h-[300px] max-w-3xl md:min-h-[320px] md:mt-16">
          <span
            aria-hidden
            className="pointer-events-none absolute -top-6 left-0 font-display text-[7rem] leading-none text-gold/20 select-none md:-top-10 md:text-[9rem]"
          >
            “
          </span>

          <AnimatePresence mode="wait">
            <motion.figure
              key={`${lang}-${current.id}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative px-2 text-center md:px-8"
            >
              <div className="mb-7 flex justify-center md:mb-8">
                <StarRating value={current.rating} />
              </div>
              <blockquote className="font-display text-[1.65rem] leading-[1.35] text-balance text-white italic md:text-[2.15rem] md:leading-[1.3]">
                {current.quote}
              </blockquote>
              {current.photos.length > 0 && (
                <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                  {current.photos.map((src) => (
                    <a
                      key={src}
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block overflow-hidden rounded-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:border-gold/50"
                    >
                      <img
                        src={src}
                        alt=""
                        width={160}
                        height={120}
                        loading="lazy"
                        className="h-24 w-32 object-cover transition duration-500 group-hover:scale-[1.04] sm:h-28 sm:w-40"
                      />
                    </a>
                  ))}
                </div>
              )}
              <figcaption className="mt-10">
                <div className="mx-auto mb-5 h-px w-10 bg-gold/50" />
                <p className="text-sm font-semibold tracking-wide text-white">{current.name}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.18em] text-gold uppercase">
                  <GoogleMark className="size-3.5" />
                  {t('googleReviewLabel')}
                </p>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 md:mt-14">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={item.name}
              aria-current={index === active}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === active
                  ? 'w-8 bg-gold'
                  : 'w-1.5 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>

        <div className="mt-16 overflow-hidden border-t border-white/10 pt-8">
          <div className="testimonial-names flex w-max gap-10 whitespace-nowrap px-4 text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">
            {[...items, ...items].map((item, i) => (
              <button
                key={`${item.id}-strip-${i}`}
                type="button"
                onClick={() => setActive(i % items.length)}
                className={`transition hover:text-gold ${
                  i % items.length === active ? 'text-gold' : ''
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
