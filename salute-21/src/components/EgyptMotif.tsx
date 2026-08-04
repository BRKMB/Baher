/** Subtle Egyptian divider — genuine hieroglyphs (ankh · scarab · Ra). */
export function EgyptMotif({ className = '' }: { className?: string }) {
  return (
    <div className={`egypt-motif ${className}`.trim()} aria-hidden>
      <span className="egypt-motif__line" />
      <span className="egypt-motif__glyph">𓋹 · 𓆣 · 𓇳</span>
      <span className="egypt-motif__line" />
    </div>
  )
}
