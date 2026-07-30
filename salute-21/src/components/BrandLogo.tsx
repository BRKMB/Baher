type BrandLogoProps = {
  /** light = white logo for dark backgrounds; dark = ink logo for light backgrounds */
  tone?: 'light' | 'dark'
  className?: string
}

/** Script wordmark inspired by classic Saluté lettering — always includes 21 */
export function BrandLogo({ tone = 'dark', className = 'text-[2.65rem] md:text-[3.25rem]' }: BrandLogoProps) {
  const color = tone === 'light' ? 'text-white' : 'text-ink'

  return (
    <span
      className={`brand-logo inline-flex items-baseline gap-[0.18em] leading-none select-none ${color} ${className}`}
      aria-label="Salute 21"
    >
      <span className="font-script tracking-tight">Saluté</span>
      <span className="font-script tracking-tight">21</span>
    </span>
  )
}
