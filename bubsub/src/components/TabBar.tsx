import { NavLink, useNavigate } from 'react-router-dom'
import { IconCalendar, IconChart, IconHome, IconPlus, IconScissors } from './icons'
import type { ReactNode } from 'react'

function Tab({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
          isActive ? 'text-mint-600 dark:text-mint-400' : 'text-ink-400 dark:text-ink-500'
        }`
      }
      aria-label={label}
    >
      {icon}
      <span className="text-[10px] font-semibold tracking-wide">{label}</span>
    </NavLink>
  )
}

export function TabBar() {
  const navigate = useNavigate()
  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-30 bg-white/80 dark:bg-ink-900/80 backdrop-blur-xl border-t border-ink-100/80 dark:border-ink-800/80"
      style={{ paddingBottom: 'var(--sab, 0px)' }}
      aria-label="Main navigation"
    >
      <div className="flex items-center h-[56px] px-2">
        <Tab to="/" label="Home" icon={<IconHome className="w-[24px] h-[24px]" />} />
        <Tab to="/analytics" label="Stats" icon={<IconChart className="w-[24px] h-[24px]" />} />
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => navigate('/add')}
            aria-label="Add subscription"
            className="w-[46px] h-[46px] -mt-5 rounded-full bg-mint-500 text-white flex items-center justify-center shadow-float active:scale-95 transition-transform"
          >
            <IconPlus className="w-6 h-6" strokeWidth={2.4} />
          </button>
        </div>
        <Tab to="/cancel" label="Guides" icon={<IconScissors className="w-[24px] h-[24px]" />} />
        <Tab to="/calendar" label="Calendar" icon={<IconCalendar className="w-[24px] h-[24px]" />} />
      </div>
    </nav>
  )
}
