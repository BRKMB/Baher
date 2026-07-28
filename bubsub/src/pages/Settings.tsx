import { useRef, useState } from 'react'
import { useStore } from '../lib/store'
import { CURRENCIES } from '../lib/currency'
import { downloadFile, fromCSV, toCSV } from '../lib/csv'
import { todayISO } from '../lib/dates'
import { Card, PageHeader, SectionTitle } from '../components/ui'
import { IconDownload, IconShield, IconUpload } from '../components/icons'
import type { Subscription, ThemePref } from '../lib/types'

const THEMES: { id: ThemePref; label: string; emoji: string }[] = [
  { id: 'system', label: 'Auto', emoji: '✨' },
  { id: 'light', label: 'Light', emoji: '☀️' },
  { id: 'dark', label: 'Dark', emoji: '🌙' },
]

export function Settings() {
  const { subscriptions, settings, setSettings, replaceAll, resetAll } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)
  const [confirmWipe, setConfirmWipe] = useState(false)

  const notify = (text: string, ok = true) => {
    setMessage({ text, ok })
    setTimeout(() => setMessage(null), 4000)
  }

  const exportJSON = () => {
    downloadFile(
      `bubsub-backup-${todayISO()}.json`,
      JSON.stringify({ version: 1, exportedAt: todayISO(), subscriptions }, null, 2),
      'application/json',
    )
    notify('Backup downloaded.')
  }

  const exportCSV = () => {
    downloadFile(`bubsub-${todayISO()}.csv`, toCSV(subscriptions), 'text/csv')
    notify('CSV downloaded.')
  }

  const onImportFile = async (file: File) => {
    try {
      const text = await file.text()
      let imported: Subscription[]
      if (file.name.endsWith('.json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
        const parsed = JSON.parse(text)
        const arr = Array.isArray(parsed) ? parsed : parsed.subscriptions
        if (!Array.isArray(arr)) throw new Error('JSON must contain a "subscriptions" array.')
        imported = arr
      } else {
        imported = fromCSV(text)
      }
      // merge: imported entries replace same ids, new ones appended
      const existingIds = new Set(subscriptions.map((s) => s.id))
      const merged = [
        ...subscriptions.map((s) => imported.find((i) => i.id === s.id) ?? s),
        ...imported.filter((i) => !existingIds.has(i.id)),
      ]
      replaceAll(merged)
      notify(`Imported ${imported.length} subscription${imported.length === 1 ? '' : 's'}.`)
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Import failed — check the file format.', false)
    }
  }

  return (
    <div className="page-in">
      <PageHeader title="Settings" back />
      <div className="px-5" style={{ paddingBottom: 'calc(var(--sab, 0px) + 96px)' }}>
        <SectionTitle>Appearance</SectionTitle>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSettings({ theme: t.id })}
              className={`h-[64px] rounded-2xl flex flex-col items-center justify-center gap-1 text-[13px] font-semibold transition-colors ${
                settings.theme === t.id
                  ? 'bg-ink-900 text-white dark:bg-ink-50 dark:text-ink-900'
                  : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-300 border border-ink-100/80 dark:border-ink-800'
              }`}
            >
              <span className="text-[18px]">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        <SectionTitle>Display currency</SectionTitle>
        <Card className="p-4">
          <select
            value={settings.currency}
            onChange={(e) => setSettings({ currency: e.target.value })}
            aria-label="Display currency"
            className="w-full h-[44px] px-3 rounded-xl bg-ink-50 dark:bg-ink-850 text-[15px] font-semibold text-ink-900 dark:text-ink-50"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <p className="text-[12px] text-ink-400 mt-2.5 leading-snug px-1">
            Conversions use built-in approximate rates and run entirely on your device — no external services, treat totals as estimates.
          </p>
        </Card>

        <SectionTitle>Your data</SectionTitle>
        <div className="space-y-2.5">
          <button onClick={exportJSON} className="w-full flex items-center gap-3.5 p-4 rounded-3xl bg-white dark:bg-ink-900 border border-ink-100/80 dark:border-ink-800 text-left">
            <IconDownload className="w-5 h-5 text-mint-600 dark:text-mint-400 shrink-0" />
            <div>
              <p className="text-[15px] font-semibold text-ink-900 dark:text-ink-50">Export backup (JSON)</p>
              <p className="text-[12px] text-ink-400">Full backup you can restore anytime</p>
            </div>
          </button>
          <button onClick={exportCSV} className="w-full flex items-center gap-3.5 p-4 rounded-3xl bg-white dark:bg-ink-900 border border-ink-100/80 dark:border-ink-800 text-left">
            <IconDownload className="w-5 h-5 text-mint-600 dark:text-mint-400 shrink-0" />
            <div>
              <p className="text-[15px] font-semibold text-ink-900 dark:text-ink-50">Export CSV</p>
              <p className="text-[12px] text-ink-400">Open in Excel, Numbers or Google Sheets</p>
            </div>
          </button>
          <button onClick={() => fileRef.current?.click()} className="w-full flex items-center gap-3.5 p-4 rounded-3xl bg-white dark:bg-ink-900 border border-ink-100/80 dark:border-ink-800 text-left">
            <IconUpload className="w-5 h-5 text-mint-600 dark:text-mint-400 shrink-0" />
            <div>
              <p className="text-[15px] font-semibold text-ink-900 dark:text-ink-50">Import (CSV or JSON)</p>
              <p className="text-[12px] text-ink-400">Restore a backup or bring data from elsewhere</p>
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.json,text/csv,application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImportFile(f)
              e.target.value = ''
            }}
          />
        </div>

        {message && (
          <p className={`mt-3 text-center text-[13px] font-semibold ${message.ok ? 'text-mint-600 dark:text-mint-400' : 'text-red-500'}`}>
            {message.text}
          </p>
        )}

        <SectionTitle>Privacy</SectionTitle>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <IconShield className="w-5 h-5 text-mint-600 dark:text-mint-400 shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-[13px] leading-relaxed text-ink-600 dark:text-ink-300">
              Everything you add lives in <strong>your browser only</strong>. No account, no server, no tracking, nothing sold — ever. Deleting your data below removes it permanently.
            </p>
          </div>
        </Card>

        <SectionTitle>Support BUB SUB</SectionTitle>
        <Card className="p-4">
          <p className="text-[13px] leading-relaxed text-ink-600 dark:text-ink-300">
            BUB SUB is free forever — no paywalls, no locked features. If it saved you money, you can support the project with a one-time donation and get a cosmetic Supporter badge. 💚
          </p>
        </Card>

        <SectionTitle>Danger zone</SectionTitle>
        {confirmWipe ? (
          <div className="p-4 rounded-3xl bg-red-50 dark:bg-red-500/10 border border-red-200/70 dark:border-red-500/25">
            <p className="text-[13px] font-semibold text-red-700 dark:text-red-300 text-center mb-3">
              Erase everything and restore demo data? Export a backup first if unsure.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setConfirmWipe(false)}
                className="h-[44px] rounded-2xl bg-white dark:bg-ink-900 text-[14px] font-bold text-ink-700 dark:text-ink-200 border border-ink-100/80 dark:border-ink-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAll()
                  setConfirmWipe(false)
                  notify('All data erased.')
                }}
                className="h-[44px] rounded-2xl bg-red-500 text-white text-[14px] font-bold"
              >
                Erase all
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmWipe(true)}
            className="w-full h-[48px] rounded-2xl text-[14px] font-semibold text-red-500 bg-white dark:bg-ink-900 border border-ink-100/80 dark:border-ink-800"
          >
            Erase all my data
          </button>
        )}

        <p className="text-center text-[11px] text-ink-400 dark:text-ink-600 mt-8">
          BUB SUB v1.0 · local-first · zero operating costs · made with 💚
        </p>
      </div>
    </div>
  )
}
