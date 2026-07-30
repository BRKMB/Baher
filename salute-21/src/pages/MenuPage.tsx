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
import { ArrowLeft, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { BrandLogo } from '../components/BrandLogo'
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
        src="/images/hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
        <BrandLogo tone="light" className="h-14 w-auto md:h-16" />
        <p className="mt-6 text-[11px] font-semibold tracking-[0.35em] text-gold uppercase">
          {t('menuPageEyebrow')}
        </p>
        <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">{t('menuPageTitle')}</h1>
        <div className="mt-6 h-px w-20 bg-gold/80" />
        <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/80">{t('menuBookHint')}</p>
      </div>
    </BookPage>
  )
})

const IntroPage = forwardRef<HTMLDivElement>(function IntroPage(_props, ref) {
  const { t } = useI18n()
  return (
    <BookPage ref={ref} className="flex flex-col justify-between p-7 md:p-9">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">Salute 21</p>
        <h2 className="mt-3 font-display text-3xl text-ink md:text-4xl">{t('menuPageTitle')}</h2>
        <div className="luxury-rule my-5 max-w-[180px]" />
        <p className="text-sm leading-relaxed text-muted md:text-[15px]">{t('menuPageIntro')}</p>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl">
        <img src="/images/interior.jpg" alt="" className="aspect-[4/3] w-full object-cover" />
      </div>
      <p className="mt-6 text-center text-[11px] tracking-[0.2em] text-ink/45 uppercase">
        {t('menuBookSpread')}
      </p>
    </BookPage>
  )
})

const CategoryImagePage = forwardRef<HTMLDivElement, { category: MenuCategory }>(
  function CategoryImagePage({ category }, ref) {
    const { t } = useI18n()
    return (
      <BookPage ref={ref} className="relative">
        <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
            {t('menuPageEyebrow')}
          </p>
          <h2 className="mt-2 font-display text-4xl text-white md:text-5xl">
            {t(catTitle[category.id])}
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">{t(catSub[category.id])}</p>
        </div>
      </BookPage>
    )
  },
)

const CategoryItemsPage = forwardRef<HTMLDivElement, { category: MenuCategory }>(
  function CategoryItemsPage({ category }, ref) {
    const { t, lang } = useI18n()
    return (
      <BookPage ref={ref} className="flex flex-col p-6 md:p-8">
        <div className="mb-4 border-b border-line pb-3">
          <h3 className="font-display text-2xl text-ink md:text-3xl">{t(catTitle[category.id])}</h3>
          <p className="mt-1 text-xs text-muted">{t(catSub[category.id])}</p>
        </div>
        <ul className="flex-1 space-y-3 overflow-auto pr-1">
          {category.items.map((item) => (
            <li key={item.name.en} className="border-b border-line/70 pb-3 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-ink md:text-[15px]">{item.name[lang]}</h4>
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
                <p className="shrink-0 font-display text-lg text-ink tabular-nums">{item.price}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-right text-[10px] tracking-[0.16em] text-ink/40 uppercase">zł</p>
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
      <p className="mt-6 text-[11px] font-semibold tracking-[0.28em] text-gold uppercase">
        {t('menuQrTitle')}
      </p>
      <div className="mt-5 rounded-2xl bg-white p-3">
        <QRCodeSVG value={menuUrl} size={140} bgColor="#ffffff" fgColor="#0c0b0a" level="M" />
      </div>
      <p className="mt-5 max-w-xs text-sm text-white/75">{t('menuQrText')}</p>
      <Link
        to="/reserve"
        className="mt-8 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink"
      >
        {t('reserveCta')}
      </Link>
    </BookPage>
  )
})

const BlankPage = forwardRef<HTMLDivElement>(function BlankPage(_props, ref) {
  return (
    <BookPage ref={ref} className="flex items-center justify-center p-8">
      <BrandLogo tone="dark" className="h-10 w-auto opacity-40" />
    </BookPage>
  )
})

export function MenuPage() {
  const { t, lang } = useI18n()
  const bookRef = useRef<FlipApi | null>(null)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [bookWidth, setBookWidth] = useState(420)

  useEffect(() => {
    const update = () => {
      const w = Math.min(460, Math.max(280, window.innerWidth * 0.42))
      setBookWidth(Math.round(w))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const bookHeight = Math.round(bookWidth * 1.48)

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

  const downloadQr = () => {
    const svg = document.querySelector('#menu-book-qr')
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

  const menuUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/menu` : 'https://salute21.pl/menu'

  return (
    <div className="min-h-screen">
      <Header variant="page" />
      <main className="px-4 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            {t('backHome')}
          </Link>

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
                {t('menuPageEyebrow')}
              </p>
              <h1 className="font-display text-4xl text-ink md:text-5xl">{t('menuBookTitle')}</h1>
              <p className="mt-3 max-w-xl text-sm text-muted md:text-base">{t('menuBookHint')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={flipPrev}
                className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-ink"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-5" />
              </button>
              <span className="min-w-16 text-center text-sm font-medium text-ink/70">
                {Math.min(page + 1, Math.max(pageCount, 1))} / {Math.max(pageCount, 1)}
              </span>
              <button
                type="button"
                onClick={flipNext}
                className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-ink"
                aria-label="Next page"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center">
            <div className="menu-book-shadow w-full max-w-[960px] overflow-hidden rounded-sm bg-[#1a1612] p-3 md:p-5">
              <HTMLFlipBook
                key={`${lang}-${bookWidth}`}
                width={bookWidth}
                height={bookHeight}
                size="stretch"
                minWidth={280}
                maxWidth={500}
                minHeight={420}
                maxHeight={740}
                showCover
                mobileScrollSupport
                drawShadow
                flippingTime={900}
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
                    if (count) setPageCount(count)
                    else setPageCount(pageNodes.length)
                  } catch {
                    setPageCount(pageNodes.length)
                  }
                }}
              >
                {pageNodes.map((p) => p.node)}
              </HTMLFlipBook>
            </div>

            <aside className="w-full max-w-sm rounded-[1.4rem] border border-line bg-champagne/90 p-6 shadow-[0_20px_50px_rgba(12,11,10,0.05)] lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-amber uppercase">QR</p>
              <h2 className="mt-2 font-display text-2xl text-ink">{t('menuQrTitle')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t('menuQrText')}</p>
              <div className="my-5 flex justify-center rounded-2xl bg-white p-4 gold-border">
                <QRCodeSVG
                  id="menu-book-qr"
                  value={menuUrl}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#0c0b0a"
                  level="M"
                />
              </div>
              <button
                type="button"
                onClick={downloadQr}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink-soft"
              >
                <Download className="size-4" />
                {t('menuQrDownload')}
              </button>
              <Link
                to="/reserve"
                className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-amber/50 bg-amber/15 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-amber"
              >
                {t('reserveCta')}
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
