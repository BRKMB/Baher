/**
 * Offline, static conversion table (approximate rates, USD base).
 * Keeps the app 100% free of paid APIs — users can treat converted
 * totals as estimates. Rates are editable in one place here.
 */
const USD_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  EGP: 48.5,
  SAR: 3.75,
  AED: 3.67,
  KWD: 0.31,
  QAR: 3.64,
  JOD: 0.71,
  TRY: 34.5,
  INR: 84,
  CAD: 1.38,
  AUD: 1.52,
  JPY: 152,
}

export const CURRENCIES = Object.keys(USD_RATES)

const SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  EGP: 'E£',
  SAR: 'SR',
  AED: 'AED',
  KWD: 'KD',
  QAR: 'QR',
  JOD: 'JD',
  TRY: '₺',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
}

export function currencySymbol(code: string): string {
  return SYMBOLS[code] ?? code
}

export function convert(amount: number, from: string, to: string): number {
  if (from === to) return amount
  const fromRate = USD_RATES[from] ?? 1
  const toRate = USD_RATES[to] ?? 1
  return (amount / fromRate) * toRate
}

export function formatMoney(amount: number, currency: string, opts?: { compact?: boolean }): string {
  const decimals = amount >= 1000 || Number.isInteger(amount) ? 0 : 2
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: opts?.compact ? 0 : decimals,
    maximumFractionDigits: opts?.compact ? 0 : 2,
  })
  return `${currencySymbol(currency)}${formatted}`
}
