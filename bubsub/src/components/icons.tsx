interface IconProps {
  className?: string
  strokeWidth?: number
}

function base(props: IconProps) {
  return {
    className: props.className ?? 'w-6 h-6',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: props.strokeWidth ?? 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  }
}

export function IconHome(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5Z" />
      <path d="M9.5 20.5v-6h5v6" />
    </svg>
  )
}

export function IconChart(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M4 20h16" />
      <path d="M7 16v-5" />
      <path d="M12 16V7" />
      <path d="M17 16v-8" />
    </svg>
  )
}

export function IconPlus(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconScissors(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="6" cy="17" r="2.5" />
      <path d="M8.2 8.5 20 18M8.2 15.5 20 6" />
    </svg>
  )
}

export function IconCalendar(p: IconProps) {
  return (
    <svg {...base(p)}>
      <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
      <path d="M4 10h16M8.5 3.5v3M15.5 3.5v3" />
    </svg>
  )
}

export function IconGear(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4.5v2M12 17.5v2M19.5 12h-2M6.5 12h-2M17.3 6.7l-1.4 1.4M8.1 15.9l-1.4 1.4M17.3 17.3l-1.4-1.4M8.1 8.1 6.7 6.7" />
    </svg>
  )
}

export function IconBell(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M18 16H6c1.2-1.2 1.5-2.6 1.5-4.5V10a4.5 4.5 0 0 1 9 0v1.5c0 1.9.3 3.3 1.5 4.5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function IconChevronRight(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

export function IconChevronLeft(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m15 5-7 7 7 7" />
    </svg>
  )
}

export function IconSearch(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  )
}

export function IconX(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function IconCheck(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

export function IconExternal(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M14 5h5v5" />
      <path d="M19 5 10.5 13.5" />
      <path d="M19 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18V7a1.5 1.5 0 0 1 1.5-1.5H10" />
    </svg>
  )
}

export function IconTrash(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M5 7h14M10 7V5.5A1.5 1.5 0 0 1 11.5 4h1A1.5 1.5 0 0 1 14 5.5V7M8 7l.7 12a1.5 1.5 0 0 0 1.5 1.4h3.6a1.5 1.5 0 0 0 1.5-1.4L16 7" />
    </svg>
  )
}

export function IconPencil(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M15.5 5.5 18.5 8.5 8 19l-4 1 1-4L15.5 5.5Z" />
    </svg>
  )
}

export function IconDownload(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4v11M7.5 11 12 15.5 16.5 11M5 19.5h14" />
    </svg>
  )
}

export function IconUpload(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 19.5h14" />
    </svg>
  )
}

export function IconShield(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 3.5 19 6v5.5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-2.5Z" />
      <path d="m9 11.5 2.2 2.2L15.5 9.5" />
    </svg>
  )
}

export function IconWarning(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4 21 19.5H3L12 4Z" />
      <path d="M12 10v4M12 16.8v.4" />
    </svg>
  )
}

export function IconSparkle(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M12 4c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6Z" />
      <path d="M18.5 14.5c.3 1.6 1 2.4 2.5 2.7-1.5.3-2.2 1.1-2.5 2.7-.3-1.6-1-2.4-2.5-2.7 1.5-.3 2.2-1.1 2.5-2.7Z" />
    </svg>
  )
}

export function IconClock(p: IconProps) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 1.8" />
    </svg>
  )
}

export function IconThumbUp(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M7 11v9H4.5A1.5 1.5 0 0 1 3 18.5v-6A1.5 1.5 0 0 1 4.5 11H7Zm0 0 4-7c1.3 0 2.5 1 2.5 2.5V10h5A1.5 1.5 0 0 1 20 11.8l-1.5 6.5a2 2 0 0 1-2 1.7H7" />
    </svg>
  )
}

export function IconThumbDown(p: IconProps) {
  return (
    <svg {...base(p)}>
      <path d="M17 13V4h2.5A1.5 1.5 0 0 1 21 5.5v6a1.5 1.5 0 0 1-1.5 1.5H17Zm0 0-4 7c-1.3 0-2.5-1-2.5-2.5V14h-5A1.5 1.5 0 0 1 4 12.2l1.5-6.5a2 2 0 0 1 2-1.7H17" />
    </svg>
  )
}
