import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { brand } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'
import { BrandLogo } from './BrandLogo'
import { InstagramIcon } from './icons'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="border-t border-line bg-champagne px-5 py-12 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <BrandLogo tone="dark" className="text-[2.85rem]" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/70">{t('footerTagline')}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-medium text-ink/80">
          <Link to="/menu" className="transition hover:text-ink">
            {t('navMenu')}
          </Link>
          <Link to="/reserve" className="transition hover:text-ink">
            {t('navReserve')}
          </Link>
          <a
            href={brand.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-ink"
          >
            <InstagramIcon className="size-4" />
            Instagram
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

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-line pt-6 text-xs text-ink/60 sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} Salute 21. {t('footerRights')}
        </p>
        <p>ul. Marcina Kasprzaka 24A · Warszawa Wola</p>
      </div>
    </footer>
  )
}
