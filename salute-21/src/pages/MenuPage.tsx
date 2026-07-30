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
import { menu, type MenuCategory } from '../data/content'
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
  hard?: boolean
}

const BookPage = forwardRef<HTMLDivElement, PageProps>(function BookPage(
  { children, className = '', hard = false },
  ref,
) {
  return (
    <div
      ref={ref}
      data-density={hard ? 'hard' : 'soft'}
      className={`menu-book-page h-full w-full ${className}`}
    >
      {children}
    </div>
  )
})

const CoverFront = forwardRef<HTMLDivElement>(function CoverFront(_props, ref) {
  const { t } = useI18n()
  return (
    <BookPage ref={ref} hard className="relative bg-ink text-white">
      <img
        src="/images/menu-special.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/35" />
      <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
        <BrandLogo tone="light" className="h-14 w-auto md:h-16" />
        <p className="mt-8 text-[11px] font-semibold tracking-[0.4em] text-gold uppercase">
          {t('menuPageEyebrow')}
        </p>
        <h1 className="mt-3 font-display text-5xl italic text-white md:text-6xl">
          {t('menuPageTitle')}
        </h1>
        <div className="mt-7 h-px w-16 bg-gold/80" />
        <p className="mt-7 max-w-xs text-sm leading-relaxed text-white/78">{t('menuBookHint')}</p>
      </div>
    </BookPage>
  )
})

const IntroPage = forwardRef<HTMLDivElement>(function IntroPage(_props, ref) {
  const { t } = useI18n()
  return (
    <BookPage ref={ref} className="flex flex-col justify-between p-8 md:p-10">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.32em] text-amber uppercase">Salute 21</p>
        <h2 className="mt-4 font-display text-4xl italic leading-tight text-ink md:text-5xl">
          {t('menuPageTitle')}
        </h2>
        <div className="luxury-rule my-6 max-w-[160px]" />
        <p className="text-[15px] leading-relaxed text-muted md:text-base">{t('menuPageIntro')}</p>
      </div>
      <div className="mt-8 overflow-hidden rounded-sm">
        <img src="/images/menu-vege.jpg" alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
      <p className="mt-6 text-center text-[11px] tracking-[0.28em] text-ink/40 uppercase">
        {t('menuBookSpread')}
      </p>
    </BookPage>
  )
})

const CategoryImagePage = forwardRef<HTMLDivElement, { category: MenuCategory }>(
  function CategoryImagePage({ category }, ref) {
    const { t } = useI18n()
    return (
      <BookPage ref={ref} className="relative bg-ink">
        <img
          src={category.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-10">
          <p className="text-[11px] font-semibold tracking-[0.32em] text-gold uppercase">
            {t('menuPageEyebrow')}
          </p>
          <h2 className="mt-2 font-display text-5xl italic text-white md:text-6xl">
            {t(catTitle[category.id])}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/82">
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
        <div className="mb-5 border-b border-line/80 pb-4">
          <h3 className="font-display text-3xl italic text-ink md:text-4xl">
            {t(catTitle[category.id])}
          </h3>
          <p className="mt-1.5 text-xs tracking-wide text-muted">{t(catSub[category.id])}</p>
        </div>
        <ul className="flex-1 space-y-3.5 overflow-auto pr-1">
          {category.items.map((item) => (
            <li key={item.name.en} className="border-b border-line/60 pb-3.5 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-[15px] font-semibold text-ink">{item.name[lang]}</h4>
                    {item.tags?.includes('v') && (
                      <span className="rounded-full border border-olive/30 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-olive uppercase">
                        vegan
                      </span>
                    )}
                    {item.tags?.includes('w') && (
                      <span className="rounded-full border border-amber/40 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-amber-deep uppercase">
                        vege
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{item.desc[lang]}</p>
                </div>
                <p className="shrink-0 font-display text-xl italic text-ink tabular-nums">
                  {item.price}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-right text-[10px] tracking-[0.2em] text-ink/35 uppercase">zł</p>
      </BookPage>
    )
  },
)

const CoverBack = forwardRef<HTMLDivElement>(function CoverBack(_props, ref) {
  const { t } = useI18n()
  const menuUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/menu` : 'https://salute21.pl/menu'

  return (
    <BookPage
      ref={ref}
      hard
      className="flex flex-col items-center justify-center bg-ink p-8 text-center text-white"
    >
      <BrandLogo tone="light" className="h-12 w-auto" />
      <p className="mt-8 text-[11px] font-semibold tracking-[0.32em] text-gold uppercase">
        {t('menuQrTitle')}
      </p>
      <div className="mt-5 rounded-xl bg-white p-3">
        <QRCodeSVG value={menuUrl} size={150} bgColor="#ffffff" fgColor="#0c0b0a" level="M" />
      </div>
      <p className="mt-5 max-w-xs text-sm text-white/75">{t('menuQrText')}</p>
      <Link
        to="/reserve"
        className="mt-8 inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-ink"
      >
        {t('reserveCta')}
      </Link>
    </BookPage>
  )
})

const BlankPage = forwardRef<HTMLDivElement>(function BlankPage(_props, ref) {
  return (
    <BookPage ref={ref} className="flex items-center justify-center p-8">
      <BrandLogo tone="dark" className="h-10 w-auto opacity-35" />
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
      // Two-page spread fills almost the whole viewport
      const maxSpreadW = Math.min(vw - 24, 1180)
      const pageW = Math.floor(maxSpreadW / 2)
      const pageH = Math.min(Math.floor(vh - 88), Math.round(pageW * 1.42))
      const finalW = Math.max(260, Math.min(pageW, Math.floor((pageH / 1.42))))
      setDims({ w: finalW, h: Math.round(finalW * 1.42) })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const pageNodes = useMemo(() => {
    const nodes: Array<{ key: string; node: ReactNode }> = [
      { key: 'cover-front', node: <CoverFront key="cover-front" /> },
      { key: 'intro', node: <IntroPage key="intro" /> },
    ]
    for (const category of menu) {
      nodes.push({
        key: `${category.id}-img`,
        node: <CategoryImagePage key={`${category.id}-img`} category={category} />,
      })
      nodes.push({
        key: `${category.id}-items`,
        node: <CategoryItemsPage key={`${category.id}-items`} category={category} />,
      })
    }
    nodes.push({ key: 'cover-back', node: <CoverBack key="cover-back" /> })
    if (nodes.length % 2 !== 0) {
      nodes.push({ key: 'blank', node: <BlankPage key="blank" /> })
    }
    return nodes
  }, [lang])

  const flipNext = () => bookRef.current?.pageFlip()?.flipNext()
  const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev()

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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,192,122,0.08),transparent_55%)]" />

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
            showCover
            mobileScrollSupport
            drawShadow
            flippingTime={1000}
            usePortrait
            startPage={0}
            autoSize
            maxShadowOpacity={0.65}
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
          {Math.min(page + 1, Math.max(pageCount, 1))}
          <span className="mx-2 text-white/30">/</span>
          {Math.max(pageCount, 1)}
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
            className="w-full max-w-sm rounded-2xl bg-champagne p-6 text-ink shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.24em] text-amber uppercase">QR</p>
                <h2 className="mt-1 font-display text-2xl italic">{t('menuQrTitle')}</h2>
              </div>
              <button type="button" onClick={() => setShowQr(false)} aria-label="Close">
                <X className="size-5 text-ink/60" />
              </button>
            </div>
            <p className="text-sm text-muted">{t('menuQrText')}</p>
            <div className="my-5 flex justify-center rounded-xl bg-white p-4">
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
