export default function Buttons({ label, active = false, color = '#3399ff' }) {
  return (
    <svg viewBox="0 0 110 110" className="h-full w-full">
      <defs>
        <filter id={`button-glow-${label}`}>
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity={active ? '0.35' : '0'} />
        </filter>
      </defs>
      <circle cx="55" cy="55" r="34" fill="#11151c" stroke="#475569" filter={`url(#button-glow-${label})`} />
      <circle cx="55" cy="55" r="16" fill={active ? color : '#334155'} />
      <text x="55" y="94" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily="JetBrains Mono, monospace">
        {label}
      </text>
    </svg>
  )
}
