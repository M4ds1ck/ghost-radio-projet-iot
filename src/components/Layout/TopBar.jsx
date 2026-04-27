import { useEffect, useState } from 'react'
import { BatteryIcon, MenuIcon, SignalBarsIcon } from '../Icons'
import StatusBadge from '../StatusBadge'

function formatClock(date) {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function TopBar({ statuses, jammerActive, onToggleSidebar }) {
  const [clock, setClock] = useState(() => formatClock(new Date()))

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(formatClock(new Date()))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--border)] bg-[rgba(10,12,15,0.84)] backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            className="control-button px-3 md:hidden"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation"
          >
            <MenuIcon />
          </button>
          <div className="min-w-0 text-sm uppercase tracking-[0.18em] text-[color:var(--accent-green)]">
            <span className="truncate font-semibold">GHOST RADIO v2.4.1</span>
            <span className="cursor-blink ml-1">{'\u258c'}</span>
          </div>
          {jammerActive && (
            <span className="topbar-banner hidden rounded-sm border border-[rgba(255,45,85,0.45)] bg-[rgba(255,45,85,0.12)] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[color:var(--accent-red)] xl:inline-flex">
              JAMMING ACTIVE
            </span>
          )}
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <StatusBadge label="Signal Normal" status={statuses.signalNormal} />
          <StatusBadge label="Scanner" status={statuses.scanner} />
          <StatusBadge label="Jammer" status={statuses.jammer} />
          <StatusBadge label="Replay" status={statuses.replay} />
        </div>

        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-slate-300">
          <div className="label-chip">
            <BatteryIcon className="h-4 w-4 text-[color:var(--accent-green)]" />
            <span>87%</span>
          </div>
          <div className="label-chip">
            <SignalBarsIcon className="h-4 w-4 text-[color:var(--accent-blue)]" />
            <span>4/5</span>
          </div>
          <div className="label-chip">
            <span>{clock}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-3 xl:hidden">
        <StatusBadge label="Signal Normal" status={statuses.signalNormal} />
        <StatusBadge label="Scanner" status={statuses.scanner} />
        <StatusBadge label="Jammer" status={statuses.jammer} />
        <StatusBadge label="Replay" status={statuses.replay} />
      </div>
    </header>
  )
}
