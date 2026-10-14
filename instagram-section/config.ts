/**
 * Edit this file when dropping the section into another restaurant site.
 */
export const igSectionConfig = {
  /** Script wordmark — shown large in the header */
  brandName: 'Saluté',
  brandNumber: '21',
  /** Accessible name for the logo */
  brandAriaLabel: 'Salute 21',

  instagramUrl: 'https://www.instagram.com/salute__21/',
  instagramHandle: '@salute__21',

  /** Header copy (EN). Swap or wire to your i18n. */
  kicker: 'From the dining room',
  lede: 'Tables, plates, and evenings from the dining room.',
  followCta: 'Open Instagram',

  /** Public path where grid_01.jpg … grid_10.jpg are served */
  assetsPath: '/images/instagram',
  /** Bump when you replace tile images (CDN cache bust) */
  assetVersion: '1',

  /** Optional: which hosted tiles show video/carousel badges */
  hostedMeta: {
    grid_01: 'REEL',
    grid_02: 'REEL',
    grid_03: 'CAROUSEL',
    grid_06: 'REEL',
    grid_08: 'REEL',
  } as Record<string, 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'REEL'>,

  /** API endpoint — return hosted grid JSON if live Instagram is unavailable */
  apiPath: '/api/instagram',
}
