export type IgFeedItem = {
  id: string
  type: 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'REEL'
  imageUrl: string
  videoUrl?: string
  permalink: string
  caption: string
  timestamp: string | null
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

/** Keep the gallery a perfect 3-column grid */
export function trimToTriple(items: IgFeedItem[], max = 12): IgFeedItem[] {
  const capped = items.slice(0, max)
  const n = Math.floor(capped.length / 3) * 3
  return capped.slice(0, n)
}

export async function fetchInstagramFeed(): Promise<IgFeedResponse> {
  const res = await fetch('/api/instagram', {
    headers: { accept: 'application/json' },
  })
  const data = (await res.json()) as IgFeedResponse
  return {
    ...data,
    items: trimToTriple(Array.isArray(data.items) ? data.items : []),
  }
}
