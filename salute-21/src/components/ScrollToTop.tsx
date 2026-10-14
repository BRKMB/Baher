import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Land at the top of a new route — unless the URL carries an in-page hash
 * (e.g. /#opinie from /reserve). HashScroll handles those targets.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Keep vertical position free for HashScroll when jumping to a home section.
    if (pathname === '/' && hash && hash !== '#') return

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, hash])

  return null
}
