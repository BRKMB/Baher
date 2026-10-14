import { igSectionConfig } from './config'

type BrandLogoProps = {
  tone?: 'light' | 'dark'
  className?: string
  name?: string
  number?: string
  ariaLabel?: string
}

/** Script wordmark — override via props or `config.ts`. */
export function BrandLogo({
  tone = 'dark',
  className = 'text-[2.65rem] md:text-[3.25rem]',
  name = igSectionConfig.brandName,
  number = igSectionConfig.brandNumber,
  ariaLabel = igSectionConfig.brandAriaLabel,
}: BrandLogoProps) {
  const color = tone === 'light' ? 'text-white' : 'text-ink'

  return (
    <span
      className={`brand-logo inline-flex items-baseline gap-[0.18em] select-none ${color} ${className}`}
      aria-label={ariaLabel}
    >
      <span className="font-script tracking-tight">{name}</span>
      <span className="font-script tracking-tight">{number}</span>
    </span>
  )
}
