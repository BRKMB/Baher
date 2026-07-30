import { useEffect, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'

type PassBarcodeProps = {
  /** Exact booking reference — barcode payload is always this string. */
  value: string
  className?: string
}

/**
 * Full-width Code 128 barcode.
 * Encodes `value` literally (e.g. S21-7L1R9S-0826) so a scanner returns the same reference.
 */
export function PassBarcode({ value, className = '' }: PassBarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [ready, setReady] = useState(false)
  const payload = value.trim().toUpperCase()

  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !payload) {
      setReady(false)
      return
    }

    // Clear previous drawing so re-renders always match the latest reference
    while (svg.firstChild) svg.removeChild(svg.firstChild)
    svg.removeAttribute('viewBox')
    svg.removeAttribute('width')
    svg.removeAttribute('height')

    try {
      JsBarcode(svg, payload, {
        format: 'CODE128',
        displayValue: false,
        width: 1.55,
        height: 72,
        margin: 0,
        background: 'transparent',
        lineColor: '#0c0b0a',
        valid: (isValid) => {
          if (!isValid) setReady(false)
        },
      })
      svg.setAttribute('data-barcode-format', 'CODE128')
      svg.setAttribute('data-barcode-value', payload)
      setReady(true)
    } catch {
      setReady(false)
    }
  }, [payload])

  if (!payload) return null

  return (
    <div
      className={`pass-barcode ${className}`.trim()}
      data-barcode-format="CODE128"
      data-barcode-value={payload}
    >
      <svg ref={svgRef} role="img" aria-label={`Code 128: ${payload}`} />
      {!ready && (
        <p className="pass-barcode__fallback" aria-live="polite">
          {payload}
        </p>
      )}
    </div>
  )
}
