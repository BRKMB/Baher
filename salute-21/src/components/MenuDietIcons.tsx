import type { IconType } from 'react-icons'
import { FaCarrot, FaLeaf, FaPepperHot } from 'react-icons/fa'

export type MenuDietTag = 'vegan' | 'vege' | 'spicy'

/**
 * Standard Font Awesome icons used across restaurants & food menus:
 * - Vegan → leaf
 * - Vegetarian → carrot
 * - Spicy → hot chili pepper (red)
 */
const TAG_META: Record<
  MenuDietTag,
  { Icon: IconType; color: string; ring: string; bg: string }
> = {
  vegan: {
    Icon: FaLeaf,
    color: 'text-[#2e7d32]',
    ring: 'border-[#2e7d32]/40',
    bg: 'bg-[#e8f5e9]',
  },
  vege: {
    Icon: FaCarrot,
    color: 'text-[#ef6c00]',
    ring: 'border-[#ef6c00]/40',
    bg: 'bg-[#fff3e0]',
  },
  spicy: {
    Icon: FaPepperHot,
    color: 'text-[#d32f2f]',
    ring: 'border-[#d32f2f]/45',
    bg: 'bg-[#fdecea]',
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
      className={`inline-flex size-[1.5rem] items-center justify-center rounded-full border ${meta.bg} ${meta.ring} ${meta.color}`}
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
  return (
    <ul className="mt-2.5 grid gap-2">
      {items.map(({ tag, label, hint }) => {
        const meta = TAG_META[tag]
        const Icon = meta.Icon
        return (
          <li key={tag} className="flex items-center gap-2.5 text-[11px] leading-snug sm:text-[12px]">
            <span
              className={`inline-flex size-[1.65rem] shrink-0 items-center justify-center rounded-full border ${meta.bg} ${meta.ring} ${meta.color}`}
              aria-hidden
            >
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
