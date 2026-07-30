/** Authentic Egyptian hieroglyph watermarks for the table pass. */
const MARKS = [
  { glyph: '𓋹', className: 'is-ankh' }, // ankh — life
  { glyph: '𓂀', className: 'is-eye' }, // Eye of Horus
  { glyph: '𓆣', className: 'is-scarab' }, // scarab
  { glyph: '𓇳', className: 'is-ra' }, // sun disk of Ra
  { glyph: '𓊽', className: 'is-djed' }, // djed pillar
  { glyph: '𓆓', className: 'is-uraeus' }, // uraeus / cobra
] as const

export function PassEgyptBackdrop() {
  return (
    <div className="boarding-pass__egypt" aria-hidden>
      {MARKS.map((mark) => (
        <span key={mark.className} className={`boarding-pass__glyph ${mark.className}`}>
          {mark.glyph}
        </span>
      ))}
      <p className="boarding-pass__egypt-row">𓋹 · 𓆣 · 𓇳 · 𓂀 · 𓊽</p>
    </div>
  )
}
