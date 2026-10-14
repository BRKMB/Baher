/**
 * Minimal hosted-grid payload for `/api/instagram`.
 * Use this as a fallback when Graph/SerpAPI are unavailable.
 *
 * Cloudflare Worker / Express example:
 *
 *   import { buildHostedInstagramFeed } from './hostedGrid'
 *   if (path === '/api/instagram') return Response.json(buildHostedInstagramFeed())
 */

export type HostedMediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'REEL'

export type HostedGridEntry = {
  id: string
  type: HostedMediaType
}

export const DEFAULT_HOSTED_GRID: HostedGridEntry[] = [
  { id: 'grid_01', type: 'REEL' },
  { id: 'grid_02', type: 'REEL' },
  { id: 'grid_03', type: 'CAROUSEL' },
  { id: 'grid_04', type: 'IMAGE' },
  { id: 'grid_05', type: 'IMAGE' },
  { id: 'grid_06', type: 'REEL' },
  { id: 'grid_07', type: 'IMAGE' },
  { id: 'grid_08', type: 'REEL' },
  { id: 'grid_09', type: 'IMAGE' },
  { id: 'grid_10', type: 'IMAGE' },
]

export function buildHostedInstagramFeed(opts?: {
  handle?: string
  profileUrl?: string
  assetsPath?: string
  assetVersion?: string
  grid?: HostedGridEntry[]
}) {
  const handle = opts?.handle ?? '@salute__21'
  const profileUrl = opts?.profileUrl ?? 'https://www.instagram.com/salute__21/'
  const assetsPath = opts?.assetsPath ?? '/images/instagram'
  const assetVersion = opts?.assetVersion ?? '1'
  const grid = opts?.grid ?? DEFAULT_HOSTED_GRID

  const items = grid.map((entry, index) => ({
    id: entry.id,
    type: entry.type,
    imageUrl: `${assetsPath}/${entry.id}.jpg?v=${assetVersion}`,
    permalink: profileUrl,
    caption: '',
    timestamp: null as string | null,
    sort: index,
  }))

  return {
    ok: true,
    configured: true,
    source: 'hosted_grid',
    fetchedAt: Date.now(),
    count: items.length,
    items,
    handle,
    profileUrl,
    grid: 5,
  }
}
