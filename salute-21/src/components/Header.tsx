import { Link, NavLink } from 'react-router-dom'
import { Menu, UtensilsCrossed, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { brand } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'
import { BrandLogo } from './BrandLogo'
import { InstagramIcon } from './icons'
import { LanguageFlagToggle } from './LanguageFlagToggle'

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

  const solid = variant === 'page' || scrolled || open

  const links =
    variant === 'landing'
      ? [
          { to: '/#o-nas', label: t('navAbout') },
          { to: '/menu', label: t('navMenu') },
          { to: '/reserve', label: t('navReserve') },
          { to: '/#kontakt', label: t('navContact') },
        ]
      : [
          { to: '/', label: t('navHome') },
          { to: '/menu', label: t('navMenu') },
          { to: '/reserve', label: t('navReserve') },
        ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? 'bg-champagne/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md'
          : 'bg-gradient-to-b from-ink/55 via-ink/20 to-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label="Salute 21">
          <BrandLogo tone={solid ? 'dark' : 'light'} className="h-10 w-auto md:h-12" />
          <span
            className={`hidden font-display text-sm tracking-[0.22em] uppercase sm:inline ${
              solid ? 'text-ink' : 'text-white'
            }`}
          >
            21
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {links.map((link) =>
            link.to.startsWith('/#') ? (
              <a
                key={link.to}
                href={link.to}
                className={`text-[13px] font-semibold tracking-[0.08em] uppercase transition ${
                  solid ? 'text-ink/85 hover:text-ink' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-[13px] font-semibold tracking-[0.08em] uppercase transition ${
                    solid
                      ? isActive
                        ? 'text-ink'
                        : 'text-ink/85 hover:text-ink'
                      : isActive
                        ? 'text-white'
                        : 'text-white/90 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <LanguageFlagToggle solid={solid} />

          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className={`hidden items-center justify-center transition sm:inline-flex ${
              solid ? 'text-ink/80 hover:text-ink' : 'text-white/85 hover:text-white'
            }`}
            aria-label="Instagram"
          >
            <InstagramIcon className="size-5" />
          </a>

          <Link
            to="/reserve"
            className={`hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition md:inline-flex ${
              solid
                ? 'bg-ink text-white hover:bg-ink-soft'
                : 'bg-white text-ink hover:bg-champagne'
            }`}
          >
            <UtensilsCrossed className="size-4" strokeWidth={1.75} />
            {t('reserveCta')}
          </Link>

          <button
            type="button"
            className={`inline-flex items-center justify-center lg:hidden ${
              solid ? 'text-ink' : 'text-white'
            }`}
            aria-label={open ? 'Close' : 'Menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-champagne px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) =>
              link.to.startsWith('/#') ? (
                <a
                  key={link.to}
                  href={link.to}
                  className="font-display text-3xl text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-display text-3xl text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
