import { Link, NavLink } from 'react-router-dom'
import { BookOpen, CalendarHeart, Menu, Star, UtensilsCrossed, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { brand } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'
import { BrandLogo } from './BrandLogo'
import { InstagramIcon } from './icons'
import { LanguageFlagToggle } from './LanguageFlagToggle'
import { OrderOnlineMenu } from './OrderOnlineMenu'

type NavItem = {
  to: string
  label: string
  icon?: ReactNode
}

export function Header({ variant = 'landing' }: { variant?: 'landing' | 'page' }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links: NavItem[] =
    variant === 'landing'
      ? [
          { to: '/#o-nas', label: t('navAbout') },
          {
            to: '/menu',
            label: t('navMenu'),
            icon: <BookOpen className="size-3.5" strokeWidth={1.85} aria-hidden />,
          },
          {
            to: '/reserve',
            label: t('navReserve'),
            icon: <CalendarHeart className="size-3.5" strokeWidth={1.85} aria-hidden />,
          },
          {
            to: '/#opinie',
            label: t('navReviews'),
            icon: <Star className="size-3.5" strokeWidth={1.85} aria-hidden />,
          },
        ]
      : [
          { to: '/', label: t('navHome') },
          {
            to: '/menu',
            label: t('navMenu'),
            icon: <BookOpen className="size-3.5" strokeWidth={1.85} aria-hidden />,
          },
          {
            to: '/reserve',
            label: t('navReserve'),
            icon: <CalendarHeart className="size-3.5" strokeWidth={1.85} aria-hidden />,
          },
          {
            to: '/#opinie',
            label: t('navReviews'),
            icon: <Star className="size-3.5" strokeWidth={1.85} aria-hidden />,
          },
        ]

  const solid = scrolled || open || variant === 'page'

  const linkClass = (active = false) =>
    `inline-flex items-center gap-1.5 text-[13px] font-semibold tracking-[0.08em] uppercase transition ${
      active ? 'text-white' : 'text-white/90 hover:text-white'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-[var(--site-banner-offset,0px)] z-50 transition-all duration-500 ${
        solid
          ? 'bg-ink/95 shadow-[0_1px_0_rgba(212,181,106,0.18)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:px-5 md:px-8 md:py-4">
        {/* On landing, hide nav logo over the hero (brand already lives there); show after scroll */}
        <Link
          to="/"
          className={`group min-w-0 shrink overflow-visible transition-opacity duration-500 ${
            variant === 'landing' && !solid
              ? 'pointer-events-none opacity-0'
              : 'opacity-100'
          }`}
          aria-label="Salute 21"
          aria-hidden={variant === 'landing' && !solid}
          tabIndex={variant === 'landing' && !solid ? -1 : undefined}
        >
          <BrandLogo tone="light" className="text-[2.05rem] sm:text-[2.25rem] md:text-[2.55rem]" />
        </Link>

        <nav className="hidden min-w-0 items-center gap-5 xl:gap-7 lg:flex" aria-label="Main">
          {links.map((link) =>
            link.to.startsWith('/#') ? (
              <a key={link.to} href={link.to} className={linkClass()}>
                {link.icon}
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => linkClass(isActive)}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5 md:gap-3">
          <LanguageFlagToggle solid={false} />

          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center text-white/85 transition hover:text-white"
            aria-label={`Instagram ${brand.instagramHandle}`}
          >
            <InstagramIcon className="size-6" />
          </a>

          <div className="hidden sm:block">
            <OrderOnlineMenu variant="header" />
          </div>

          <Link
            to="/reserve"
            className="hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-champagne md:inline-flex md:px-4 md:py-2.5"
          >
            <UtensilsCrossed className="size-4" strokeWidth={1.75} />
            {t('reserveCta')}
          </Link>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center text-white lg:hidden"
            aria-label={open ? 'Close' : 'Menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) =>
              link.to.startsWith('/#') ? (
                <a
                  key={link.to}
                  href={link.to}
                  className="inline-flex items-center gap-3 font-display text-3xl text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex items-center gap-3 font-display text-3xl text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ),
            )}
            <Link
              to="/reserve"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-ink"
            >
              <UtensilsCrossed className="size-4" strokeWidth={1.75} />
              {t('reserveCta')}
            </Link>
            <OrderOnlineMenu variant="mobile" onNavigate={() => setOpen(false)} />
            <a
              href={brand.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70"
              onClick={() => setOpen(false)}
            >
              <InstagramIcon className="size-5" />
              {brand.instagramHandle}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
