import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconChevronLeft } from './icons'

export function LogoTile({
  name,
  color,
  size = 'md',
}: {
  name: string
  color: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const cls =
    size === 'sm'
      ? 'w-9 h-9 text-[15px] rounded-xl'
      : size === 'lg'
        ? 'w-16 h-16 text-[28px] rounded-[22px]'
        : 'w-12 h-12 text-[20px] rounded-2xl'
  return (
    <div
      className={`${cls} flex items-center justify-center font-bold text-white shrink-0 select-none`}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
      aria-hidden
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export function Card({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={`block w-full text-left bg-white dark:bg-ink-900 rounded-3xl shadow-card dark:shadow-card-dark border border-ink-100/60 dark:border-ink-800/60 ${onClick ? 'active:scale-[0.98] transition-transform duration-150 cursor-pointer' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between px-1 mb-3 mt-7 first:mt-0">
      <h2 className="text-[17px] font-semibold tracking-tight text-ink-900 dark:text-ink-50">{children}</h2>
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
    neutral: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
    good: 'bg-mint-100 text-mint-700 dark:bg-mint-700/25 dark:text-mint-300',
    warn: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
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
    <header className="sticky top-0 z-30 bg-ink-50/85 dark:bg-ink-950/85 backdrop-blur-xl" style={{ paddingTop: 'var(--sat, 0px)' }}>
      <div className="flex items-center gap-2 px-5 h-[52px]">
        {back && (
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="-ml-2 p-1.5 rounded-full text-mint-600 dark:text-mint-400 active:bg-ink-100 dark:active:bg-ink-800"
          >
            <IconChevronLeft className="w-6 h-6" strokeWidth={2.2} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-[22px] font-bold tracking-tight text-ink-900 dark:text-ink-50 truncate">{title}</h1>
          {subtitle && <p className="text-[12px] text-ink-500 dark:text-ink-400 -mt-0.5 truncate">{subtitle}</p>}
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
