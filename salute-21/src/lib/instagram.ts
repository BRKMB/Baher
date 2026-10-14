export type IgChildMedia = {
  type: 'IMAGE' | 'VIDEO'
  imageUrl?: string
  videoUrl?: string
}

export type IgFeedItem = {
  id: string
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'REEL'
  imageUrl: string
  videoUrl?: string
  permalink: string
  caption: string
  timestamp: string | null
  childrenCount?: number
  children?: IgChildMedia[]
}

export type IgFeedResponse = {
  ok: boolean
  configured: boolean
  source: string
  fetchedAt: number | null
  count: number
  items: IgFeedItem[]
  handle: string
  profileUrl: string
  grid: number
  error?: string
  reason?: string
}

/** Keep the gallery a tidy Shopify-style grid (multiples of 4, else 2). */
export function trimToGrid(items: IgFeedItem[], max = 12): IgFeedItem[] {
  const capped = items.slice(0, max)
  const byFour = Math.floor(capped.length / 4) * 4
  if (byFour >= 4) return capped.slice(0, byFour)
  const byTwo = Math.floor(capped.length / 2) * 2
  return capped.slice(0, byTwo)
}

/** @deprecated use trimToGrid */
export function trimToTriple(items: IgFeedItem[], max = 12): IgFeedItem[] {
  return trimToGrid(items, max)
}

export async function fetchInstagramFeed(): Promise<IgFeedResponse> {
  const res = await fetch('/api/instagram', {
    headers: { accept: 'application/json' },
  })
  const data = (await res.json()) as IgFeedResponse
  return {
    ...data,
    items: trimToGrid(Array.isArray(data.items) ? data.items : []),
  }
}
