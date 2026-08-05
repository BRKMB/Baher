import type { Category } from './types'

export const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { id: 'productivity', label: 'Productivity', emoji: '⚡️' },
  { id: 'cloud', label: 'Cloud Storage', emoji: '☁️' },
  { id: 'ai', label: 'AI', emoji: '🤖' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'video', label: 'Video', emoji: '📺' },
  { id: 'vpn', label: 'VPN', emoji: '🛡️' },
  { id: 'finance', label: 'Finance', emoji: '💳' },
  { id: 'education', label: 'Education', emoji: '📚' },
  { id: 'hosting', label: 'Hosting', emoji: '🖥️' },
  { id: 'domains', label: 'Domains', emoji: '🌐' },
  { id: 'health', label: 'Health', emoji: '❤️' },
  { id: 'fitness', label: 'Fitness', emoji: '🏋️' },
  { id: 'utilities', label: 'Utilities', emoji: '🔧' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'news', label: 'News', emoji: '📰' },
  { id: 'other', label: 'Other', emoji: '📦' },
]

export function categoryLabel(id: Category): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? 'Other'
}

export function categoryEmoji(id: Category): string {
  return CATEGORIES.find((c) => c.id === id)?.emoji ?? '📦'
}
