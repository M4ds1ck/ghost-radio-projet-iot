import { NavLink } from 'react-router-dom'
import {
  CloseIcon,
  DashboardIcon,
  DeviceIcon,
  GhostRadioIcon,
  JammerIcon,
  ReplayIcon,
  ScannerIcon,
  SignalNormalIcon,
} from '../Icons'

const navItems = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon },
  { to: '/signal-normal', label: 'Signal Normal', icon: SignalNormalIcon },
  { to: '/scanner', label: 'Scanner', icon: ScannerIcon },
  { to: '/jamming', label: 'Jamming', icon: JammerIcon },
  { to: '/replay', label: 'Replay', icon: ReplayIcon },
]

export default function Sidebar({ mobileOpen, onClose, onOpenDevice }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden ${
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[color:var(--border)] bg-[rgba(11,14,18,0.96)] backdrop-blur-md transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between border-b border-[color:var(--border)] px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-sm border border-[rgba(0,255,65,0.25)] bg-[rgba(0,255,65,0.05)] p-2 text-[color:var(--accent-green)] shadow-[0_0_14px_rgba(0,255,65,0.12)]">
              <GhostRadioIcon className="h-8 w-8" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.18em] text-[color:var(--accent-green)]">
                Ghost Radio
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-slate-500">
                Couche Application
              </div>
            </div>
          </div>

          <button
            type="button"
            className="control-button px-3 md:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="space-y-2 px-4 py-5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-4 pb-5">
          <button
            type="button"
            onClick={onOpenDevice}
            className="control-button w-full justify-center border-[rgba(0,255,65,0.18)] text-[color:var(--accent-green)] shadow-[0_0_12px_rgba(0,255,65,0.12)]"
          >
            <DeviceIcon />
            <span>ESP32 SIM</span>
          </button>
          <div className="mt-4 border-t border-[color:var(--border)] pt-4 text-[10px] uppercase tracking-[0.15em] text-slate-500">
            GNU Radio 3.10.12.0 | ESP32-S3
          </div>
        </div>
      </aside>
    </>
  )
}
