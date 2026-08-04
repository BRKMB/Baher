import { useEffect, useState } from 'react'
import { BrandLogo } from './BrandLogo'

/** Total time on screen, including fade-out */
const SPLASH_MS = 3000
const FADE_MS = 700

/**
 * Black splash with white wordmark while the app mounts underneath.
 * Plays once per full page load (~3s), then fades away.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('splash-lock')

    const leaveAt = window.setTimeout(() => setLeaving(true), SPLASH_MS - FADE_MS)
    const hideAt = window.setTimeout(() => {
      setVisible(false)
      document.documentElement.classList.remove('splash-lock')
    }, SPLASH_MS)

    return () => {
      window.clearTimeout(leaveAt)
      window.clearTimeout(hideAt)
      document.documentElement.classList.remove('splash-lock')
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`splash-screen${leaving ? ' splash-screen--leave' : ''}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className="splash-screen__inner">
        <BrandLogo
          tone="light"
          className="splash-screen__logo text-[3.75rem] sm:text-[4.75rem] md:text-[5.5rem]"
        />
        <span className="splash-screen__line" />
      </div>
    </div>
  )
}
