import { motion } from 'framer-motion'
import { useI18n } from '../i18n/LanguageContext'

/** Chic seasonal Halloween accents — subtle, not carnival. */
export function HalloweenDecor() {
  const { t } = useI18n()

  return (
    <>
      <div className="halloween-banner" role="status">
        <span className="halloween-banner__glow" aria-hidden />
        <span className="halloween-banner__icon" aria-hidden>
          ✦
        </span>
        <p>{t('halloweenBanner')}</p>
        <span className="halloween-banner__icon" aria-hidden>
          ✦
        </span>
      </div>

      <div className="halloween-fx pointer-events-none" aria-hidden>
        <svg className="halloween-web halloween-web--tl" viewBox="0 0 120 120" fill="none">
          <path
            d="M0 0 H90 M0 0 V90 M0 0 L70 70 M0 18 H55 M0 36 H48 M0 54 H40 M18 0 V55 M36 0 V48 M54 0 V40"
            stroke="currentColor"
            strokeWidth="0.7"
            opacity="0.55"
          />
        </svg>
        <svg className="halloween-web halloween-web--tr" viewBox="0 0 120 120" fill="none">
          <path
            d="M120 0 H30 M120 0 V90 M120 0 L50 70 M120 18 H65 M120 36 H72 M120 54 H80 M102 0 V55 M84 0 V48 M66 0 V40"
            stroke="currentColor"
            strokeWidth="0.7"
            opacity="0.55"
          />
        </svg>

        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={`halloween-bat halloween-bat--${i + 1}`}
            animate={{ y: [0, -10, 0], x: [0, i % 2 === 0 ? 8 : -8, 0] }}
            transition={{ duration: 4.2 + i * 0.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BatSilhouette />
          </motion.span>
        ))}

        <div className="halloween-pumpkins">
          <Pumpkin className="halloween-pumpkin halloween-pumpkin--l" />
          <Pumpkin className="halloween-pumpkin halloween-pumpkin--r" />
        </div>
      </div>
    </>
  )
}

function BatSilhouette() {
  return (
    <svg viewBox="0 0 64 28" className="h-full w-full" fill="currentColor">
      <path d="M32 16c-1.5 0-3-2-3-4 0 0-1 3-5 3S16 8 12 6c0 0 3 6-2 10 0 0 6-1 8 3 0 0 4-4 7-3 0 0 1 4 7 4s7-4 7-4c3-1 7 3 7 3 2-4 8-3 8-3-5-4-2-10-2-10-4 2-12 9-12 9s-3.5 0-5-3c0 2-1.5 4-3 4z" />
    </svg>
  )
}

function Pumpkin({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 44" fill="none" aria-hidden>
      <ellipse cx="24" cy="26" rx="18" ry="14" fill="#c45a16" />
      <ellipse cx="16" cy="26" rx="10" ry="13" fill="#d97706" opacity="0.9" />
      <ellipse cx="32" cy="26" rx="10" ry="13" fill="#b45309" opacity="0.95" />
      <path d="M24 10c0 4 2 6 2 8h-4c0-2 2-4 2-8z" fill="#3f6212" />
      <path d="M18 22l4 3-4 2zm12 0l-4 3 4 2zM20 30h8l-4 4z" fill="#1c1917" opacity="0.75" />
    </svg>
  )
}
