import { useI18n } from '../i18n/LanguageContext'

function FlagPL({ className = 'h-5 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true">
      <rect width="32" height="24" rx="3" fill="#fff" />
      <rect y="12" width="32" height="12" fill="#DC143C" />
      <rect width="32" height="24" rx="3" fill="none" stroke="rgba(0,0,0,0.14)" />
    </svg>
  )
}

function FlagEN({ className = 'h-5 w-8' }: { className?: string }) {
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
  const label = next === 'pl' ? 'Polski' : 'English'

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      className={`inline-flex size-11 items-center justify-center rounded-full border transition ${
        solid
          ? 'border-ink/15 bg-white shadow-sm hover:border-ink/40'
          : 'border-white/45 bg-ink/55 hover:border-white'
      }`}
      aria-label={`${t('langLabel')}: ${label}`}
      title={label}
    >
      {next === 'pl' ? (
        <FlagPL className="h-[18px] w-7 rounded-[2px]" />
      ) : (
        <FlagEN className="h-[18px] w-7 rounded-[2px]" />
      )}
    </button>
  )
}
