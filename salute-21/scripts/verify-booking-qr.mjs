/**
 * Verifies Salute 21 booking barcode payloads (Code 128 on the table pass).
 * Payload format: S21-XXXXXX-MMYY — encoded literally by PassBarcode / jsbarcode.
 */
import JsBarcode from 'jsbarcode'

const samples = ['S21-5T4S3H-0726', 'S21-7L1R9S-0826', 'S21-4M5T5H-0726']

function extractBookingId(raw) {
  const text = String(raw || '').trim()
  if (!text) return ''
  const direct = text.toUpperCase().match(/S21-[A-Z0-9]{6}-\d{4}/)
  return direct ? direct[0] : text.toUpperCase()
}

/** Minimal SVG stub so jsbarcode can encode without a browser DOM. */
function makeSvg() {
  const attrs = new Map()
  const children = []
  const node = {
    nodeType: 1,
    tagName: 'svg',
    childNodes: children,
    children,
    style: {},
    get firstChild() {
      return children[0] || null
    },
    setAttribute(k, v) {
      attrs.set(k, String(v))
    },
    getAttribute(k) {
      return attrs.has(k) ? attrs.get(k) : null
    },
    removeAttribute(k) {
      attrs.delete(k)
    },
    hasAttribute(k) {
      return attrs.has(k)
    },
    appendChild(child) {
      children.push(child)
      return child
    },
    removeChild(child) {
      const i = children.indexOf(child)
      if (i >= 0) children.splice(i, 1)
      return child
    },
    getElementsByTagName() {
      return []
    },
  }
  return node
}

function makeEl(tag) {
  const attrs = new Map()
  const children = []
  return {
    nodeType: 1,
    tagName: tag,
    childNodes: children,
    children,
    style: {},
    setAttribute(k, v) {
      attrs.set(k, String(v))
    },
    getAttribute(k) {
      return attrs.has(k) ? attrs.get(k) : null
    },
    appendChild(child) {
      children.push(child)
      return child
    },
  }
}

const xmlDocument = {
  createElementNS(_ns, tag) {
    return makeEl(tag)
  },
}

let failed = 0
for (const value of samples) {
  const svg = makeSvg()
  let valid = false
  try {
    JsBarcode(svg, value, {
      format: 'CODE128',
      displayValue: false,
      width: 1.55,
      height: 72,
      margin: 0,
      xmlDocument,
      valid: (isValid) => {
        valid = isValid
      },
    })
  } catch (err) {
    console.log(`✗ ${value} → encode error: ${err instanceof Error ? err.message : err}`)
    failed++
    continue
  }

  const parsed = extractBookingId(value) === value
  const ok = valid && parsed
  console.log(`${ok ? '✓' : '✗'} ${value} → CODE128 valid=${valid} · parse=${parsed}`)
  if (!ok) failed++
}

if (failed) {
  console.error(`Barcode verify failed: ${failed} sample(s)`)
  process.exit(1)
}
console.log('All booking Code 128 samples encode correctly.')
