function iconProps(className) {
  return {
    className,
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: '1.6',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }
}

export function GhostRadioIcon({ className = 'h-8 w-8' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 3c-3.9 0-7 2.9-7 6.5V13a6.4 6.4 0 0 0 4.1 5.9L8.5 22h2.7l.6-2.2c.1-.5.8-.5.9 0l.6 2.2h2.7l-.6-3.1A6.4 6.4 0 0 0 19 13V9.5C19 5.9 15.9 3 12 3Z" />
      <circle cx="9.4" cy="10.5" r="1.1" fill="currentColor" />
      <circle cx="14.6" cy="10.5" r="1.1" fill="currentColor" />
      <path d="M10 15c.7.7 3.3.7 4 0" />
      <path d="M3 8c1.6-2 3.2-3 5.5-3.8" />
      <path d="M21 8c-1.6-2-3.2-3-5.5-3.8" />
    </svg>
  )
}

export function DashboardIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="10" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="16" width="6" height="4" />
    </svg>
  )
}

export function SignalNormalIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M3 13c2-7 4-7 6 0s4 7 6 0 4-7 6 0" />
      <path d="M3 7h18" opacity="0.35" />
      <path d="M3 19h18" opacity="0.35" />
    </svg>
  )
}

export function ScannerIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 4v3" />
      <path d="M12 17v3" />
      <path d="M4 12h3" />
      <path d="M17 12h3" />
      <path d="m6.2 6.2 2.2 2.2" />
      <path d="m15.6 15.6 2.2 2.2" />
      <path d="m17.8 6.2-2.2 2.2" />
      <path d="m6.2 17.8 2.2-2.2" />
    </svg>
  )
}

export function JammerIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="m13 2-7 10h5l-1 10 8-12h-5l1-8Z" />
      <path d="M3 14h2" />
      <path d="M19 14h2" />
    </svg>
  )
}

export function ReplayIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M8 7H4v4" />
      <path d="M4.5 10A8 8 0 0 1 18 8" />
      <path d="M16 17h4v-4" />
      <path d="M19.5 14A8 8 0 0 1 6 16" />
      <path d="m10 8 6 4-6 4V8Z" />
    </svg>
  )
}

export function DeviceIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <rect x="8.5" y="6" width="7" height="8" rx="1" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function MenuIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

export function CloseIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

export function BatteryIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="2.5" y="7" width="18" height="10" rx="2" />
      <path d="M22 10v4" />
      <rect x="4.5" y="9" width="11.8" height="6" rx="1" fill="currentColor" />
    </svg>
  )
}

export function SignalBarsIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M4 19v-4" />
      <path d="M8 19v-7" />
      <path d="M12 19V9" />
      <path d="M16 19V6" />
      <path d="M20 19V11" opacity="0.35" />
    </svg>
  )
}

export function WarningIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 4 3.5 19h17L12 4Z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </svg>
  )
}

export function PlayIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="m8 6 10 6-10 6V6Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PauseIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="7" y="6" width="3" height="12" fill="currentColor" stroke="none" />
      <rect x="14" y="6" width="3" height="12" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ResetIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M4 4v6h6" />
      <path d="M4.5 10a8 8 0 1 0 2.2-4.9" />
    </svg>
  )
}

export function RadarIcon({ className = 'h-6 w-6' }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12 18 8" />
      <path d="M8.5 16.5A5 5 0 1 1 16.5 8.5" />
      <path d="M12 4v16" opacity="0.3" />
      <path d="M4 12h16" opacity="0.3" />
    </svg>
  )
}

export function InterferenceIcon({ className = 'h-6 w-6' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M3 8h5l3 8 2-4h8" />
      <path d="M4 16h3l2-3 2 5 2-3h7" opacity="0.55" />
    </svg>
  )
}

export function LoopSignalIcon({ className = 'h-6 w-6' }) {
  return (
    <svg {...iconProps(className)}>
      <path d="M4 9a7 7 0 0 1 12-2l2-2v6h-6l2-2A4 4 0 0 0 7 10" />
      <path d="M20 15a7 7 0 0 1-12 2l-2 2v-6h6l-2 2a4 4 0 0 0 7-1" />
    </svg>
  )
}

export function FlowGraphIcon({ className = 'h-5 w-5' }) {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="6" width="5" height="4" />
      <rect x="10" y="14" width="5" height="4" />
      <rect x="16" y="6" width="5" height="4" />
      <path d="M8 8h8" />
      <path d="M12.5 10v4" />
    </svg>
  )
}
