import { useI18n } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

const testimonials: Array<{
  name: string
  roleKey: TranslationKey
  quoteKey: TranslationKey
}> = [
  { name: 'Aleksandra Nowak', roleKey: 'testi1Role', quoteKey: 'testi1Quote' },
  { name: 'Magdalena Wiśniewska', roleKey: 'testi2Role', quoteKey: 'testi2Quote' },
  { name: 'Karolina Zielińska', roleKey: 'testi3Role', quoteKey: 'testi3Quote' },
  { name: 'Piotr Kowalski', roleKey: 'testi4Role', quoteKey: 'testi4Quote' },
  { name: 'Tomasz Lewandowski', roleKey: 'testi5Role', quoteKey: 'testi5Quote' },
  { name: 'Michał Kamiński', roleKey: 'testi6Role', quoteKey: 'testi6Quote' },
]

function Card({
  name,
  role,
  quote,
}: {
  name: string
  role: string
  quote: string
}) {
  return (
    <article className="w-[min(86vw,360px)] shrink-0 rounded-[1.35rem] border border-line bg-white/85 p-6 shadow-[0_18px_40px_rgba(12,11,10,0.05)]">
      <p className="font-display text-[1.25rem] leading-snug text-ink">“{quote}”</p>
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="mt-1 text-[11px] font-medium tracking-[0.14em] text-amber uppercase">{role}</p>
      </div>
    </article>
  )
}

export function Testimonials() {
  const { t } = useI18n()
  const cards = testimonials.map((item) => ({
    ...item,
    role: t(item.roleKey),
    quote: t(item.quoteKey),
  }))
  // Triple for a seamless full-width loop
  const loop = [...cards, ...cards, ...cards]

  return (
    <section id="opinie" className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto mb-10 max-w-7xl px-5 text-center md:px-8">
        <p className="mb-3 text-[11px] font-semibold tracking-[0.28em] text-amber uppercase">
          {t('testimonialsEyebrow')}
        </p>
        <h2 className="font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl">
          {t('testimonialsTitle')}
        </h2>
        <div className="luxury-rule mx-auto my-6 max-w-xs" />
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted">
          {t('testimonialsIntro')}
        </p>
      </div>

      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-champagne to-transparent md:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-champagne to-transparent md:w-28" />

        <div className="marquee-track flex w-max gap-5 py-2">
          {loop.map((item, index) => (
            <Card
              key={`${item.name}-${index}`}
              name={item.name}
              role={item.role}
              quote={item.quote}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
