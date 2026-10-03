export type LiveGoogleReview = {
  id: string
  name: string
  rating: number
  /** Exact guest text from Google Maps — never invented or translated. */
  text: string
  relativeTime?: string
  photos: string[]
  authorPhoto?: string
  mapsUrl?: string
}

export type LiveReviewsResponse = {
  ok: boolean
  configured: boolean
  source: string
  fetchedAt: number | null
  rating: number | null
  reviewCount: number | null
  count: number
  items: LiveGoogleReview[]
  mapsUrl: string
  error?: string
  reason?: string
}

export async function fetchLiveReviews(): Promise<LiveReviewsResponse> {
  const res = await fetch('/api/reviews', {
    headers: { accept: 'application/json' },
  })
  const data = (await res.json()) as LiveReviewsResponse
  const items = Array.isArray(data.items)
    ? data.items.filter(
        (item) =>
          item &&
          Number(item.rating) >= 5 &&
          typeof item.text === 'string' &&
          item.text.trim().length > 0 &&
          Array.isArray(item.photos) &&
          item.photos.length > 0,
      )
    : []

  return {
    ...data,
    items,
    count: items.length,
  }
}
