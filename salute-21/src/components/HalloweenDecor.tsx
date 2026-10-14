import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n } from '../i18n/LanguageContext'

const STORAGE_KEY = 'salute21-halloween'

export function readHalloweenPref(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function writeHalloweenPref(on: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0')
  } catch {
    /* ignore */
  }
}

type Props = {
  enabled: boolean
  onToggle: () => void
}

/** Seasonal Halloween accents — opt-in via floating pumpkin (off by default). */
export function HalloweenDecor({ enabled, onToggle }: Props) {
  const { t } = useI18n()

  return (
    <>
      <AnimatePresence>
        {enabled && (
          <motion.div
            key="halloween-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`halloween-toggle ${enabled ? 'is-on' : ''}`}
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label={enabled ? t('halloweenToggleOff') : t('halloweenToggleOn')}
        title={enabled ? t('halloweenToggleOff') : t('halloweenToggleOn')}
        initial={false}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.92 }}
      >
        <Pumpkin className="halloween-toggle__icon" />
        <span className="halloween-toggle__pulse" aria-hidden />
      </motion.button>
    </>
  )
}

/** Home-page wrapper: owns toggle state + layout offset class. */
export function HalloweenSeason({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setEnabled(readHalloweenPref())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    writeHalloweenPref(enabled)
  }, [enabled, hydrated])

  return (
    <div className={`relative min-h-screen ${enabled ? 'salute-halloween' : ''}`}>
      <HalloweenDecor enabled={enabled} onToggle={() => setEnabled((v) => !v)} />
      {children}
    </div>
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
