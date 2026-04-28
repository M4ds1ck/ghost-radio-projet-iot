export default function CC1101({ active = false, color = '#3399ff' }) {
  return (
    <svg viewBox="0 0 220 140" className="h-full w-full">
      <defs>
        <filter id="cc1101-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={color} floodOpacity={active ? '0.35' : '0'} />
        </filter>
      </defs>
      <rect x="18" y="18" width="150" height="104" rx="8" fill="#0d4b39" stroke="#1f7a5b" filter="url(#cc1101-glow)" />
      <rect x="64" y="42" width="58" height="42" rx="4" fill="#0d1117" stroke="#2b3444" />
      <text x="93" y="68" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontFamily="JetBrains Mono, monospace">
        CC1101
      </text>
      <circle cx="186" cy="70" r="14" fill="#c5c8cf" stroke="#64748b" />
      <rect x="172" y="64" width="28" height="12" rx="4" fill="#64748b" />
      {['VCC', 'GND', 'MOSI', 'MISO', 'SCK', 'CSN', 'GDO0', 'GDO2'].map((pin, index) => (
        <g key={pin}>
          <rect x="10" y={24 + index * 12} width="8" height="5" fill="#d4a84c" />
          <text x="24" y={29 + index * 12} fill="#d8dee9" fontSize="8" fontFamily="JetBrains Mono, monospace">
            {pin}
          </text>
        </g>
      ))}
    </svg>
  )
}
