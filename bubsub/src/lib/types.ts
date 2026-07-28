export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export type SubStatus = 'active' | 'trial' | 'paused' | 'cancelled'

export type Category =
  | 'entertainment'
  | 'productivity'
  | 'cloud'
  | 'ai'
  | 'gaming'
  | 'music'
  | 'video'
  | 'vpn'
  | 'finance'
  | 'education'
  | 'hosting'
  | 'domains'
  | 'health'
  | 'fitness'
  | 'utilities'
  | 'shopping'
  | 'news'
  | 'other'

export interface Subscription {
  id: string
  /** Optional link to a catalog service (cancellation guide). */
  serviceId?: string
  name: string
  color: string
  category: Category
  price: number
  currency: string
  cycle: BillingCycle
  /** ISO date (yyyy-mm-dd) of the next renewal/charge. */
  nextRenewal: string
  status: SubStatus
  autoRenew: boolean
  isTrial: boolean
  /** ISO date the free trial ends (only when isTrial). */
  trialEndsAt?: string
  paymentMethod?: string
  notes?: string
  tags: string[]
  /** Days before renewal to surface a reminder, e.g. [1, 3, 7]. */
  remindDaysBefore: number[]
  createdAt: string
  cancelledAt?: string
}

export type Difficulty = 1 | 2 | 3 | 4

export interface Alternative {
  name: string
  note: string
  free?: boolean
}

export interface ServiceGuide {
  id: string
  name: string
  domain: string
  color: string
  category: Category
  /** Typical monthly price in USD, used to prefill the add form. */
  typicalPrice?: number
  difficulty: Difficulty
  estMinutes: number
  cancelUrl: string
  steps: string[]
  issues: string[]
  altMethods: string[]
  supportUrl?: string
  alternatives: Alternative[]
  votes: { works: number; broken: number; outdated: number }
  verified: boolean
  lastVerified: string
  countryNotes: string[]
}

export type ThemePref = 'system' | 'light' | 'dark'

export interface Settings {
  theme: ThemePref
  currency: string
  /** User votes on guides: guideId -> vote kind. */
  guideVotes: Record<string, 'works' | 'broken' | 'outdated'>
}

export interface AppData {
  version: 1
  subscriptions: Subscription[]
  settings: Settings
}
