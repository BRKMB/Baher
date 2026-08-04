import {
  forwardRef,
  useEffect,
  useLayoutEffect,
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
import { MenuDietBadge, MenuDietLegend, type MenuDietTag } from '../components/MenuDietIcons'
import { Seo } from '../components/Seo'
import { brand, menu, type MenuCategory, type MenuItem } from '../data/content'
import { buildMenuJsonLd } from '../seo/site'
import { useI18n } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

const DIET_TAGS: MenuDietTag[] = ['vegan', 'vege', 'spicy']

const catTitle: Record<MenuCategory['id'], TranslationKey> = {
  burgers: 'cat_burgers',
  pizza: 'cat_pizza',
  sides: 'cat_sides',
  turkish: 'cat_turkish',
  hot_coffee: 'cat_hot_coffee',
  cold_coffee: 'cat_cold_coffee',
  tea: 'cat_tea',
  cold_drinks: 'cat_cold_drinks',
}

const catSub: Record<MenuCategory['id'], TranslationKey> = {
  burgers: 'cat_burgers_sub',
  pizza: 'cat_pizza_sub',
  sides: 'cat_sides_sub',
  turkish: 'cat_turkish_sub',
  hot_coffee: 'cat_hot_coffee_sub',
  cold_coffee: 'cat_cold_coffee_sub',
  tea: 'cat_tea_sub',
  cold_drinks: 'cat_cold_drinks_sub',
}

type ItemPageSlice = {
  items: MenuItem[]
  showNote: boolean
}

/**
 * One items leaf per category — keeps the book rhythm:
 * category photo on the left, full price list on the right.
 * Dense lists use compact type + in-page scroll instead of continuation pages.
 */
function itemSlicesFor(category: MenuCategory): ItemPageSlice[] {
  return [{ items: category.items, showNote: Boolean(category.note) }]
}

type FlipApi = {
  pageFlip: () => {
    flipNext: (corner?: 'top' | 'bottom') => void
    flipPrev: (corner?: 'top' | 'bottom') => void
    flip: (page: number) => void
    turnToPage: (page: number) => void
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
    <div
      ref={ref}
      className={`menu-book-page h-full w-full select-none ${className}`}
    >
      {children}
    </div>
  )
})

/**
 * Scale leaf content to the visible page height so nothing is clipped on short phones.
 * Falls back to scroll only if scaling would go below the readability floor.
 */
