import { brand } from '../data/content'

/** Canonical production origin (no www) */
export const SITE_URL = 'https://salute21.com'

export type SeoPageId = 'home' | 'menu' | 'reserve' | 'bookingSuccess' | 'admin'

export type SeoPageConfig = {
  path: string
  title: string
  description: string
  /** keywords for meta (supportive; schema + content matter more) */
  keywords: string
  ogType?: 'website' | 'restaurant.menu' | 'article'
  noindex?: boolean
}

export const SEO_PAGES: Record<SeoPageId, SeoPageConfig> = {
  home: {
    path: '/',
    title: 'Salute 21 — Restaurant in Warsaw Wola | Egyptian Soul Fine Dining',
    description:
      'Salute 21 restaurant in Warszawa Wola (ul. Marcina Kasprzaka 24A). Egyptian-soul dining room, pizza, burgers, Turkish specials, brunch & table booking online.',
    keywords:
      'Salute 21, restaurant Warsaw, restauracja Warszawa, Wola, Kasprzaka, Egyptian restaurant Warsaw, book a table Warsaw, pizza Wola, brunch Warszawa',
    ogType: 'website',
  },
  menu: {
    path: '/menu',
    title: 'Menu — Salute 21 Restaurant Warsaw | Pizza, Burgers, Turkish & Drinks',
    description:
      'Salute 21 menu: smash burgers with fries, 32 cm wood-fired pizza, sides, Turkish specials, hot & cold coffee, tea and soft drinks. Wola, Warsaw.',
    keywords:
      'Salute 21 menu, pizza Warsaw, burger Wola, Turkish food Warsaw, coffee Warszawa, restauracja menu',
    ogType: 'restaurant.menu',
  },
  reserve: {
    path: '/reserve',
    title: 'Book a Table — Salute 21 Restaurant Warsaw Wola',
    description:
      'Reserve a table at Salute 21 in Warszawa Wola. Online booking for dinner, brunch and evenings — ul. Marcina Kasprzaka 24A.',
    keywords:
      'book table Warsaw, rezerwacja stolika Warszawa, Salute 21 reservation, restaurant booking Wola',
    ogType: 'website',
  },
  bookingSuccess: {
    path: '/reserve/success',
    title: 'Reservation confirmed — Salute 21',
    description: 'Your table at Salute 21 is confirmed. Show your booking pass when you arrive.',
    keywords: 'Salute 21 booking',
    noindex: true,
  },
  admin: {
    path: '/admin/bookings',
    title: 'Admin — Salute 21',
    description: 'Staff booking admin for Salute 21.',
    keywords: '',
    noindex: true,
  },
}

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http')) return path
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized === '/' ? '' : normalized}`
}

export function ogImageUrl(): string {
  return absoluteUrl('/og.jpg')
}

/** Restaurant JSON-LD for Google Business / rich results */
export function buildRestaurantJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'FoodEstablishment'],
    '@id': `${SITE_URL}/#restaurant`,
    name: 'Salute 21',
    alternateName: ['Saluté 21', 'Salute21'],
    url: SITE_URL,
    image: [ogImageUrl(), absoluteUrl('/images/hero.jpg'), absoluteUrl('/images/interior.jpg')],
    logo: absoluteUrl('/favicon.svg'),
    description:
      'Fine restaurant in Warsaw Wola with Egyptian soul — wood-fired pizza, burgers, Turkish specials, coffee, brunch and online table booking.',
    servesCuisine: ['Mediterranean', 'Italian', 'Turkish', 'Egyptian-inspired', 'European'],
    priceRange: 'złzł',
    email: brand.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.street,
      addressLocality: 'Warszawa',
      addressRegion: 'Mazowieckie',
      postalCode: '01-211',
      addressCountry: 'PL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.2278,
      longitude: 20.9724,
    },
    hasMap: brand.address.mapsUrl,
    sameAs: [brand.instagram],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '23:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '09:00',
        closes: '23:30',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '21:00',
      },
    ],
    acceptsReservations: true,
    menu: absoluteUrl('/menu'),
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl('/reserve'),
        inLanguage: ['en', 'pl'],
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      result: {
        '@type': 'Reservation',
        name: 'Table reservation',
      },
    },
  }
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Salute 21',
    description: SEO_PAGES.home.description,
    publisher: { '@id': `${SITE_URL}/#restaurant` },
    inLanguage: ['en', 'pl'],
  }
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** Menu schema for /menu — helps Google understand the offer */
export function buildMenuJsonLd(
  categories: Array<{
    name: string
    items: Array<{ name: string; description: string; price: number }>
  }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${SITE_URL}/menu#menu`,
    name: 'Salute 21 Menu',
    description: SEO_PAGES.menu.description,
    url: absoluteUrl('/menu'),
    inLanguage: ['en', 'pl'],
    hasMenuSection: categories.map((cat) => ({
      '@type': 'MenuSection',
      name: cat.name,
      hasMenuItem: cat.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'PLN',
          availability: 'https://schema.org/InStock',
        },
      })),
    })),
  }
}
