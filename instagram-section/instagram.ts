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

export function trimToGrid(items: IgFeedItem[], max = 10): IgFeedItem[] {
  return items.slice(0, max)
}

export async function fetchInstagramFeed(apiPath = '/api/instagram'): Promise<IgFeedResponse> {
  const res = await fetch(apiPath, {
    headers: { accept: 'application/json' },
  })
  const data = (await res.json()) as IgFeedResponse
  return {
    ...data,
    items: trimToGrid(Array.isArray(data.items) ? data.items : []),
  }
}
