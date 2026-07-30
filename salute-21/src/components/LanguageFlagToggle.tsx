import { useI18n } from '../i18n/LanguageContext'

function FlagPL({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true">
      <rect width="32" height="24" rx="3" fill="#fff" />
      <rect y="12" width="32" height="12" fill="#DC143C" />
      <rect width="32" height="24" rx="3" fill="none" stroke="rgba(0,0,0,0.12)" />
    </svg>
  )
}

function FlagEN({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true">
      <rect width="32" height="24" rx="3" fill="#012169" />
      <path d="M0 0 L32 24 M32 0 L0 24" stroke="#fff" strokeWidth="5" />
      <path d="M0 0 L32 24 M32 0 L0 24" stroke="#C8102E" strokeWidth="2.5" />
      <path d="M16 0 V24 M0 12 H32" stroke="#fff" strokeWidth="8" />
      <path d="M16 0 V24 M0 12 H32" stroke="#C8102E" strokeWidth="4.5" />
      <rect width="32" height="24" rx="3" fill="none" stroke="rgba(255,255,255,0.2)" />
    </svg>
  )
}

export function LanguageFlagToggle({ solid }: { solid: boolean }) {
  const { lang, setLang, t } = useI18n()
  const next = lang === 'en' ? 'pl' : 'en'

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 transition ${
        solid
          ? 'border-ink/15 bg-white text-ink shadow-sm hover:border-ink/40'
          : 'border-white/40 bg-ink/55 text-white hover:border-white'
      }`}
      aria-label={`${t('langLabel')}: ${next === 'pl' ? 'Polski' : 'English'}`}
      title={next === 'pl' ? 'Polski' : 'English'}
    >
      {next === 'pl' ? <FlagPL className="h-5 w-7 rounded-[3px]" /> : <FlagEN className="h-5 w-7 rounded-[3px]" />}
      <span className="pr-1 text-[11px] font-bold tracking-wider uppercase">{next}</span>
    </button>
  )
}
