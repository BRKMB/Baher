import { Carrot, Flame, Vegan, type LucideIcon } from 'lucide-react'

export type MenuDietTag = 'vegan' | 'vege' | 'spicy'

const TAG_META: Record<MenuDietTag, { Icon: LucideIcon; color: string; ring: string }> = {
  vegan: { Icon: Vegan, color: 'text-olive', ring: 'border-olive/35' },
  vege: { Icon: Carrot, color: 'text-amber-deep', ring: 'border-amber/45' },
  spicy: { Icon: Flame, color: 'text-red-700', ring: 'border-red-700/35' },
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
      className={`inline-flex size-[1.4rem] items-center justify-center rounded-full border bg-white/80 ${meta.ring} ${meta.color}`}
      title={label}
      aria-label={label}
    >
      <Icon className="size-3.5" strokeWidth={2} aria-hidden />
    </span>
  )
}

export function MenuDietLegend({
  items,
}: {
  items: Array<{ tag: MenuDietTag; label: string; hint: string }>
}) {
  return (
    <ul className="mt-2 grid gap-1.5">
      {items.map(({ tag, label, hint }) => {
        const meta = TAG_META[tag]
        const Icon = meta.Icon
        return (
          <li key={tag} className="flex items-center gap-2 text-[11px] leading-snug sm:text-[12px]">
            <span
              className={`inline-flex size-[1.4rem] shrink-0 items-center justify-center rounded-full border bg-white/90 ${meta.ring} ${meta.color}`}
              aria-hidden
            >
              <Icon className="size-3.5" strokeWidth={2} />
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
