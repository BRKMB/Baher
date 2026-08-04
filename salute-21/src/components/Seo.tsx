import { useEffect } from 'react'
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildRestaurantJsonLd,
  buildWebsiteJsonLd,
  ogImageUrl,
  SEO_PAGES,
  type SeoPageId,
} from '../seo/site'

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const extraSel = extra
    ? Object.entries(extra)
        .map(([k, v]) => `[${k}="${v}"]`)
        .join('')
    : ''
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]${extraSel}`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (extra) {
      for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v)
    }
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

type SeoProps = {
  page: SeoPageId
  /** Override path for dynamic routes (e.g. booking success id) */
  path?: string
  title?: string
  description?: string
  breadcrumbs?: Array<{ name: string; path: string }>
  /** Extra JSON-LD graphs (Menu, FAQ, etc.) */
  extraJsonLd?: unknown[]
}

/** Client-side SEO head + JSON-LD (complements static index.html + Worker injection). */
export function Seo({ page, path, title, description, breadcrumbs, extraJsonLd }: SeoProps) {
  const config = SEO_PAGES[page]
  const pageTitle = title ?? config.title
  const pageDescription = description ?? config.description
  const canonicalPath = path ?? config.path
  const canonical = absoluteUrl(canonicalPath === '/' ? '/' : canonicalPath)
  const image = ogImageUrl()
  const robots = config.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

  useEffect(() => {
    document.title = pageTitle
    upsertMeta('name', 'description', pageDescription)
    upsertMeta('name', 'keywords', config.keywords)
    upsertMeta('name', 'robots', robots)
    upsertMeta('name', 'googlebot', robots)
    upsertMeta('name', 'author', 'Salute 21')
    upsertMeta('name', 'geo.region', 'PL-MZ')
    upsertMeta('name', 'geo.placename', 'Warszawa Wola')
    upsertMeta('name', 'geo.position', '52.2278;20.9724')
    upsertMeta('name', 'ICBM', '52.2278, 20.9724')

    upsertMeta('property', 'og:type', config.ogType ?? 'website')
    upsertMeta('property', 'og:site_name', 'Salute 21')
    upsertMeta('property', 'og:locale', 'en_GB')
    upsertMeta('property', 'og:locale:alternate', 'pl_PL')
    upsertMeta('property', 'og:title', pageTitle)
    upsertMeta('property', 'og:description', pageDescription)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:image', image)
    upsertMeta('property', 'og:image:secure_url', image)
    upsertMeta('property', 'og:image:type', 'image/jpeg')
    upsertMeta('property', 'og:image:width', '1200')
    upsertMeta('property', 'og:image:height', '630')
    upsertMeta('property', 'og:image:alt', 'Salute 21 — Restaurant in Warsaw')

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', pageTitle)
    upsertMeta('name', 'twitter:description', pageDescription)
    upsertMeta('name', 'twitter:image', image)
    upsertMeta('name', 'twitter:image:alt', 'Salute 21 — Restaurant in Warsaw')

    upsertLink('canonical', canonical)
    upsertLink('alternate', canonical, { hrefLang: 'x-default' })
    upsertLink('alternate', canonical, { hrefLang: 'en' })
    upsertLink('alternate', canonical, { hrefLang: 'pl' })

    if (!config.noindex) {
      upsertJsonLd('ld-restaurant', buildRestaurantJsonLd())
      upsertJsonLd('ld-website', buildWebsiteJsonLd())
      if (breadcrumbs?.length) {
        upsertJsonLd('ld-breadcrumb', buildBreadcrumbJsonLd(breadcrumbs))
      } else {
        document.getElementById('ld-breadcrumb')?.remove()
      }
      if (extraJsonLd?.length) {
        upsertJsonLd('ld-extra', extraJsonLd.length === 1 ? extraJsonLd[0] : extraJsonLd)
      } else {
        document.getElementById('ld-extra')?.remove()
      }
    } else {
      document.getElementById('ld-restaurant')?.remove()
      document.getElementById('ld-website')?.remove()
      document.getElementById('ld-breadcrumb')?.remove()
      document.getElementById('ld-extra')?.remove()
    }
  }, [
    breadcrumbs,
    canonical,
    canonicalPath,
    config.keywords,
    config.noindex,
    config.ogType,
    extraJsonLd,
    image,
    pageDescription,
    pageTitle,
    robots,
  ])

  return null
}
