export default function Antenna({ active = false, color = '#ffcc00' }) {
  return (
    <svg viewBox="0 0 160 220" className="h-full w-full">
      <defs>
        <filter id="antenna-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={color} floodOpacity={active ? '0.35' : '0'} />
        </filter>
      </defs>
      <rect x="58" y="182" width="44" height="18" rx="4" fill="#7c8796" stroke="#cbd5e1" />
      <rect x="66" y="166" width="28" height="18" rx="2" fill="#556274" stroke="#94a3b8" />
      <path
        d="M80 20 L92 40 L68 58 L92 76 L68 94 L92 112 L68 130 L92 148 L80 166"
        fill="none"
        stroke={active ? color : '#cbd5e1'}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#antenna-glow)"
      />
    </svg>
  )
}
