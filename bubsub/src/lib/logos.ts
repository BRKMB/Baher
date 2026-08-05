/**
 * Local brand logo registry — files live in /public/logos.
 * Prefer crisp SVG brand marks on the official brand color when the
 * raster asset is low-res; otherwise show the full-color logo photo.
 */

export type LogoKind = 'photo' | 'mark'

export interface LogoSpec {
  /** Path under /public */
  src: string
  kind: LogoKind
  /** Background for mark-style icons; also used as fallback tile color. */
  color: string
}

const MARK = (id: string, color: string): LogoSpec => ({
  src: `/logos/svg/${id}.svg`,
  kind: 'mark',
  color,
})

const PHOTO = (file: string, color: string): LogoSpec => ({
  src: `/logos/${file}`,
  kind: 'photo',
  color,
})

export const LOGOS: Record<string, LogoSpec> = {
  netflix: MARK('netflix', '#E50914'),
  spotify: MARK('spotify', '#1DB954'),
  'adobe-cc': MARK('adobe-cc', '#FF0000'),
  'chatgpt-plus': MARK('chatgpt-plus', '#10A37F'),
  'canva-pro': PHOTO('canva-pro.png', '#8B3DFF'),
  'youtube-premium': MARK('youtube-premium', '#FF0000'),
  'disney-plus': PHOTO('disney-plus.png', '#0E47BA'),
  'amazon-prime': MARK('amazon-prime', '#232F3E'),
  'apple-subscriptions': MARK('apple-subscriptions', '#000000'),
  'icloud-plus': PHOTO('icloud-plus.png', '#3693F3'),
  'google-one': PHOTO('google-one.png', '#4285F4'),
  dropbox: MARK('dropbox', '#0061FF'),
  'xbox-game-pass': PHOTO('xbox-game-pass.png', '#107C10'),
  'playstation-plus': PHOTO('playstation-plus.jpg', '#00439C'),
  'microsoft-365': PHOTO('microsoft-365.png', '#D83B01'),
  notion: PHOTO('notion.png', '#191919'),
  figma: PHOTO('figma.png', '#A259FF'),
  nordvpn: PHOTO('nordvpn.png', '#4687FF'),
  'linkedin-premium': MARK('linkedin-premium', '#0A66C2'),
  duolingo: PHOTO('duolingo.png', '#58CC02'),
  anghami: PHOTO('anghami.png', '#7D00FF'),
  'shahid-vip': PHOTO('shahid-vip.png', '#00C2A8'),
  crunchyroll: PHOTO('crunchyroll.png', '#F47521'),
}

export function resolveLogo(serviceId?: string, color?: string, name?: string): LogoSpec | null {
  if (serviceId && LOGOS[serviceId]) return LOGOS[serviceId]
  if (color) return { src: '', kind: 'mark', color }
  if (name) return { src: '', kind: 'mark', color: '#71747f' }
  return null
}
