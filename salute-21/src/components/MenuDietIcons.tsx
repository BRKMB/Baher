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
  compact = false,
}: {
  items: Array<{ tag: MenuDietTag; label: string; hint: string }>
  compact?: boolean
}) {
  if (items.length === 0) return null

  return (
    <ul
      className={`grid grid-cols-3 ${
        compact ? 'mt-1.5 gap-1.5 sm:mt-2.5 sm:gap-3' : 'mt-2.5 gap-2 sm:gap-3'
      }`}
    >
      {items.map(({ tag, label, hint }) => {
        const meta = TAG_META[tag]
        const Icon = meta.Icon
        return (
          <li key={tag} className="flex min-w-0 flex-col items-center text-center">
            <span className={`inline-flex items-center ${meta.color}`} aria-hidden>
              <Icon className={compact ? 'size-4 sm:size-5' : 'size-5'} />
            </span>
            <span
              className={`font-semibold leading-tight text-ink ${
                compact
                  ? 'mt-1 text-[10px] sm:mt-1.5 sm:text-[12px]'
                  : 'mt-1.5 text-[11px] sm:text-[12px]'
              }`}
            >
              {label}
            </span>
            <span
              className={`leading-snug text-muted ${
                compact
                  ? 'mt-0.5 text-[8px] sm:text-[10px]'
                  : 'mt-0.5 text-[9px] sm:text-[10px]'
              }`}
            >
              {hint}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
