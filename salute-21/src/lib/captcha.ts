export type CaptchaChallenge = {
  token: string
  question: string
  a: number
  b: number
}

export async function fetchCaptcha(): Promise<CaptchaChallenge> {
  try {
    const res = await fetch('/api/captcha', { headers: { Accept: 'application/json' } })
    const contentType = res.headers.get('content-type') || ''
    if (!res.ok || !contentType.includes('application/json')) throw new Error('unavailable')
    const data = (await res.json()) as CaptchaChallenge
    if (!data?.token || typeof data.a !== 'number' || typeof data.b !== 'number') {
      throw new Error('unavailable')
    }
    return {
      token: data.token,
      a: data.a,
      b: data.b,
      question: `${data.a} + ${data.b}`,
    }
  } catch {
    // Offline / preview fallback — still blocks casual bots on the form
    const a = 2 + Math.floor(Math.random() * 8)
    const b = 2 + Math.floor(Math.random() * 8)
    return {
      token: `local.${a}.${b}.${Date.now() + 10 * 60 * 1000}`,
      a,
      b,
      question: `${a} + ${b}`,
    }
  }
}

export function answerMatchesChallenge(challenge: CaptchaChallenge, answer: string) {
  const n = Number(String(answer).trim())
  return Number.isFinite(n) && n === challenge.a + challenge.b
}
