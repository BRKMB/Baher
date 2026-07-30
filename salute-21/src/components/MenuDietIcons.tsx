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
    <ul className="mt-2.5 grid grid-cols-3 gap-2 sm:gap-3">
      {items.map(({ tag, label, hint }) => {
        const meta = TAG_META[tag]
        const Icon = meta.Icon
        return (
          <li key={tag} className="flex min-w-0 flex-col items-center text-center">
            <span className={`inline-flex items-center ${meta.color}`} aria-hidden>
              <Icon className="size-5" />
            </span>
            <span className="mt-1.5 text-[11px] font-semibold leading-tight text-ink sm:text-[12px]">
              {label}
            </span>
            <span className="mt-0.5 text-[9px] leading-snug text-muted sm:text-[10px]">
              {hint}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
