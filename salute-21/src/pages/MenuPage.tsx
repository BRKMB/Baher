import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react'
import { Link } from 'react-router-dom'
import HTMLFlipBook from 'react-pageflip'
import { QRCodeSVG } from 'qrcode.react'
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react'
import { BrandLogo } from '../components/BrandLogo'
import { LanguageFlagToggle } from '../components/LanguageFlagToggle'
import { brand, menu, type MenuCategory } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

const catTitle: Record<MenuCategory['id'], TranslationKey> = {
  special: 'cat_special',
  vege: 'cat_vege',
  meat: 'cat_meat',
  seafood: 'cat_seafood',
  sliders: 'cat_sliders',
  cocktails: 'cat_cocktails',
  desserts: 'cat_desserts',
}

const catSub: Record<MenuCategory['id'], TranslationKey> = {
  special: 'cat_special_sub',
  vege: 'cat_vege_sub',
  meat: 'cat_meat_sub',
  seafood: 'cat_seafood_sub',
  sliders: 'cat_sliders_sub',
  cocktails: 'cat_cocktails_sub',
  desserts: 'cat_desserts_sub',
}

type FlipApi = {
  pageFlip: () => {
    flipNext: () => void
    flipPrev: () => void
    getCurrentPageIndex: () => number
    getPageCount: () => number
  }
}

type PageProps = {
  children?: ReactNode
  className?: string
}

const BookPage = forwardRef<HTMLDivElement, PageProps>(function BookPage(
  { children, className = '' },
  ref,
) {
  return (
    <div ref={ref} className={`menu-book-page h-full w-full ${className}`}>
      {children}
    </div>
  )
})

function PageEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.32em] text-amber uppercase">{children}</p>
  )
}

function PageTitle({ children }: { children: ReactNode }) {
  return <h2 className="mt-2 font-display text-[2.35rem] leading-[1.05] text-ink italic md:text-5xl">{children}</h2>
}

function PageRule() {
  return <div className="my-5 h-px w-14 bg-amber/55" />
}

/** Cover left — brand face of the menu */
const CoverLeft = forwardRef<HTMLDivElement>(function CoverLeft(_props, ref) {
  const { t } = useI18n()
  return (
    <BookPage ref={ref} className="relative">
      <img
        src="/images/menu-special.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612] via-[#1a1612]/55 to-[#1a1612]/25" />
      <div className="relative flex h-full flex-col justify-between p-8 text-white md:p-10">
        <div>
          <BrandLogo tone="light" className="h-11 w-auto opacity-95" />
          <p className="mt-5 text-[10px] font-semibold tracking-[0.34em] text-gold uppercase">
            {t('brandTag')}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.34em] text-gold uppercase">
            {t('menuPageEyebrow')}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-white italic md:text-6xl">
            {t('menuPageTitle')}
          </h1>
          <div className="mt-6 h-px w-14 bg-gold/70" />
          <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-white/80">
            {t('menuBookHint')}
          </p>
        </div>
      </div>
    </BookPage>
  )
})

