import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconChevronLeft } from './icons'
import { LOGOS } from '../lib/logos'

const SIZE = {
  sm: { box: 'w-9 h-9', pad: 'p-[6px]', text: 'text-[13px]', img: 'w-[70%] h-[70%]' },
  md: { box: 'w-12 h-12', pad: 'p-2', text: 'text-[17px]', img: 'w-[72%] h-[72%]' },
  lg: { box: 'w-[72px] h-[72px]', pad: 'p-[14px]', text: 'text-[28px]', img: 'w-[70%] h-[70%]' },
} as const

export function LogoTile({
  name,
  color,
  serviceId,
  size = 'md',
}: {
  name: string
  color: string
  serviceId?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const [failed, setFailed] = useState(false)
  const s = SIZE[size]
  const logo = serviceId ? LOGOS[serviceId] : undefined

  if (!logo || failed || !logo.src) {
    return (
      <div
        className={`${s.box} squircle flex items-center justify-center font-bold text-white shrink-0 select-none shadow-sm`}
        style={{ background: `linear-gradient(145deg, ${color}, ${color}bb)` }}
        aria-hidden
      >
        <span className={s.text}>{name.charAt(0).toUpperCase()}</span>
      </div>
    )
  }

  if (logo.kind === 'mark') {
    return (
      <div
        className={`${s.box} ${s.pad} squircle flex items-center justify-center shrink-0 shadow-sm`}
        style={{ background: `linear-gradient(145deg, ${logo.color}, ${logo.color}cc)` }}
        aria-hidden
      >
        <img
          src={logo.src}
          alt=""
          className={`${s.img} object-contain brightness-0 invert`}
          onError={() => setFailed(true)}
          draggable={false}
        />
      </div>
    )
  }

  return (
    <div
      className={`${s.box} squircle flex items-center justify-center shrink-0 overflow-hidden bg-white shadow-sm ring-1 ring-black/5 dark:ring-white/10`}
      aria-hidden
    >
      <img
        src={logo.src}
        alt=""
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
        draggable={false}
      />
    </div>
  )
}

export function Card({
  children,
  className = '',
  onClick,
  variant = 'glass',
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: 'glass' | 'soft' | 'strong' | 'dark'
}) {
  const Tag = onClick ? 'button' : 'div'
  const v =
    variant === 'dark'
      ? 'glass-dark'
      : variant === 'soft'
        ? 'glass-soft'
        : variant === 'strong'
          ? 'glass-strong'
          : 'glass'
  return (
    <Tag
      onClick={onClick}
      className={`block w-full text-left rounded-[26px] specular ${v} ${
        onClick ? 'active:scale-[0.985] transition-transform duration-150 cursor-pointer' : ''
      } ${className}`}
    >
      <div className="relative z-[1]">{children}</div>
    </Tag>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between px-1 mb-3 mt-7 first:mt-0">
      <h2 className="text-[15px] font-semibold tracking-tight text-ink-500 dark:text-ink-400 uppercase">
        {children}
      </h2>
      {action}
    </div>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'good' | 'warn' | 'danger' | 'info'
}) {
  const tones = {
    neutral: 'bg-ink-900/8 text-ink-600 dark:bg-white/10 dark:text-ink-200',
    good: 'bg-mint-500/15 text-mint-700 dark:bg-mint-400/20 dark:text-mint-300',
    warn: 'bg-amber-500/15 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300',
    danger: 'bg-red-500/15 text-red-700 dark:bg-red-400/20 dark:text-red-300',
    info: 'bg-sky-500/15 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  )
}

export function PageHeader({
  title,
  back,
  action,
  subtitle,
}: {
  title: string
  back?: boolean
  action?: ReactNode
  subtitle?: string
}) {
  const navigate = useNavigate()
  return (
    <header
      className="sticky top-0 z-30 glass-soft border-b border-white/30 dark:border-white/5"
      style={{ paddingTop: 'var(--sat, 0px)' }}
    >
      <div className="flex items-center gap-2 px-5 h-[56px]">
        {back && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="-ml-1 w-9 h-9 rounded-full glass flex items-center justify-center text-mint-600 dark:text-mint-400"
          >
            <IconChevronLeft className="w-5 h-5" strokeWidth={2.4} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-[24px] font-bold tracking-tight text-ink-900 dark:text-ink-50 truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[12px] text-ink-500 dark:text-ink-400 truncate">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  )
}

export function EmptyState({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="text-center py-14 px-8">
      <div className="text-[44px] mb-3">{emoji}</div>
      <h3 className="text-[17px] font-semibold text-ink-900 dark:text-ink-50 mb-1">{title}</h3>
      <p className="text-[14px] leading-relaxed text-ink-500 dark:text-ink-400">{text}</p>
    </div>
  )
}
