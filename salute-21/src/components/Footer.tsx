import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { brand } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'
import { BrandLogo } from './BrandLogo'
import { InstagramIcon } from './icons'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-white/10 bg-[#14110e] px-5 py-12 text-white md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <BrandLogo tone="light" className="text-[2.85rem]" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">{t('footerTagline')}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-medium text-white/75">
          <Link to="/menu" className="transition hover:text-gold">
            {t('navMenu')}
          </Link>
          <Link to="/reserve" className="transition hover:text-gold">
            {t('navReserve')}
          </Link>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-gold"
          >
            <InstagramIcon className="size-4" />
            Instagram
          </a>
          <a
            href={`mailto:${brand.email}`}
            className="inline-flex items-center gap-2 transition hover:text-gold"
          >
            <Mail className="size-4" />
            E-mail
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Salute 21. {t('footerRights')}
        </p>
        <p>ul. Marcina Kasprzaka 24A · Warszawa Wola</p>
      </div>

      <div className="mx-auto mt-5 max-w-7xl text-center">
        <a
          href="https://brkmb.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[10px] font-medium tracking-[0.14em] text-white/40 uppercase transition hover:text-white/70"
        >
          Made with <span className="text-[11px] leading-none text-red-500" aria-hidden>❤️</span> by Baher Magally
        </a>
      </div>
    </footer>
  )
}
