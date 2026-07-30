import { Mail, Phone } from 'lucide-react'
import { brand } from '../data/content'
import { InstagramIcon } from './icons'

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-12 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <img src="/images/logo.png" alt="Salute!" className="h-12 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Salute 21 — bar i restauracja w Warszawie. {brand.tagline}.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-ink/75">
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-ink"
          >
            <InstagramIcon className="size-4" />
            Instagram
          </a>
          <a href={brand.phoneHref} className="inline-flex items-center gap-2 transition hover:text-ink">
            <Phone className="size-4" />
            Rezerwacje
          </a>
          <a
            href={`mailto:${brand.email}`}
            className="inline-flex items-center gap-2 transition hover:text-ink"
          >
            <Mail className="size-4" />
            E-mail
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Salute 21. Wszelkie prawa zastrzeżone.</p>
        <p>ul. Marcina Kasprzaka 24A · Warszawa Wola</p>
      </div>
    </footer>
  )
}
