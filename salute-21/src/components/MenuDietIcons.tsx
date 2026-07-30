export type MenuDietTag = 'vegan' | 'vege' | 'spicy'

type IconProps = {
  className?: string
  title?: string
}

/** Leaf sprout — vegan */
export function IconVegan({ className = 'size-3.5', title = 'Vegan' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path d="M12 21V11" />
      <path d="M12 14c-4.2-.2-7.5-2.4-8.8-6.2 4.5-.4 7.6 1 8.8 4.2" />
      <path d="M12 14c4.2-.2 7.5-2.4 8.8-6.2-4.5-.4-7.6 1-8.8 4.2" />
      <path d="M9.5 8.5c1.2-2.6 3-4.2 5.5-5.2-1.1 3.1-1.2 5.2-.8 7.2" />
    </svg>
  )
}

/** Carrot — vegetarian */
export function IconVege({ className = 'size-3.5', title = 'Vegetarian' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path d="M12.5 7.2c1.8-2.4 4.4-3.4 6.8-3.2-.2 2.5-1.4 5-3.8 6.7" />
      <path d="M11.6 7.8c-2.4-1.7-3.8-4.2-4-6.7 2.4-.1 5 1 6.7 3.4" />
      <path d="M10.2 9.2c-3.4 3.5-5.4 8.2-4.2 11.2 3.1 1 7.4-.8 10.8-4.3 1.6-1.6 2.6-3.4 2.8-5.1-2 .1-4.2-.5-6.2-1.8-.9-.6-2-1.1-3.2-1.2z" />
    </svg>
  )
}

/** Chili — spicy */
export function IconSpicy({ className = 'size-3.5', title = 'Spicy' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path d="M14.2 4.8c.4 1.4-.2 2.6-1.4 3.4" />
      <path d="M12.8 8.2c-3.8.4-6.6 3.4-7 7.1-.3 3.2 1.6 5.9 4.4 6.5 3.4.7 6.8-1.6 8.2-5.2 1.6-4.1.2-8.3-3.4-9.4-1-.3-1.8-.1-2.2 1z" />
      <path d="M10.8 12.2c.8 1.6 2.2 2.7 3.9 3.1" />
    </svg>
  )
}

const TAG_META: Record<MenuDietTag, { Icon: typeof IconVegan; color: string; ring: string }> = {
  vegan: { Icon: IconVegan, color: 'text-olive', ring: 'border-olive/30' },
  vege: { Icon: IconVege, color: 'text-amber-deep', ring: 'border-amber/40' },
  spicy: { Icon: IconSpicy, color: 'text-red-800', ring: 'border-red-800/30' },
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
      className={`inline-flex size-[1.35rem] items-center justify-center rounded-full border bg-white/70 ${meta.ring} ${meta.color}`}
      title={label}
    >
      <Icon className="size-3.5" title={label} />
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
              className={`inline-flex size-[1.35rem] shrink-0 items-center justify-center rounded-full border bg-white/80 ${meta.ring} ${meta.color}`}
            >
              <Icon className="size-3.5" title={label} />
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
