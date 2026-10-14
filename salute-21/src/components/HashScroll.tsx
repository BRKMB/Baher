import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const HEADER_FALLBACK_PX = 72

function headerOffsetPx() {
  const header = document.querySelector('header')
  const headerH = header instanceof HTMLElement ? header.offsetHeight : HEADER_FALLBACK_PX
  const bannerRaw = getComputedStyle(document.documentElement)
    .getPropertyValue('--site-banner-offset')
    .trim()
  let banner = 0
  if (bannerRaw.endsWith('rem')) {
    banner = Number.parseFloat(bannerRaw) * 16
  } else if (bannerRaw) {
    banner = Number.parseFloat(bannerRaw)
  }
  return headerH + (Number.isFinite(banner) ? banner : 0) + 8
}

function scrollToHash(hash: string, behavior: ScrollBehavior) {
  const id = hash.replace(/^#/, '')
  if (!id) return false
  const el = document.getElementById(id)
  if (!el) return false

  const top = el.getBoundingClientRect().top + window.scrollY - headerOffsetPx()
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior })
  return true
}

/**
 * Scroll to in-page anchors like /#opinie after SPA navigations.
 * Retries briefly so late-mounted home sections are still caught.
 */
export function HashScroll() {
  const { pathname, hash, key } = useLocation()
  const prevPath = useRef(pathname)

  useLayoutEffect(() => {
    if (pathname !== '/' || !hash || hash === '#') {
      prevPath.current = pathname
      return
    }

    const fromOtherPage = prevPath.current !== '/'
    prevPath.current = pathname
    const behavior: ScrollBehavior = fromOtherPage ? 'auto' : 'smooth'

    let cancelled = false
    let tries = 0

    const run = () => {
      if (cancelled) return
      if (scrollToHash(hash, behavior)) return
      tries += 1
      if (tries < 12) {
        window.setTimeout(run, 40 + tries * 20)
      }
    }

    // Let the destination route paint first.
    requestAnimationFrame(() => {
      requestAnimationFrame(run)
    })

    return () => {
      cancelled = true
    }
  }, [pathname, hash, key])

  return null
}