/** Cover right — about the place, hours, contents */
const CoverRight = forwardRef<HTMLDivElement>(function CoverRight(_props, ref) {
  const { t } = useI18n()
  const hours = [
    { day: t('dayMonThu'), time: '12:00 – 22:00' },
    { day: t('dayFri'), time: '12:00 – 24:00' },
    { day: t('daySat'), time: '10:00 – 24:00' },
    { day: t('daySun'), time: '10:00 – 22:00' },
  ]

  return (
    <BookPage ref={ref} className="flex flex-col p-8 md:p-10">
      <PageEyebrow>{t('menuCoverWelcome')}</PageEyebrow>
      <PageTitle>{brand.name}</PageTitle>
      <PageRule />
      <p className="text-[15px] leading-relaxed text-muted">{t('menuCoverAbout')}</p>

      <div className="mt-7">
        <p className="text-[10px] font-semibold tracking-[0.28em] text-amber uppercase">
          {t('menuCoverVisit')}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          {brand.address.street}
          <br />
          {brand.address.district}, {brand.address.city}
        </p>
        <p className="mt-2 text-sm text-muted">{brand.instagramHandle}</p>
        <p className="text-sm text-muted">{brand.email}</p>
      </div>

      <div className="mt-7">
        <p className="text-[10px] font-semibold tracking-[0.28em] text-amber uppercase">
          {t('menuCoverHours')}
        </p>
        <ul className="mt-3 space-y-2">
          {hours.map((row) => (
            <li key={row.day} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-muted">{row.day}</span>
              <span className="font-display text-base text-ink tabular-nums">{row.time}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto border-t border-line/70 pt-5">
        <p className="text-[10px] font-semibold tracking-[0.28em] text-amber uppercase">
          {t('menuCoverContents')}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          {menu.map((c) => t(catTitle[c.id])).join(' · ')}
        </p>
        <p className="mt-3 text-xs leading-relaxed text-muted">{t('menuPageIntro')}</p>
      </div>
    </BookPage>
  )
})

const CategoryImagePage = forwardRef<HTMLDivElement, { category: MenuCategory; index: number }>(
  function CategoryImagePage({ category, index }, ref) {
    const { t } = useI18n()
    return (
      <BookPage ref={ref} className="relative">
        <img
          src={category.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612] via-[#1a1612]/40 to-[#1a1612]/15" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-10">
          <p className="text-[10px] font-semibold tracking-[0.32em] text-gold uppercase">
            {String(index).padStart(2, '0')} · {t('menuPageEyebrow')}
          </p>
          <h2 className="mt-2 font-display text-5xl leading-none text-white italic md:text-6xl">
            {t(catTitle[category.id])}
          </h2>
          <div className="mt-5 h-px w-14 bg-gold/70" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/82">
            {t(catSub[category.id])}
          </p>
        </div>
      </BookPage>
    )
  },
)

const CategoryItemsPage = forwardRef<HTMLDivElement, { category: MenuCategory }>(
  function CategoryItemsPage({ category }, ref) {
    const { t, lang } = useI18n()
    return (
      <BookPage ref={ref} className="flex flex-col p-7 md:p-9">
        <PageEyebrow>{t(catSub[category.id])}</PageEyebrow>
        <h3 className="mt-2 font-display text-4xl text-ink italic md:text-[2.75rem]">
          {t(catTitle[category.id])}
        </h3>
        <PageRule />
        <ul className="flex-1 space-y-3.5 overflow-auto pr-1">
          {category.items.map((item) => (
            <li key={item.name.en} className="border-b border-line/55 pb-3.5 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-[15px] font-semibold text-ink">{item.name[lang]}</h4>
                    {item.tags?.includes('v') && (
                      <span className="text-[9px] font-bold tracking-[0.14em] text-olive uppercase">
                        vegan
                      </span>
                    )}
                    {item.tags?.includes('w') && (
                      <span className="text-[9px] font-bold tracking-[0.14em] text-amber-deep uppercase">
                        vege
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{item.desc[lang]}</p>
                </div>
                <p className="shrink-0 font-display text-xl text-ink italic tabular-nums">
                  {item.price}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-right text-[10px] tracking-[0.22em] text-ink/35 uppercase">zł</p>
      </BookPage>
    )
  },
)

/** Closing left — thank you / visit / reserve */
const CloseLeft = forwardRef<HTMLDivElement>(function CloseLeft(_props, ref) {
  const { t } = useI18n()
  return (
    <BookPage ref={ref} className="flex flex-col p-8 md:p-10">
      <PageEyebrow>{t('menuPageEyebrow')}</PageEyebrow>
      <PageTitle>{t('menuCloseTitle')}</PageTitle>
      <PageRule />
      <p className="text-[15px] leading-relaxed text-muted">{t('menuCloseText')}</p>

      <div className="mt-8 overflow-hidden">
        <img
          src="/images/interior.jpg"
          alt=""
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      <div className="mt-auto space-y-3 pt-6">
        <p className="text-sm text-ink">
          {brand.address.street}
          <br />
          {brand.address.city}
        </p>
        <Link
          to="/reserve"
          className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
        >
          {t('reserveCta')}
        </Link>
      </div>
    </BookPage>
  )
})

/** Closing right — QR, matching cream paper style */
const CloseRight = forwardRef<HTMLDivElement>(function CloseRight(_props, ref) {
  const { t } = useI18n()
  const menuUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/menu` : 'https://salute21.pl/menu'

  return (
    <BookPage ref={ref} className="flex flex-col items-center justify-between p-8 text-center md:p-10">
      <div className="w-full">
        <BrandLogo tone="dark" className="mx-auto h-10 w-auto opacity-80" />
        <p className="mt-6 text-[10px] font-semibold tracking-[0.32em] text-amber uppercase">
          {t('menuQrTitle')}
        </p>
        <h2 className="mt-2 font-display text-4xl text-ink italic md:text-5xl">{t('menuPageTitle')}</h2>
        <div className="mx-auto my-5 h-px w-14 bg-amber/55" />
        <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted">{t('menuQrText')}</p>
      </div>

      <div className="my-6 border border-line bg-white p-4 shadow-[0_12px_30px_rgba(12,11,10,0.06)]">
        <QRCodeSVG value={menuUrl} size={168} bgColor="#ffffff" fgColor="#0c0b0a" level="M" />
      </div>

      <div className="w-full space-y-2">
        <p className="text-sm font-medium text-ink">{brand.instagramHandle}</p>
        <p className="text-xs tracking-[0.18em] text-muted uppercase">{t('brandTag')}</p>
        <p className="pt-2 font-display text-2xl text-ink italic">Salute!</p>
      </div>
    </BookPage>
  )
})

export function MenuPage() {
  const { t, lang } = useI18n()
  const bookRef = useRef<FlipApi | null>(null)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [dims, setDims] = useState({ w: 480, h: 700 })
  const [showQr, setShowQr] = useState(false)

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const maxSpreadW = Math.min(vw - 24, 1180)
      const pageW = Math.floor(maxSpreadW / 2)
      const pageH = Math.min(Math.floor(vh - 88), Math.round(pageW * 1.42))
      const finalW = Math.max(260, Math.min(pageW, Math.floor(pageH / 1.42)))
      setDims({ w: finalW, h: Math.round(finalW * 1.42) })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const pageNodes = useMemo(() => {
    const nodes: Array<{ key: string; node: ReactNode }> = [
      { key: 'cover-left', node: <CoverLeft key="cover-left" /> },
      { key: 'cover-right', node: <CoverRight key="cover-right" /> },
    ]
    menu.forEach((category, i) => {
      nodes.push({
        key: `${category.id}-img`,
        node: (
          <CategoryImagePage
            key={`${category.id}-img`}
            category={category}
            index={i + 1}
          />
        ),
      })
      nodes.push({
        key: `${category.id}-items`,
        node: <CategoryItemsPage key={`${category.id}-items`} category={category} />,
      })
    })
    nodes.push({ key: 'close-left', node: <CloseLeft key="close-left" /> })
    nodes.push({ key: 'close-right', node: <CloseRight key="close-right" /> })
    return nodes
  }, [lang])

  const flipNext = () => bookRef.current?.pageFlip()?.flipNext()
  const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev()

  const spread = Math.floor(page / 2) + 1
  const spreadCount = Math.max(1, Math.ceil((pageCount || pageNodes.length) / 2))

  const menuUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/menu` : 'https://salute21.pl/menu'

  const downloadQr = () => {
    const svg = document.querySelector('#menu-fullscreen-qr')
    if (!svg) return
    const xml = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'salute-21-menu-qr.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="menu-magazine fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#14110e] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,181,106,0.07),transparent_55%)]" />

      <header className="relative z-20 flex shrink-0 items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition hover:text-white"
        >
          <X className="size-4" />
          <span className="hidden sm:inline">{t('backHome')}</span>
        </Link>

        <div className="flex items-center gap-3">
          <BrandLogo tone="light" className="h-8 w-auto opacity-90" />
          <span className="hidden font-display text-sm tracking-[0.2em] text-gold/90 uppercase sm:inline">
            {t('menuPageEyebrow')}
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <LanguageFlagToggle solid={false} bare />
          <button
            type="button"
            onClick={() => setShowQr(true)}
            className="text-[11px] font-semibold tracking-[0.18em] text-gold uppercase transition hover:text-white"
          >
            QR
          </button>
          <Link
            to="/reserve"
            className="hidden rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-wide text-ink transition hover:bg-gold sm:inline-flex"
          >
            {t('reserveCta')}
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-2 pb-2 md:px-4">
        <button
          type="button"
          onClick={flipPrev}
          className="absolute left-2 z-30 hidden size-12 items-center justify-center text-white/70 transition hover:text-white md:left-4 md:inline-flex lg:left-8"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-8" strokeWidth={1.25} />
        </button>

        <div className="menu-book-stage w-full max-w-[1200px]">
          <HTMLFlipBook
            key={`${lang}-${dims.w}`}
            width={dims.w}
            height={dims.h}
            size="stretch"
            minWidth={240}
            maxWidth={620}
            minHeight={360}
            maxHeight={900}
            showCover={false}
            mobileScrollSupport
            drawShadow
            flippingTime={950}
            usePortrait
            startPage={0}
            autoSize
            maxShadowOpacity={0.55}
            className="mx-auto"
            style={{ margin: '0 auto' }}
            ref={bookRef as Ref<FlipApi>}
            onFlip={(e: { data: number }) => setPage(e.data)}
            onInit={() => {
              try {
                const count = bookRef.current?.pageFlip()?.getPageCount()
                setPageCount(count || pageNodes.length)
              } catch {
                setPageCount(pageNodes.length)
              }
            }}
          >
            {pageNodes.map((p) => p.node)}
          </HTMLFlipBook>
        </div>

        <button
          type="button"
          onClick={flipNext}
          className="absolute right-2 z-30 hidden size-12 items-center justify-center text-white/70 transition hover:text-white md:right-4 md:inline-flex lg:right-8"
          aria-label="Next page"
        >
          <ChevronRight className="size-8" strokeWidth={1.25} />
        </button>
      </div>

      <footer className="relative z-20 flex shrink-0 items-center justify-center gap-5 px-4 py-3 md:gap-8">
        <button
          type="button"
          onClick={flipPrev}
          className="inline-flex size-10 items-center justify-center text-white/80 md:hidden"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-6" />
        </button>
        <p className="font-display text-sm tracking-[0.12em] text-white/55">
          {spread}
          <span className="mx-2 text-white/30">/</span>
          {spreadCount}
        </p>
        <button
          type="button"
          onClick={flipNext}
          className="inline-flex size-10 items-center justify-center text-white/80 md:hidden"
          aria-label="Next page"
        >
          <ChevronRight className="size-6" />
        </button>
        <p className="hidden text-[11px] tracking-[0.2em] text-white/40 uppercase md:block">
          {t('menuBookHint')}
        </p>
      </footer>

      {showQr && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-ink/80 p-5 backdrop-blur-sm"
          onClick={() => setShowQr(false)}
        >
          <div
            className="w-full max-w-sm border border-line bg-champagne p-6 text-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.28em] text-amber uppercase">QR</p>
                <h2 className="mt-1 font-display text-2xl italic">{t('menuQrTitle')}</h2>
              </div>
              <button type="button" onClick={() => setShowQr(false)} aria-label="Close">
                <X className="size-5 text-ink/60" />
              </button>
            </div>
            <p className="text-sm text-muted">{t('menuQrText')}</p>
            <div className="my-5 flex justify-center border border-line bg-white p-4">
              <QRCodeSVG
                id="menu-fullscreen-qr"
                value={menuUrl}
                size={168}
                bgColor="#ffffff"
                fgColor="#0c0b0a"
                level="M"
              />
            </div>
            <button
              type="button"
              onClick={downloadQr}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white"
            >
              <Download className="size-4" />
              {t('menuQrDownload')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
