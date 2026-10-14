import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const HEADER_FALLBACK_PX = 72
/** Keep correcting briefly — home sections (IG grid, reviews) can shift height after first paint. */
const CORRECT_FOR_MS = 900

function fixedChromePx() {
  const header = document.querySelector('header')
  const headerH = header instanceof HTMLElement ? header.offsetHeight : HEADER_FALLBACK_PX

  // --site-banner-offset lives on .salute-halloween (inherits to header), not on <html>
  const scope =
    (header instanceof HTMLElement ? header : null) ||
    document.querySelector('.salute-halloween') ||
    document.documentElement
  const bannerRaw = getComputedStyle(scope).getPropertyValue('--site-banner-offset').trim()
  let banner = 0
  if (bannerRaw.endsWith('rem')) banner = Number.parseFloat(bannerRaw) * 16
  else if (bannerRaw.endsWith('px')) banner = Number.parseFloat(bannerRaw)
  else if (bannerRaw) banner = Number.parseFloat(bannerRaw)

  return headerH + (Number.isFinite(banner) ? banner : 0)
}

function scrollToHash(hash: string, behavior: ScrollBehavior) {
  const id = hash.replace(/^#/, '')
  if (!id) return false
  const el = document.getElementById(id)
  if (!el) return false

  const chrome = fixedChromePx()
  const top = el.getBoundingClientRect().top + window.scrollY - chrome
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior })
  return true
}

/** True when the target sits roughly under the fixed header (not a screen above/below). */
function isAligned(hash: string) {
  const id = hash.replace(/^#/, '')
  const el = document.getElementById(id)
  if (!el) return false
  const chrome = fixedChromePx()
  const delta = el.getBoundingClientRect().top - chrome
  return Math.abs(delta) < 12
}

/**
 * Scroll to in-page anchors like /#kontakt after SPA navigations.
 * Retries + short correction window so late layout (Instagram grid, etc.) can't leave you
 * parked on the previous section.
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
    const timers: number[] = []
    let ro: ResizeObserver | null = null

    const run = (b: ScrollBehavior = behavior) => {
      if (cancelled) return
      scrollToHash(hash, b)
    }

    const armCorrections = () => {
      const started = performance.now()

      const correct = () => {
        if (cancelled) return
        if (!isAligned(hash)) run('auto')
        if (performance.now() - started < CORRECT_FOR_MS) {
          timers.push(window.setTimeout(correct, 120))
        }
      }

      // A few fixed passes catch IG/images/fonts settling.
      for (const ms of [50, 150, 320, 600]) {
        timers.push(window.setTimeout(() => run('auto'), ms))
      }
      timers.push(window.setTimeout(correct, 80))

      const el = document.getElementById(hash.replace(/^#/, ''))
      const main = document.querySelector('main')
      if (typeof ResizeObserver !== 'undefined' && (el || main)) {
        ro = new ResizeObserver(() => {
          if (cancelled) return
          if (performance.now() - started > CORRECT_FOR_MS) return
          if (!isAligned(hash)) run('auto')
        })
        if (el) ro.observe(el)
        if (main) ro.observe(main)
        timers.push(
          window.setTimeout(() => {
            ro?.disconnect()
            ro = null
          }, CORRECT_FOR_MS + 50),
        )
      }
    }

    const findThenScroll = () => {
      if (cancelled) return
      if (scrollToHash(hash, behavior)) {
        armCorrections()
        return
      }
      tries += 1
      if (tries < 16) {
        timers.push(window.setTimeout(findThenScroll, 30 + tries * 25))
      }
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(findThenScroll)
    })

    return () => {
      cancelled = true
      for (const id of timers) window.clearTimeout(id)
      ro?.disconnect()
    }
  }, [pathname, hash, key])

  return null
}
