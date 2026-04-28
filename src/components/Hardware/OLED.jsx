export default function OLED({ active = false, mode = 'scanner', frequency = 446.0, color = '#00ff88' }) {
  return (
    <svg viewBox="0 0 220 140" className="h-full w-full">
      <defs>
        <filter id="oled-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={color} floodOpacity={active ? '0.35' : '0'} />
        </filter>
      </defs>
      <rect x="24" y="16" width="172" height="108" rx="8" fill="#16202f" stroke="#364152" filter="url(#oled-glow)" />
      <rect x="42" y="28" width="136" height="70" rx="4" fill="#04070a" stroke="#1f2937" />
      <text x="50" y="48" fill="#00ff88" fontSize="11" fontFamily="JetBrains Mono, monospace">
        MODE: {mode.toUpperCase()}
      </text>
      <text x="50" y="64" fill="#00ff88" fontSize="11" fontFamily="JetBrains Mono, monospace">
        FREQ: {frequency.toFixed(1)} MHz
      </text>
      <text x="50" y="80" fill="#00ff88" fontSize="11" fontFamily="JetBrains Mono, monospace">
        MENU: UP / DN / SEL
      </text>
      {['VCC', 'GND', 'SCL', 'SDA'].map((pin, index) => (
        <g key={pin}>
          <rect x={54 + index * 28} y="114" width="6" height="12" fill="#d4a84c" />
          <text x={47 + index * 28} y="136" fill="#d8dee9" fontSize="8" fontFamily="JetBrains Mono, monospace">
            {pin}
          </text>
        </g>
      ))}
    </svg>
  )
}
