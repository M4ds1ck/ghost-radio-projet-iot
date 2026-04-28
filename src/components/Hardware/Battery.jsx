export default function Battery({ active = false, color = '#00ff88' }) {
  return (
    <svg viewBox="0 0 220 90" className="h-full w-full">
      <defs>
        <filter id="battery-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity={active ? '0.3' : '0'} />
        </filter>
      </defs>
      <rect x="18" y="18" width="184" height="54" rx="27" fill="#1f2937" stroke="#475569" filter="url(#battery-glow)" />
      <circle cx="52" cy="45" r="20" fill="#2563eb" opacity="0.8" />
      <circle cx="168" cy="45" r="20" fill="#ef4444" opacity="0.8" />
      <text x="40" y="49" fill="#fff" fontSize="16" fontFamily="JetBrains Mono, monospace">
        -
      </text>
      <text x="160" y="49" fill="#fff" fontSize="16" fontFamily="JetBrains Mono, monospace">
        +
      </text>
      <text x="110" y="50" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily="JetBrains Mono, monospace">
        18650
      </text>
    </svg>
  )
}