function FitLeaf({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef(1)
  const scrollableRef = useRef(false)
  const [scale, setScale] = useState(1)
  const [scrollable, setScrollable] = useState(false)

  useLayoutEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return

    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const avail = frame.clientHeight
        if (avail <= 0) return
        const visualH = content.getBoundingClientRect().height
        const current = scaleRef.current || 1
        const need = visualH / current
        if (need <= 0) return
        const raw = avail / need
        const next = raw >= 0.995 ? 1 : Math.max(0.8, Math.min(1, raw))
        const canScroll = raw < 0.8
        if (
          Math.abs(next - scaleRef.current) < 0.008 &&
          canScroll === scrollableRef.current
        ) {
          return
        }
        scaleRef.current = next
        scrollableRef.current = canScroll
        setScale(next)
        setScrollable(canScroll)
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(frame)
    ro.observe(content)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={frameRef}
      className={`menu-fit-leaf h-full min-h-0 w-full ${
        scrollable ? 'menu-items-scroll overflow-y-auto overscroll-contain' : 'overflow-hidden'
      }`}
    >
      <div
        ref={contentRef}
        className="w-full origin-top-left"
        style={{
          transform: scale < 1 ? `scale(${scale})` : undefined,
          width: scale < 1 ? `${100 / scale}%` : '100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function PageEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] font-semibold tracking-[0.32em] text-amber uppercase">{children}</p>
  )
}

/** Cover left — brand face of the menu */
const CoverLeft = forwardRef<HTMLDivElement>(function CoverLeft(_props, ref) {
  const { t } = useI18n()
  return (
    <BookPage ref={ref} className="relative">
      <img
        src="/images/menu-cover.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612] via-[#1a1612]/55 to-[#1a1612]/25" />
      <div className="relative flex h-full flex-col justify-between p-5 text-white sm:p-8 md:p-10">
        <div>
          <BrandLogo tone="light" className="text-[2.6rem] opacity-95 sm:text-[3rem]" />
          <p className="mt-5 text-[10px] font-semibold tracking-[0.34em] text-gold uppercase">
            {t('brandTag')}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.34em] text-gold uppercase">
            {t('menuPageEyebrow')}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-none text-white italic sm:text-5xl md:text-6xl">
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

/** Cover right — welcome, visit, hours + QR (merged closing card) */
const CoverRight = forwardRef<HTMLDivElement>(function CoverRight(_props, ref) {
  const { t } = useI18n()
  const menuUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/menu` : 'https://salute21.com/menu'
  const hours = [
    { day: t('dayMonThu'), time: '9–23' },
    { day: t('dayFriSat'), time: '9–23:30' },
    { day: t('daySun'), time: '10–21' },
  ]

  return (
    <BookPage ref={ref} className="menu-pad overflow-hidden p-3 sm:p-7 md:p-9">
      <FitLeaf>
        <PageEyebrow>{t('menuCoverWelcome')}</PageEyebrow>
        <h2 className="mt-1 font-display text-[1.45rem] leading-[1.05] text-ink italic sm:mt-2 sm:text-[2.2rem] md:text-4xl">
          {brand.name}
        </h2>
        <div className="my-2 h-px w-12 bg-amber/55 sm:my-4" />
        <p className="text-[11px] leading-snug text-muted sm:text-sm sm:leading-relaxed">
          {t('menuCoverAbout')}
        </p>

        <div className="mt-3 grid gap-3 sm:mt-6 sm:gap-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.28em] text-amber uppercase">
                {t('menuCoverVisit')}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-ink sm:mt-2 sm:text-sm">
                {brand.address.street}
                <br />
                {brand.address.district}, {brand.address.city}
              </p>
              <p className="mt-1 text-[10px] text-muted sm:mt-2 sm:text-[12px]">
                {brand.instagramHandle}
              </p>
              <p className="text-[10px] text-muted sm:text-[12px]">{brand.email}</p>
              <Link
                to="/reserve"
                className="mt-2 inline-flex rounded-full bg-ink px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white sm:mt-4 sm:px-4 sm:py-2 sm:text-xs"
              >
                {t('reserveCta')}
              </Link>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.28em] text-amber uppercase">
                {t('menuCoverHours')}
              </p>
              <ul className="mt-1 space-y-0.5 sm:mt-2 sm:space-y-1.5">
                {hours.map((row) => (
                  <li
                    key={row.day}
                    className="flex items-baseline justify-between gap-1.5 text-[10px] sm:text-[13px]"
                  >
                    <span className="min-w-0 truncate text-muted">{row.day}</span>
                    <span className="shrink-0 font-display text-[13px] text-ink tabular-nums sm:text-base">
                      {row.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-line/70 pt-2.5 sm:pt-4">
            <p className="text-[10px] font-semibold tracking-[0.28em] text-amber uppercase">
              {t('menuCoverSymbols')}
            </p>
            <MenuDietLegend
              compact
              items={DIET_TAGS.map((tag) => ({
                tag,
                label:
                  tag === 'vegan'
                    ? t('tagVegan')
                    : tag === 'vege'
                      ? t('tagVege')
                      : t('tagSpicy'),
                hint:
                  tag === 'vegan'
                    ? t('tagVeganHint')
                    : tag === 'vege'
                      ? t('tagVegeHint')
                      : t('tagSpicyHint'),
              }))}
            />
          </div>

          <div className="border-t border-line/70 pt-2.5 sm:pt-4">
            <div className="flex items-end gap-2.5 sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold tracking-[0.28em] text-amber uppercase">
                  {t('menuQrTitle')}
                </p>
                <p className="mt-1 text-[10px] leading-snug text-muted sm:mt-2 sm:text-[13px] sm:leading-relaxed">
                  {t('menuQrText')}
                </p>
                <p className="mt-1.5 hidden text-[10px] font-semibold tracking-[0.22em] text-ink/45 uppercase sm:mt-3 sm:block">
                  {t('menuCoverContents')}
                </p>
                <p className="mt-1 hidden text-[10px] leading-relaxed text-muted sm:line-clamp-3 sm:block sm:text-[11px]">
                  {menu.map((c) => t(catTitle[c.id])).join(' · ')}
                </p>
              </div>
              <div className="size-14 shrink-0 border border-amber/35 bg-white p-1 sm:size-[88px] sm:p-2">
                <QRCodeSVG
                  value={menuUrl}
                  size={84}
                  bgColor="#ffffff"
                  fgColor="#0c0b0a"
                  level="M"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </FitLeaf>
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
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8 md:p-10">
          <p className="text-[10px] font-semibold tracking-[0.32em] text-gold uppercase">
            {String(index).padStart(2, '0')} · {t('menuPageEyebrow')}
          </p>
          <h2 className="mt-2 font-display text-4xl leading-none text-white italic sm:text-5xl md:text-6xl">
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

const CategoryItemsPage = forwardRef<
  HTMLDivElement,
  {
    category: MenuCategory
    items: MenuItem[]
    showNote?: boolean
  }
>(function CategoryItemsPage({ category, items, showNote = true }, ref) {
  const { t, lang } = useI18n()
  let lastGroup = ''
  const dense = items.length >= 7
  return (
    <BookPage ref={ref} className="menu-pad overflow-hidden p-3 sm:p-6 md:p-8">
      <FitLeaf>
        <PageEyebrow>{t(catSub[category.id])}</PageEyebrow>
        <h3
          className={`mt-1 font-display text-ink italic ${
            dense
              ? 'text-[1.45rem] sm:text-3xl md:text-[2.4rem]'
              : 'text-[1.55rem] sm:text-3xl md:text-[2.55rem]'
          }`}
        >
          {t(catTitle[category.id])}
        </h3>
        <div className={`h-px w-14 bg-amber/55 ${dense ? 'my-1.5 sm:my-2.5' : 'my-2 sm:my-3'}`} />
        <ul className={dense ? 'space-y-1 sm:space-y-2' : 'space-y-1.5 sm:space-y-2.5'}>
          {items.map((item) => {
            const groupLabel = item.group?.[lang] || ''
            const showGroup = Boolean(groupLabel && groupLabel !== lastGroup)
            if (showGroup) lastGroup = groupLabel
            return (
              <li
                key={`${groupLabel}-${item.name.en}`}
                className={`border-b border-line/55 last:border-0 ${
                  dense ? 'pb-1 sm:pb-2' : 'pb-1.5 sm:pb-2.5'
                }`}
              >
                {showGroup && (
                  <p className="mb-0.5 text-[9px] font-semibold tracking-[0.18em] text-amber uppercase sm:mb-1 sm:text-[10px] sm:tracking-[0.2em]">
                    {groupLabel}
                  </p>
                )}
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h4 className="text-[12px] font-semibold text-ink sm:text-[15px]">
                        {item.name[lang]}
                      </h4>
                      {DIET_TAGS.filter((tag) => item.tags?.includes(tag)).map((tag) => (
                        <MenuDietBadge
                          key={tag}
                          tag={tag}
                          label={
                            tag === 'vegan'
                              ? t('tagVegan')
                              : tag === 'vege'
                                ? t('tagVege')
                                : t('tagSpicy')
                          }
                        />
                      ))}
                    </div>
                    <p className="mt-0.5 text-[10px] leading-snug text-muted sm:text-xs">
                      {item.desc[lang]}
                    </p>
                  </div>
                  <p className="shrink-0 font-display text-base text-ink italic tabular-nums sm:text-xl">
                    {item.price}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="mt-2 flex items-end justify-between gap-3 pb-0.5">
          {showNote && category.note ? (
            <p className="min-w-0 text-[10px] leading-snug tracking-wide text-ink/45">
              {category.note[lang]}
            </p>
          ) : (
            <span />
          )}
          <p className="shrink-0 text-[10px] tracking-[0.22em] text-ink/35 uppercase">zł</p>
        </div>
      </FitLeaf>
    </BookPage>
  )
})

export function MenuPage() {
  const { t, lang } = useI18n()
  const bookRef = useRef<FlipApi | null>(null)
  const navRef = useRef<HTMLDivElement | null>(null)
  const slotRef = useRef<HTMLDivElement | null>(null)
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [dims, setDims] = useState({ w: 320, h: 460, mobile: true })
  const [showQr, setShowQr] = useState(false)

  const COVER_PAGES = 2

  const categoryPageStarts = useMemo(() => {
    let cursor = COVER_PAGES
    return menu.map((category) => {
      const start = cursor
      cursor += 1 + itemSlicesFor(category).length
      return start
    })
  }, [])

  const navItems = useMemo(
    () => [
      { id: 'cover', label: t('menuNavCover'), pageIndex: 0 },
      ...menu.map((category, i) => ({
        id: category.id,
        label: t(catTitle[category.id]),
        pageIndex: categoryPageStarts[i] ?? COVER_PAGES,
      })),
    ],
    [t, categoryPageStarts],
  )

  const activeNavId = useMemo(() => {
    if (page < COVER_PAGES) return 'cover'
    let active = menu[0]?.id ?? 'cover'
    for (let i = 0; i < menu.length; i++) {
      const start = categoryPageStarts[i] ?? COVER_PAGES
      const next = categoryPageStarts[i + 1] ?? Number.POSITIVE_INFINITY
      if (page >= start && page < next) {
        active = menu[i].id
        break
      }
      if (page >= start) active = menu[i].id
    }
    return active
  }, [page, categoryPageStarts])

  // Size the flip-book from the real slot between header/nav and footer (no guessing chrome height)
  useEffect(() => {
    const slot = slotRef.current
    if (!slot) return

    const update = () => {
      const mobile = window.innerWidth < 768
      const pad = mobile ? 6 : 16
      const availW = Math.max(220, Math.floor(slot.clientWidth - pad))
      const availH = Math.max(280, Math.floor(slot.clientHeight - pad))
      // Slightly taller mobile leaves — more room for dense price lists / cover.
      const ratio = mobile ? 1.48 : 1.42

      if (mobile) {
        // Prefer using the full slot height on phones so content is not cropped.
        let pageH = availH
        let pageW = Math.max(220, Math.floor(pageH / ratio))
        if (pageW > availW) {
          pageW = availW
          pageH = Math.round(pageW * ratio)
          if (pageH > availH) {
            pageH = availH
            pageW = Math.max(220, Math.floor(pageH / ratio))
          }
        }
        setDims({ w: pageW, h: pageH, mobile: true })
        return
      }

      let pageW = Math.floor(availW / 2)
      let pageH = Math.round(pageW * ratio)
      if (pageH > availH) {
        pageH = availH
        pageW = Math.max(240, Math.floor(pageH / ratio))
      }
      setDims({ w: pageW, h: pageH, mobile: false })
    }

    update()
    const ro = new ResizeObserver(() => update())
    ro.observe(slot)
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const root = navRef.current
    if (!root) return
    const active = root.querySelector<HTMLElement>('[data-active="true"]')
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeNavId])

  // Drag / swipe to scroll the category strip on every device, without breaking taps
  useEffect(() => {
    const el = navRef.current
    if (!el) return

    const THRESHOLD = 6
    let tracking = false
    let dragging = false
    let startX = 0
    let startScroll = 0
    let pointerId: number | null = null
    let suppressClick = false

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      tracking = true
      dragging = false
      startX = e.clientX
      startScroll = el.scrollLeft
      pointerId = e.pointerId
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!tracking || pointerId !== e.pointerId) return
      const dx = e.clientX - startX
      if (!dragging) {
        if (Math.abs(dx) < THRESHOLD) return
        dragging = true
        el.classList.add('is-dragging')
      }
      el.scrollLeft = startScroll - dx
      e.preventDefault()
    }

    const endPointer = (e: PointerEvent) => {
      if (!tracking || (pointerId !== null && e.pointerId !== pointerId)) return
      if (dragging) {
        suppressClick = true
        window.setTimeout(() => {
          suppressClick = false
        }, 50)
      }
      tracking = false
      dragging = false
      pointerId = null
      el.classList.remove('is-dragging')
    }

    const onClickCapture = (e: Event) => {
      if (!suppressClick) return
      e.preventDefault()
      e.stopPropagation()
      suppressClick = false
    }

    // Horizontal wheel / trackpad while hovering the strip (desktop)
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return
      const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY)
      if (horiz) {
        el.scrollLeft += e.deltaX
        e.preventDefault()
      } else if (e.shiftKey || Math.abs(e.deltaY) > 0) {
        el.scrollLeft += e.deltaY
        e.preventDefault()
      }
    }

    el.addEventListener('pointerdown', onPointerDown)
    // Window listeners so mouse drag keeps working outside the strip
    window.addEventListener('pointermove', onPointerMove, { passive: false })
    window.addEventListener('pointerup', endPointer)
    window.addEventListener('pointercancel', endPointer)
    el.addEventListener('click', onClickCapture, true)
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', endPointer)
      window.removeEventListener('pointercancel', endPointer)
      el.removeEventListener('click', onClickCapture, true)
      el.removeEventListener('wheel', onWheel)
      el.classList.remove('is-dragging')
    }
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
      itemSlicesFor(category).forEach((slice, sliceIndex) => {
        nodes.push({
          key: `${category.id}-items-${sliceIndex}`,
          node: (
            <CategoryItemsPage
              key={`${category.id}-items-${sliceIndex}`}
              category={category}
              items={slice.items}
              showNote={slice.showNote}
            />
          ),
        })
      })
    })
    return nodes
  }, [lang])

  const flipNext = () => bookRef.current?.pageFlip()?.flipNext('top')
  const flipPrev = () => bookRef.current?.pageFlip()?.flipPrev('top')

  const jumpTo = (pageIndex: number) => {
    const api = bookRef.current?.pageFlip()
    if (!api) return
    // Always land on the section image page (even index for categories).
    // turnToPage jumps instantly — flip() only advances one spread per call,
    // which caused lag and wrong-section landings.
    const target = Math.max(0, Math.min(pageIndex, (api.getPageCount?.() ?? pageNodes.length) - 1))
    try {
      api.turnToPage(target)
    } catch {
      // ignore
    }
    setPage(target)
  }

  const totalPages = Math.max(pageCount || pageNodes.length, 1)
  const pageLabel = dims.mobile
    ? `${Math.min(page + 1, totalPages)} / ${totalPages}`
    : `${Math.floor(page / 2) + 1} / ${Math.max(1, Math.ceil(totalPages / 2))}`

  const menuUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/menu` : 'https://salute21.com/menu'

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
    <div className="menu-magazine fixed inset-0 z-40 flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#14110e] text-white select-none">
      <Seo
        page="menu"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Menu', path: '/menu' },
        ]}
        extraJsonLd={[
          buildMenuJsonLd(
            menu.map((cat) => ({
              name: t(catTitle[cat.id]),
              items: cat.items.map((item) => ({
                name: item.name.en,
                description: item.desc.en,
                price: item.price,
              })),
            })),
          ),
        ]}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,181,106,0.07),transparent_55%)]" />

      <header className="menu-magazine__header relative z-30 flex shrink-0 items-center justify-between gap-2 bg-[#14110e] px-3 sm:gap-3 sm:px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <Link
            to="/"
            className="inline-flex size-9 shrink-0 items-center justify-center text-white/75 transition hover:text-white"
            aria-label={t('backHome')}
          >
            <X className="size-4" />
          </Link>
          <BrandLogo
            tone="light"
            className="menu-magazine__logo max-w-[40vw] text-[1.45rem] opacity-95 sm:max-w-none sm:text-[1.95rem]"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
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
            className="rounded-full bg-white px-2.5 py-1.5 text-[11px] font-semibold tracking-wide text-ink transition hover:bg-gold sm:px-4 sm:py-2 sm:text-xs"
          >
            {t('reserveCta')}
          </Link>
        </div>
      </header>

      <nav
        aria-label={t('menuQuickNav')}
        className="menu-cat-bar relative z-30 shrink-0 border-y border-white/10"
      >
        <div ref={navRef} className="menu-cat-nav px-3 py-1.5 sm:px-4 sm:py-2.5 md:py-3">
          <div className="flex w-max gap-1.5 sm:gap-2 md:gap-2.5">
            {navItems.map((item) => {
              const active = item.id === activeNavId
              return (
                <button
                  key={item.id}
                  type="button"
                  draggable={false}
                  data-active={active ? 'true' : 'false'}
                  onClick={() => jumpTo(item.pageIndex)}
                  className={`menu-cat-nav__btn shrink-0 border px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase transition sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.14em] md:px-3.5 md:py-2 ${
                    active
                      ? 'border-gold bg-gold/15 text-gold'
                      : 'border-white/15 bg-white/5 text-white/70 hover:border-white/35 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      <div
        ref={slotRef}
        className="menu-book-slot relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-1.5 sm:px-2 md:px-4"
      >
        <button
          type="button"
          onClick={flipPrev}
          className="absolute left-1 z-30 hidden size-11 items-center justify-center text-white/70 transition hover:text-white md:left-4 md:inline-flex lg:left-8"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-8" strokeWidth={1.25} />
        </button>

        <div
          className="menu-book-stage select-none"
          style={{ width: dims.mobile ? dims.w : dims.w * 2, height: dims.h, maxWidth: '100%' }}
        >
          <HTMLFlipBook
            key={`${lang}-${dims.w}-${dims.h}-${dims.mobile ? 'm' : 'd'}`}
            width={dims.w}
            height={dims.h}
            size="fixed"
            minWidth={dims.w}
            maxWidth={dims.w}
            minHeight={dims.h}
            maxHeight={dims.h}
            showCover={false}
            mobileScrollSupport
            drawShadow
            flippingTime={dims.mobile ? 750 : 950}
            usePortrait={dims.mobile}
            startPage={0}
            autoSize={false}
            maxShadowOpacity={0.45}
            className="menu-flipbook mx-auto select-none"
            style={{ margin: '0 auto', userSelect: 'none', width: '100%', height: '100%' }}
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
          className="absolute right-1 z-30 hidden size-11 items-center justify-center text-white/70 transition hover:text-white md:right-4 md:inline-flex lg:right-8"
          aria-label="Next page"
        >
          <ChevronRight className="size-8" strokeWidth={1.25} />
        </button>
      </div>

      <footer className="relative z-30 flex shrink-0 items-center justify-between gap-3 bg-[#14110e] px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:justify-center sm:gap-6 sm:px-4 sm:py-3 md:gap-8">
        <button
          type="button"
          onClick={flipPrev}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white md:hidden"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="min-w-0 text-center">
          <p className="font-display text-sm tracking-[0.12em] text-white/70">{pageLabel}</p>
          <p className="mt-0.5 hidden text-[11px] tracking-[0.2em] text-white/40 uppercase sm:block">
            {t('menuBookHint')}
          </p>
        </div>
        <button
          type="button"
          onClick={flipNext}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white md:hidden"
          aria-label="Next page"
        >
          <ChevronRight className="size-5" />
        </button>
      </footer>

      {showQr && (
        <div
          className="absolute inset-0 z-50 flex items-end justify-center bg-ink/80 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onClick={() => setShowQr(false)}
        >
          <div
            className="w-full max-w-sm border border-line bg-champagne p-6 text-ink shadow-2xl sm:rounded-none"
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
