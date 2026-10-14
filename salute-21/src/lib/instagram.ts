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

/** Prefer a full 5×2 (10) Instagram-style grid. */
export function trimToGrid(items: IgFeedItem[], max = 10): IgFeedItem[] {
  const capped = items.slice(0, max)
  if (capped.length >= 10) return capped.slice(0, 10)
  return capped
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
