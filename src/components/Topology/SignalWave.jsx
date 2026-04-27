function getWaveConfig(mode) {
  switch (mode) {
    case 'jamming':
      return { color: '#ff2d55', duration: '0.4s', amplitude: 24, width: 3.5 }
    case 'sniffer':
      return { color: '#00d4ff', duration: '0.8s', amplitude: 18, width: 3 }
    case 'replay':
      return { color: '#ff9500', duration: '0.6s', amplitude: 16, width: 3.2 }
    default:
      return { color: '#00ff41', duration: '1.5s', amplitude: 6, width: 2.4 }
  }
}

function buildWavePath(length, centerY, amplitude) {
  const segments = Math.max(4, Math.floor(length / 90))
  const segmentWidth = length / segments
  let path = `M 0 ${centerY}`

  for (let index = 0; index < segments; index += 1) {
    const controlX = segmentWidth * index + segmentWidth / 2
    const controlY = index % 2 === 0 ? centerY - amplitude : centerY + amplitude
    const endX = segmentWidth * (index + 1)
    path += ` Q ${controlX} ${controlY}, ${endX} ${centerY}`
  }

  return path
}

export default function SignalWave({
  mode,
  active,
  direction = 'right',
  from,
  to,
}) {
  if (!from || !to) {
    return null
  }

  const config = getWaveConfig(mode)
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI
  const height = Math.max(52, config.amplitude * 3)
  const centerY = height / 2
  const wavePath = buildWavePath(length, centerY, config.amplitude)

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: from.x,
        top: from.y - centerY,
        width: length,
        height,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 50%',
        opacity: active ? 1 : 0.3,
      }}
    >
      <svg width={length} height={height} viewBox={`0 0 ${length} ${height}`}>
        <path
          d={wavePath}
          fill="none"
          stroke={config.color}
          strokeWidth={config.width}
          strokeDasharray="14 10"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 10px ${config.color})`,
          }}
        >
          <animate
            attributeName="stroke-dashoffset"
            values={direction === 'left' ? '48;0' : '0;-48'}
            dur={config.duration}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.45;1;0.45"
            dur={config.duration}
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  )
}
