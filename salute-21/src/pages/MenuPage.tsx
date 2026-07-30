import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Download, Printer } from 'lucide-react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { menu } from '../data/content'
import { useI18n } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

const catTitle: Record<(typeof menu)[number]['id'], TranslationKey> = {
  special: 'cat_special',
  vege: 'cat_vege',
  meat: 'cat_meat',
  seafood: 'cat_seafood',
  sliders: 'cat_sliders',
  cocktails: 'cat_cocktails',
  desserts: 'cat_desserts',
}

const catSub: Record<(typeof menu)[number]['id'], TranslationKey> = {
  special: 'cat_special_sub',
  vege: 'cat_vege_sub',
  meat: 'cat_meat_sub',
  seafood: 'cat_seafood_sub',
  sliders: 'cat_sliders_sub',
  cocktails: 'cat_cocktails_sub',
  desserts: 'cat_desserts_sub',
}

export function MenuPage() {
  const { t, lang } = useI18n()
  const [active, setActive] = useState(menu[0].id)
  const category = useMemo(() => menu.find((c) => c.id === active) ?? menu[0], [active])
  const menuUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/menu` : 'https://salute21.pl/menu'

  const downloadQr = () => {
    const svg = document.getElementById('menu-qr-svg')
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
    <div className="min-h-screen">
      <Header variant="page" />
      <main className="px-5 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            {t('backHome')}
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
            <div>
              <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
                {t('menuPageEyebrow')}
              </p>
              <h1 className="font-display text-4xl tracking-[-0.02em] text-ink md:text-6xl">
                {t('menuPageTitle')}
              </h1>
              <div className="luxury-rule my-6 max-w-sm" />
              <p className="max-w-2xl text-base leading-relaxed text-muted">{t('menuPageIntro')}</p>

              <div className="mt-8 mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {menu.map((cat) => {
                  const isActive = cat.id === active
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActive(cat.id)}
                      className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-ink text-paper'
                          : 'border border-line bg-paper/60 text-ink/70 hover:border-ink/40 hover:text-ink'
                      }`}
                    >
                      {t(catTitle[cat.id])}
                    </button>
                  )
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={category.id + lang}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="mb-6">
                    <h2 className="font-display text-3xl text-ink">{t(catTitle[category.id])}</h2>
                    <p className="mt-1 text-sm text-muted">{t(catSub[category.id])}</p>
                  </div>

                  <ul className="divide-y divide-line border-y border-line">
                    {category.items.map((item) => (
                      <li
                        key={item.name.en}
                        className="grid grid-cols-[1fr_auto] gap-4 py-5 md:grid-cols-[1.3fr_2fr_auto] md:gap-8"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-ink md:text-lg">
                              {item.name[lang]}
                            </h3>
                            {item.tags?.includes('v') && (
                              <span className="rounded-full border border-olive/30 px-2 py-0.5 text-[10px] font-bold tracking-wider text-olive uppercase">
                                vegan
                              </span>
                            )}
                            {item.tags?.includes('w') && (
                              <span className="rounded-full border border-amber/40 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-deep uppercase">
                                vege
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-muted md:hidden">
                            {item.desc[lang]}
                          </p>
                        </div>
                        <p className="hidden text-sm leading-relaxed text-muted md:block">
                          {item.desc[lang]}
                        </p>
                        <p className="font-display text-xl text-ink tabular-nums">{item.price} zł</p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            <aside className="rounded-[1.4rem] border border-line bg-champagne/80 p-6 shadow-[0_20px_50px_rgba(12,11,10,0.05)] lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold tracking-[0.24em] text-amber uppercase">
                QR
              </p>
              <h2 className="mt-2 font-display text-2xl text-ink">{t('menuQrTitle')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t('menuQrText')}</p>
              <div className="my-5 flex justify-center rounded-2xl bg-paper p-4 gold-border">
                <QRCodeSVG
                  id="menu-qr-svg"
                  value={menuUrl}
                  size={168}
                  bgColor="#f7f3ea"
                  fgColor="#0c0b0a"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={downloadQr}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-ink-soft"
                >
                  <Download className="size-4" />
                  {t('menuQrDownload')}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-3 text-sm font-semibold text-ink transition hover:border-ink"
                >
                  <Printer className="size-4" />
                  {t('menuPrint')}
                </button>
                <Link
                  to="/reserve"
                  className="inline-flex items-center justify-center rounded-full border border-amber/50 bg-amber/15 px-4 py-3 text-sm font-semibold text-ink transition hover:bg-amber"
                >
                  {t('reserveCta')}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
