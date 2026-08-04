/** Dense hieroglyph wall — small carved marks across the pass. */
const GLYPHS = [
  '𓀀',
  '𓁹',
  '𓂀',
  '𓃭',
  '𓄿',
  '𓅓',
  '𓆑',
  '𓆓',
  '𓆣',
  '𓇋',
  '𓇳',
  '𓈖',
  '𓉐',
  '𓊪',
  '𓊽',
  '𓋴',
  '𓋹',
  '𓌳',
  '𓍯',
  '𓎛',
  '𓏏',
  '𓏥',
  '𓐍',
  '𓊃',
]

function buildWall(rows: number, cols: number, seed: number) {
  const lines: string[] = []
  for (let r = 0; r < rows; r++) {
    let line = ''
    for (let c = 0; c < cols; c++) {
      const i = (r * 7 + c * 3 + seed * 5) % GLYPHS.length
      line += GLYPHS[i] + (c < cols - 1 ? ' ' : '')
    }
    lines.push(line)
  }
  return lines
}

const WALL_A = buildWall(9, 14, 1)
const WALL_B = buildWall(9, 14, 4)

export function PassEgyptBackdrop() {
  return (
    <div className="boarding-pass__egypt" aria-hidden>
      <div className="boarding-pass__egypt-wall boarding-pass__egypt-wall--a">
        {WALL_A.map((line, i) => (
          <p key={`a-${i}`}>{line}</p>
        ))}
      </div>
      <div className="boarding-pass__egypt-wall boarding-pass__egypt-wall--b">
        {WALL_B.map((line, i) => (
          <p key={`b-${i}`}>{line}</p>
        ))}
      </div>
    </div>
  )
}
