import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppData, Settings, Subscription } from './types'
import { seedSubscriptions } from '../data/seed'

const STORAGE_KEY = 'bubsub:v1'

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  currency: 'USD',
  guideVotes: {},
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppData
      if (parsed && Array.isArray(parsed.subscriptions)) {
        return {
          version: 1,
          subscriptions: parsed.subscriptions,
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
        }
      }
    }
  } catch {
    // corrupted storage — fall back to demo data
  }
  return { version: 1, subscriptions: seedSubscriptions(), settings: DEFAULT_SETTINGS }
}

interface StoreValue {
  subscriptions: Subscription[]
  settings: Settings
  addSubscription: (sub: Subscription) => void
  updateSubscription: (id: string, patch: Partial<Subscription>) => void
  deleteSubscription: (id: string) => void
  setSettings: (patch: Partial<Settings>) => void
  replaceAll: (subs: Subscription[]) => void
  resetAll: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // Apply theme preference to the document element.
  useEffect(() => {
    const apply = () => {
      const pref = data.settings.theme
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const dark = pref === 'dark' || (pref === 'system' && systemDark)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [data.settings.theme])

  const value = useMemo<StoreValue>(
    () => ({
      subscriptions: data.subscriptions,
      settings: data.settings,
      addSubscription: (sub) =>
        setData((d) => ({ ...d, subscriptions: [sub, ...d.subscriptions] })),
      updateSubscription: (id, patch) =>
        setData((d) => ({
          ...d,
          subscriptions: d.subscriptions.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
      deleteSubscription: (id) =>
        setData((d) => ({ ...d, subscriptions: d.subscriptions.filter((s) => s.id !== id) })),
      setSettings: (patch) =>
        setData((d) => ({ ...d, settings: { ...d.settings, ...patch } })),
      replaceAll: (subs) => setData((d) => ({ ...d, subscriptions: subs })),
      resetAll: () => {
        localStorage.removeItem(STORAGE_KEY)
        setData({ version: 1, subscriptions: seedSubscriptions(), settings: DEFAULT_SETTINGS })
      },
    }),
    [data],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
