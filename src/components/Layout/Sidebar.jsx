import { NavLink } from 'react-router-dom'
import { FIRMWARE_VERSION, SYSTEM_IP, formatModeLabel } from '../../constants/hardware'

function NavIcon({ type }) {
  switch (type) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 11.5 12 5l8 6.5" />
          <path d="M6.5 10.5V19h11v-8.5" />
        </svg>
      )
    case 'scanner':
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="3.5" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
        </svg>
      )
    case 'jam':
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M8 5v14" />
          <path d="M16 5v14" />
          <path d="M4 8c2-2 4-3 8-3s6 1 8 3" />
          <path d="M4 16c2 2 4 3 8 3s6-1 8-3" />
        </svg>
      )
    case 'replay':
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 7H4v5" />
          <path d="M17 17h3v-5" />
          <path d="M5 12a7 7 0 0 1 12-4" />
          <path d="M19 12a7 7 0 0 1-12 4" />
        </svg>
      )
    case 'wave':
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2 12c2-6 4-6 6 0s4 6 6 0 4-6 8 0" />
        </svg>
      )
    case 'plug':
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M7 8V3M17 8V3" />
          <path d="M6 8h12v2a6 6 0 0 1-6 6v5" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="5" y="4" width="14" height="4" />
          <rect x="5" y="10" width="14" height="4" />
          <rect x="5" y="16" width="14" height="4" />
        </svg>
      )
  }
}

const NAV_ITEMS = [
  { to: '/', icon: 'home', label: 'Dashboard' },
  { to: '/scanner', icon: 'scanner', label: 'Scanner' },
  { to: '/jamming', icon: 'jam', label: 'Jamming' },
  { to: '/replay', icon: 'replay', label: 'Replay' },
  { to: '/signal-normal', icon: 'wave', label: 'Signal Normal' },
  { to: '/topology', icon: 'plug', label: 'Topologie Hardware' },
  { to: '/architecture', icon: 'layers', label: 'Architecture IoT' },
]

export default function Sidebar({ currentMode, connected, mobileOpen, onClose }) {
  return (
    <>
      <button
        type="button"
        aria-label="Fermer la navigation"
        className={`fixed inset-0 z-30 bg-black/60 transition md:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-white/10 bg-[#0d1016] transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="text-sm uppercase tracking-[0.26em] text-[var(--accent-green)]">
            Ghost Radio
          </div>
          <div className="mt-2 text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Couche Application IoT
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'is-active' : ''}`}
            >
              <span className="flex h-5 w-5 items-center justify-center text-slate-400">
                <NavIcon type={item.icon} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4 text-[11px] uppercase tracking-[0.15em] text-slate-400">
          <div className="flex items-center gap-2">
            <span
              className={`status-led ${connected ? 'is-active' : ''}`}
              style={{ '--led-color': connected ? '#00ff88' : '#64748b' }}
            />
            <span>{connected ? `Connecte a ${SYSTEM_IP}` : 'Deconnecte'}</span>
          </div>
          <div className="mt-3 text-slate-500">{FIRMWARE_VERSION}</div>
          <div className="mt-2 text-slate-500">Mode actif: {formatModeLabel(currentMode)}</div>
        </div>
      </aside>
    </>
  )
}
