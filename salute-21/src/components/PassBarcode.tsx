import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

type PassBarcodeProps = {
  value: string
  className?: string
}

/** Full-width Code128 barcode for boarding-pass style tickets. */
export function PassBarcode({ value, className = '' }: PassBarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !value) return
    try {
      JsBarcode(svgRef.current, value, {
        format: 'CODE128',
        displayValue: false,
        width: 1.6,
        height: 72,
        margin: 0,
        background: 'transparent',
        lineColor: '#0c0b0a',
      })
    } catch {
      /* ignore invalid barcode payloads */
    }
  }, [value])

  return (
    <div className={`pass-barcode ${className}`.trim()}>
      <svg ref={svgRef} role="img" aria-label={value} />
    </div>
  )
}
