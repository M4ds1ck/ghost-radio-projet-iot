function buildPath(from, to, points = []) {
  const pathPoints = [from, ...points, to]
  return pathPoints.reduce((accumulator, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`
    }

    return `${accumulator} L ${point.x} ${point.y}`
  }, '')
}

const TYPE_STYLES = {
  wired: { stroke: '#64748b', dasharray: '0', width: 2.5 },
  wireless: { stroke: '#94a3b8', dasharray: '10 8', width: 2.5 },
  usb: { stroke: '#94a3b8', dasharray: '0', width: 3 },
  rf: { stroke: '#00ff41', dasharray: '12 8', width: 3 },
  i2c: { stroke: '#ff9500', dasharray: '0', width: 2.5 },
  gpio: { stroke: '#00d4ff', dasharray: '0', width: 2.5 },
  power: { stroke: '#00ff41', dasharray: '0', width: 2.5 },
}

export default function ConnectionLine({
  from,
  to,
  type = 'wired',
  active = false,
  color,
  points = [],
}) {
  const style = TYPE_STYLES[type] ?? TYPE_STYLES.wired

  return (
    <path
      d={buildPath(from, to, points)}
      fill="none"
      stroke={color ?? style.stroke}
      strokeWidth={style.width}
      strokeDasharray={style.dasharray}
      opacity={active ? 0.95 : 0.28}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        filter: active ? `drop-shadow(0 0 8px ${color ?? style.stroke})` : 'none',
      }}
    />
  )
}
