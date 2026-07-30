import {
  Clock3,
  MapPin,
  Menu,
  Phone,
  UtensilsCrossed,
  Wine,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { brand } from '../data/content'
import { InstagramIcon } from './icons'

const links = [
  { href: '#o-nas', label: 'O nas' },
  { href: '#menu', label: 'Menu' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#rezerwacja', label: 'Rezerwacja' },
  { href: '#kontakt', label: 'Kontakt' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'bg-paper/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <a href="#top" className="group flex items-center gap-3" aria-label="Salute 21 — strona główna">
          <img
            src="/images/logo.png"
            alt="Salute!"
            className="h-10 w-auto transition-transform duration-500 group-hover:scale-[1.02] md:h-12"
          />
          <span className="hidden font-display text-sm tracking-[0.18em] text-ink/70 uppercase sm:inline">
            21
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Główne">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-ink/75 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line/80 text-ink/80 transition hover:border-ink hover:text-ink"
            aria-label="Instagram Salute 21"
          >
            <InstagramIcon className="size-4" />
          </a>
          <a
            href="#rezerwacja"
            className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-ink-soft sm:inline-flex"
          >
            <UtensilsCrossed className="size-4" strokeWidth={1.75} />
            Zarezerwuj
          </a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line lg:hidden"
            aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobilne">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-display text-2xl text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-line pt-4 text-sm text-muted">
              <a href={brand.phoneHref} className="inline-flex items-center gap-2 hover:text-ink">
                <Phone className="size-4" />
                {brand.phone}
              </a>
              <a
                href={brand.address.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-ink"
              >
                <MapPin className="size-4" />
                {brand.address.street}
              </a>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="size-4" />
                Dziś otwarte — zobacz godziny
              </span>
              <span className="inline-flex items-center gap-2">
                <Wine className="size-4" />
                Bar · kuchnia · wino
              </span>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
