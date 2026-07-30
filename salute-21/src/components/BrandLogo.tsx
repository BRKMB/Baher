type BrandLogoProps = {
  /** light = white logo for dark backgrounds; dark = black logo for light backgrounds */
  tone?: 'light' | 'dark'
  className?: string
}

export function BrandLogo({ tone = 'dark', className = 'h-10 w-auto md:h-12' }: BrandLogoProps) {
  const src = tone === 'light' ? '/images/logo-light.png' : '/images/logo-dark.png'
  return <img src={src} alt="Salute!" className={className} />
}
