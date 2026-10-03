import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Always land at the top of a new route.
 * Without this, scrolling to Reviews/Contact on home then opening /reserve
 * keeps the previous scroll offset and the booking page appears mid-page.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}
