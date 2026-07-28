import { useEffect, useState, type ReactNode } from 'react'

/** iPhone 16 Pro Max logical viewport in CSS points. */
const SCREEN_W = 440
const SCREEN_H = 956
const BEZEL = 14

function useViewport() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

function StatusBar() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false })
  return (
    <div className="absolute top-0 left-0 right-0 z-40 flex items-end justify-between px-10 pt-4 h-[54px] pointer-events-none select-none">
      <span className="text-[17px] font-semibold tracking-tight text-ink-900 dark:text-ink-50 w-14">{time}</span>
      <div className="flex items-center gap-1.5 text-ink-900 dark:text-ink-50">
        {/* signal */}
        <svg className="w-[19px] h-[12px]" viewBox="0 0 19 12" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0.5" width="3" height="11.5" rx="1" />
        </svg>
        {/* wifi */}
        <svg className="w-[17px] h-[12px]" viewBox="0 0 17 12" fill="currentColor" aria-hidden>
          <path d="M8.5 9.7a1.6 1.6 0 0 1 1.6 1.6L8.5 12l-1.6-.7a1.6 1.6 0 0 1 1.6-1.6Z" />
          <path d="M8.5 5.4c1.7 0 3.3.6 4.5 1.7l-1.4 1.5a4.6 4.6 0 0 0-6.2 0L4 7.1a6.6 6.6 0 0 1 4.5-1.7Z" />
          <path d="M8.5 1c2.9 0 5.6 1.1 7.6 3l-1.4 1.4A8.9 8.9 0 0 0 8.5 3c-2.4 0-4.6.9-6.2 2.4L.9 4A10.9 10.9 0 0 1 8.5 1Z" />
        </svg>
        {/* battery */}
        <svg className="w-[27px] h-[13px]" viewBox="0 0 27 13" aria-hidden>
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="17" height="9" rx="2" fill="currentColor" />
          <path d="M25.5 4.5v4a2.2 2.2 0 0 0 0-4Z" fill="currentColor" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  )
}

function DynamicIsland() {
  return (
    <div className="absolute top-[12px] left-1/2 -translate-x-1/2 z-50 w-[125px] h-[37px] bg-black rounded-full pointer-events-none" />
  )
}

function HomeIndicator() {
  return (
    <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 z-50 w-[150px] h-[5px] rounded-full bg-ink-900/90 dark:bg-ink-50/90 pointer-events-none" />
  )
}

/**
 * Renders children inside an iPhone 16 Pro Max frame on desktop,
 * or full-bleed on real mobile devices.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const { w, h } = useViewport()
  const framed = w >= 900

  if (!framed) {
    return (
      <div
        className="relative h-dvh w-full overflow-hidden bg-ink-50 dark:bg-ink-950"
        style={{ ['--sat' as string]: 'env(safe-area-inset-top, 0px)', ['--sab' as string]: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {children}
      </div>
    )
  }

  const totalH = SCREEN_H + BEZEL * 2
  const totalW = SCREEN_W + BEZEL * 2
  const scale = Math.min(1, (h - 48) / totalH, (w - 48) / totalW)

  return (
    <div className="h-dvh w-full flex items-center justify-center overflow-hidden">
      <div style={{ transform: `scale(${scale})` }}>
        <div
          className="relative rounded-[68px] bg-[#3a3c40] p-[2.5px]"
          style={{ boxShadow: '0 40px 80px -20px rgb(0 0 0 / 0.5), 0 0 0 1px rgb(255 255 255 / 0.08) inset' }}
        >
          {/* titanium band */}
          <div className="rounded-[66px] bg-gradient-to-b from-[#5b5e64] via-[#3f4147] to-[#55585e] p-[3.5px]">
            <div className="rounded-[62px] bg-black" style={{ padding: BEZEL - 6 }}>
              {/* screen */}
              <div
                className="relative overflow-hidden rounded-[55px] bg-ink-50 dark:bg-ink-950"
                style={{
                  width: SCREEN_W,
                  height: SCREEN_H,
                  ['--sat' as string]: '54px',
                  ['--sab' as string]: '24px',
                }}
              >
                <DynamicIsland />
                <StatusBar />
                {children}
                <HomeIndicator />
              </div>
            </div>
          </div>
          {/* side buttons */}
          <div className="absolute -left-[2.5px] top-[190px] w-[3px] h-[36px] rounded-l bg-[#4a4d53]" />
          <div className="absolute -left-[2.5px] top-[250px] w-[3px] h-[64px] rounded-l bg-[#4a4d53]" />
          <div className="absolute -left-[2.5px] top-[326px] w-[3px] h-[64px] rounded-l bg-[#4a4d53]" />
          <div className="absolute -right-[2.5px] top-[280px] w-[3px] h-[92px] rounded-r bg-[#4a4d53]" />
        </div>
      </div>
    </div>
  )
}
