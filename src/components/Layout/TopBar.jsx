import { useEffect, useState } from 'react'
import { formatDbm, formatModeLabel, formatUptime, SYSTEM_IP } from '../../constants/hardware'

function formatClock(date) {
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export default function TopBar({ pageTitle, systemState, onToggleSidebar }) {
  const [clock, setClock] = useState(() => formatClock(new Date()))

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(formatClock(new Date()))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0f]">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-slate-300 transition hover:border-[var(--accent-green)] md:hidden"
        >
          <MenuIcon />
        </button>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Application / {pageTitle}
          </div>
          <div className="mt-1 text-sm uppercase tracking-[0.16em] text-slate-100">
            {formatModeLabel(systemState.mode)} | {SYSTEM_IP}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.15em]">
          <span className="topbar-chip">Batterie {systemState.battery}%</span>
          <span className="topbar-chip">RSSI {formatDbm(systemState.rssi)}</span>
          <span className="topbar-chip">Uptime {formatUptime(systemState.uptime)}</span>
          <span className="topbar-chip">API {systemState.lastApiCall}</span>
          <span className="topbar-chip">{clock}</span>
        </div>
      </div>
    </header>
  )
}
