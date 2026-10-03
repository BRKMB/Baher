import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, ShoppingBag } from 'lucide-react'
import { brand } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'

type Variant = 'header' | 'menu' | 'footer' | 'contact' | 'mobile'

const partners = [
  { key: 'uberEats' as const, labelKey: 'orderUberEats' as const, href: () => brand.orderOnline.uberEats },
  { key: 'glovo' as const, labelKey: 'orderGlovo' as const, href: () => brand.orderOnline.glovo },
]

export function OrderOnlineMenu({
  variant = 'header',
  onNavigate,
}: {
  variant?: Variant
  onNavigate?: () => void
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const triggerClass =
    variant === 'header'
      ? 'inline-flex items-center gap-1.5 rounded-full border border-white/35 bg-white/10 px-3 py-2 text-xs font-semibold tracking-wide text-white transition hover:border-white hover:bg-white/18 sm:px-3.5 sm:text-sm'
      : variant === 'menu'
        ? 'inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-white transition hover:border-gold/60 hover:text-gold sm:px-3 sm:py-2 sm:text-xs'
        : variant === 'footer'
          ? 'inline-flex items-center gap-2 transition hover:text-gold'
          : variant === 'contact'
            ? 'inline-flex items-center gap-3 transition hover:text-gold'
            : 'inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white'

  const panelClass =
    variant === 'footer' || variant === 'contact'
      ? 'absolute bottom-full left-0 z-50 mb-2 min-w-[11.5rem] overflow-hidden rounded-xl border border-white/15 bg-[#1a1612] py-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)]'
      : variant === 'mobile'
        ? 'mt-2 w-full overflow-hidden rounded-xl border border-white/15 bg-white/5 py-1'
        : 'absolute right-0 top-full z-50 mt-2 min-w-[11.5rem] overflow-hidden rounded-xl border border-white/15 bg-[#1a1612] py-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)]'

  const linkClass =
    'flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white'

  return (
    <div ref={rootRef} className={`relative ${variant === 'mobile' ? 'w-full' : ''}`}>
      <button
        type="button"
        className={triggerClass}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        {(variant === 'header' || variant === 'menu' || variant === 'mobile') && (
          <ShoppingBag className={variant === 'menu' ? 'size-3.5' : 'size-4'} strokeWidth={1.75} />
        )}
        {(variant === 'footer' || variant === 'contact') && (
          <ShoppingBag className={variant === 'contact' ? 'size-5 shrink-0 text-gold' : 'size-4'} strokeWidth={1.75} />
        )}
        <span>{t('orderOnline')}</span>
        <ChevronDown
          className={`size-3.5 opacity-80 transition ${open ? 'rotate-180' : ''} ${variant === 'menu' ? 'size-3' : ''}`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div id={menuId} role="menu" className={panelClass}>
          {partners.map((p) => (
            <a
              key={p.key}
              role="menuitem"
              href={p.href()}
              target="_blank"
              rel="noreferrer"
              className={linkClass}
              onClick={() => {
                setOpen(false)
                onNavigate?.()
              }}
            >
              {t(p.labelKey)}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
