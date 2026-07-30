import { Link, NavLink } from 'react-router-dom'
import { Menu, UtensilsCrossed, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { brand } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'
import { InstagramIcon } from './icons'

export function Header({ variant = 'landing' }: { variant?: 'landing' | 'page' }) {
  const { t, lang, setLang } = useI18n()
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
          ? 'bg-champagne/92 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link to="/" className="group flex items-center gap-3" aria-label="Salute 21">
          <img
            src="/images/logo.png"
            alt="Salute!"
            className={`h-10 w-auto transition duration-500 md:h-12 ${
              solid ? '' : 'brightness-0 invert'
            }`}
          />
          <span
            className={`hidden font-display text-sm tracking-[0.22em] uppercase sm:inline ${
              solid ? 'text-ink/60' : 'text-paper/70'
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
                className={`text-[13px] font-medium tracking-[0.08em] uppercase transition ${
                  solid ? 'text-ink/70 hover:text-ink' : 'text-paper/75 hover:text-paper'
                }`}
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-[13px] font-medium tracking-[0.08em] uppercase transition ${
                    solid
                      ? isActive
                        ? 'text-ink'
                        : 'text-ink/70 hover:text-ink'
                      : isActive
                        ? 'text-paper'
                        : 'text-paper/75 hover:text-paper'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <div
            className={`inline-flex items-center rounded-full p-1 text-xs font-bold tracking-wider ${
              solid ? 'border border-line bg-paper/80' : 'border border-paper/25 bg-ink/30'
            }`}
            role="group"
            aria-label={t('langLabel')}
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`rounded-full px-3 py-1.5 transition ${
                lang === 'en'
                  ? 'bg-amber text-ink'
                  : solid
                    ? 'text-ink/55 hover:text-ink'
                    : 'text-paper/70 hover:text-paper'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('pl')}
              className={`rounded-full px-3 py-1.5 transition ${
                lang === 'pl'
                  ? 'bg-amber text-ink'
                  : solid
                    ? 'text-ink/55 hover:text-ink'
                    : 'text-paper/70 hover:text-paper'
              }`}
            >
              PL
            </button>
          </div>

          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className={`hidden size-10 items-center justify-center rounded-full border transition sm:inline-flex ${
              solid
                ? 'border-line text-ink/70 hover:border-ink hover:text-ink'
                : 'border-paper/25 text-paper/80 hover:border-paper hover:text-paper'
            }`}
            aria-label="Instagram"
          >
            <InstagramIcon className="size-4" />
          </a>

          <Link
            to="/reserve"
            className={`hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition md:inline-flex ${
              solid
                ? 'bg-ink text-paper hover:bg-ink-soft'
                : 'bg-amber text-ink hover:bg-amber-deep hover:text-paper'
            }`}
          >
            <UtensilsCrossed className="size-4" strokeWidth={1.75} />
            {t('reserveCta')}
          </Link>

          <button
            type="button"
            className={`inline-flex size-10 items-center justify-center rounded-full border lg:hidden ${
              solid ? 'border-line text-ink' : 'border-paper/30 text-paper'
            }`}
            aria-label={open ? 'Close' : 'Menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
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
