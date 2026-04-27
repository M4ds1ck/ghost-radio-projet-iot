function createPath(data, key, width, height, padding) {
  const usableWidth = width - padding * 2
  const usableHeight = height - padding * 2

  return data
    .map((point, index) => {
      const x = padding + point.x * usableWidth
      const sample = point[key]
      const y = padding + (1 - (sample + 1.2) / 2.4) * usableHeight
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

export default function WaveformChart({
  data,
  height = 220,
  playhead = null,
  lines = [
    { key: 'i', color: 'var(--accent-green)', label: 'I' },
    { key: 'q', color: 'var(--accent-blue)', label: 'Q' },
  ],
}) {
  const width = 960
  const padding = 18

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        {Array.from({ length: 10 }, (_, index) => {
          const x = padding + ((width - padding * 2) / 9) * index
          return (
            <line
              key={`v-${x}`}
              x1={x}
              x2={x}
              y1={padding}
              y2={height - padding}
              stroke="rgba(74,85,104,0.16)"
            />
          )
        })}
        {Array.from({ length: 6 }, (_, index) => {
          const y = padding + ((height - padding * 2) / 5) * index
          return (
            <line
              key={`h-${y}`}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="rgba(74,85,104,0.16)"
            />
          )
        })}

        <line
          x1={padding}
          x2={width - padding}
          y1={height / 2}
          y2={height / 2}
          stroke="rgba(226,232,240,0.14)"
          strokeDasharray="4 8"
        />

        {lines.map((line) => (
          <g key={line.key}>
            <path
              d={createPath(data, line.key, width, height, padding)}
              fill="none"
              stroke={line.color}
              strokeWidth="5"
              opacity="0.16"
              style={{ filter: `drop-shadow(0 0 9px ${line.color})` }}
            />
            <path
              d={createPath(data, line.key, width, height, padding)}
              fill="none"
              stroke={line.color}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        ))}

        {playhead !== null && (
          <line
            x1={padding + (width - padding * 2) * playhead}
            x2={padding + (width - padding * 2) * playhead}
            y1={padding}
            y2={height - padding}
            stroke="rgba(255,255,255,0.58)"
            strokeWidth="1.5"
            strokeDasharray="5 6"
          />
        )}
      </svg>
      <div className="pointer-events-none absolute right-3 top-3 flex gap-3 text-[10px] uppercase tracking-[0.15em] text-slate-400">
        {lines.map((line) => (
          <div key={line.key} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: line.color, boxShadow: `0 0 8px ${line.color}` }}
            />
            <span>{line.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
