import type { IconType } from 'react-icons'
import { FaCarrot, FaLeaf, FaPepperHot } from 'react-icons/fa'

export type MenuDietTag = 'vegan' | 'vege' | 'spicy'

/**
 * Standard Font Awesome icons used across restaurants & food menus:
 * - Vegan → leaf
 * - Vegetarian → carrot
 * - Spicy → hot chili pepper (red)
 * Icons stand alone (no circle badges).
 */
const TAG_META: Record<MenuDietTag, { Icon: IconType; color: string }> = {
  vegan: {
    Icon: FaLeaf,
    color: 'text-[#2e7d32]',
  },
  vege: {
    Icon: FaCarrot,
    color: 'text-[#ef6c00]',
  },
  spicy: {
    Icon: FaPepperHot,
    color: 'text-[#d32f2f]',
  },
}

export function MenuDietBadge({
  tag,
  label,
}: {
  tag: MenuDietTag
  label: string
}) {
  const meta = TAG_META[tag]
  const Icon = meta.Icon
  return (
    <span
      className={`inline-flex items-center ${meta.color}`}
      title={label}
      aria-label={label}
    >
      <Icon className="size-3.5" aria-hidden />
    </span>
  )
}

export function MenuDietLegend({
  items,
}: {
  items: Array<{ tag: MenuDietTag; label: string; hint: string }>
}) {
  if (items.length === 0) return null

  return (
    <ul className="mt-2.5 grid gap-2">
      {items.map(({ tag, label, hint }) => {
        const meta = TAG_META[tag]
        const Icon = meta.Icon
        return (
          <li key={tag} className="flex items-center gap-2.5 text-[11px] leading-snug sm:text-[12px]">
            <span className={`inline-flex shrink-0 items-center ${meta.color}`} aria-hidden>
              <Icon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="font-semibold text-ink">{label}</span>
              <span className="text-muted"> — {hint}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
