export default function ESP32({ active = false, color = '#00ff88' }) {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full">
      <defs>
        <filter id="esp32-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={color} floodOpacity={active ? '0.35' : '0'} />
        </filter>
      </defs>
      <rect x="32" y="12" width="176" height="126" rx="8" fill="#11151c" stroke="#2b3444" filter="url(#esp32-glow)" />
      <rect x="86" y="34" width="68" height="48" rx="4" fill="#05070b" stroke="#39455a" />
      <text x="120" y="64" textAnchor="middle" fill="#e2e8f0" fontSize="18" fontFamily="JetBrains Mono, monospace">
        ESP32
      </text>
      <circle cx="168" cy="102" r="5" fill={active ? '#00ff88' : '#334155'} />
      {Array.from({ length: 10 }, (_, index) => (
        <g key={`left-${index}`}>
          <rect x="20" y={18 + index * 11} width="10" height="6" fill="#d4a84c" />
          <rect x="210" y={18 + index * 11} width="10" height="6" fill="#d4a84c" />
        </g>
      ))}
      <text x="48" y="114" fill="#8da2c0" fontSize="9" fontFamily="JetBrains Mono, monospace">
        GPIO5 SCK
      </text>
      <text x="48" y="126" fill="#8da2c0" fontSize="9" fontFamily="JetBrains Mono, monospace">
        GPIO19 MISO
      </text>
      <text x="128" y="114" fill="#8da2c0" fontSize="9" fontFamily="JetBrains Mono, monospace">
        GPIO21 SDA
      </text>
      <text x="128" y="126" fill="#8da2c0" fontSize="9" fontFamily="JetBrains Mono, monospace">
        GPIO22 SCL
      </text>
    </svg>
  )
}
