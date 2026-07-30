/**
 * Verifies Salute 21 booking QR payloads round-trip (generate → decode).
 * Same payload format printed on the table pass: S21-XXXXXX-MMYY
 */
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'

const samples = ['S21-5T4S3H-0726', 'S21-7L1R9S-0826', 'S21-4M5T5H-0726']

let failed = 0
for (const value of samples) {
  const pngBuf = await QRCode.toBuffer(value, {
    type: 'png',
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 280,
    color: { dark: '#0c0b0a', light: '#f7f1e6' },
  })
  const png = PNG.sync.read(pngBuf)
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)
  const ok = decoded?.data === value
  console.log(`${ok ? '✓' : '✗'} ${value} → ${decoded?.data ?? 'NULL'}`)
  if (!ok) failed++
}

if (failed) {
  console.error(`QR verify failed: ${failed} sample(s)`)
  process.exit(1)
}
console.log('All booking QR samples decode correctly.')
