import { NavLink, useNavigate } from 'react-router-dom'
import { IconCalendar, IconChart, IconHome, IconPlus, IconScissors } from './icons'
import type { ReactNode } from 'react'

function Tab({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <NavLink to={to} aria-label={label} className="flex-1 h-full">
      {({ isActive }) => (
        <span
          className={`relative flex flex-col items-center justify-center gap-0.5 h-full transition-all duration-200 ${
            isActive ? 'text-mint-600 dark:text-mint-300' : 'text-ink-400 dark:text-ink-500'
          }`}
        >
          {isActive && (
            <span className="absolute top-1.5 w-7 h-[3px] rounded-full bg-mint-500 dark:bg-mint-400" />
          )}
          {icon}
          <span className="text-[10px] font-semibold tracking-wide">{label}</span>
        </span>
      )}
    </NavLink>
  )
}

export function TabBar() {
  const navigate = useNavigate()
  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-30 px-4 pointer-events-none"
      style={{ paddingBottom: 'calc(var(--sab, 0px) + 10px)' }}
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto relative glass-tab rounded-[28px] h-[64px] px-1.5 flex items-center">
        <Tab to="/" label="Home" icon={<IconHome className="w-[22px] h-[22px]" />} />
        <Tab to="/analytics" label="Stats" icon={<IconChart className="w-[22px] h-[22px]" />} />
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => navigate('/add')}
            aria-label="Add subscription"
            className="w-[52px] h-[52px] -mt-7 rounded-[20px] bg-gradient-to-br from-mint-400 to-mint-600 text-white flex items-center justify-center shadow-float active:scale-95 transition-transform ring-4 ring-white/55 dark:ring-ink-950/40"
          >
            <IconPlus className="w-6 h-6" strokeWidth={2.4} />
          </button>
        </div>
        <Tab to="/cancel" label="Guides" icon={<IconScissors className="w-[22px] h-[22px]" />} />
        <Tab to="/calendar" label="Calendar" icon={<IconCalendar className="w-[22px] h-[22px]" />} />
      </div>
    </nav>
  )
}
