import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { GNURADIO } from '../../constants/gnuradio'
import useFFTSimulator from '../../hooks/useFFTSimulator'

function formatFrequency(value) {
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }

  return value.toFixed(0)
}

function FFTTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-sm border border-[color:var(--border)] bg-[rgba(10,12,15,0.96)] px-3 py-2 text-xs uppercase tracking-[0.15em] text-slate-200 shadow-[0_10px_28px_rgba(0,0,0,0.35)]">
      <div>FREQ: {label.toFixed(0)} Hz</div>
      <div className="mt-1">GAIN: {payload[0].value.toFixed(1)} dB</div>
    </div>
  )
}

export default function FFTChart({
  mode = 'normal',
  jammerPower = 0,
  height = 260,
}) {
  const { data, config } = useFFTSimulator({ mode, jammerPower })
  const showReference =
    mode === 'normal' ? GNURADIO.signalNormal.signal_freq : mode !== 'replay' ? 0 : null

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 12, right: 20, left: 8, bottom: 18 }}
        >
          <CartesianGrid stroke="rgba(74,85,104,0.18)" vertical={false} />
          <XAxis
            type="number"
            dataKey="frequency"
            domain={[config.xMin, config.xMax]}
            tickFormatter={formatFrequency}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(148,163,184,0.3)' }}
            tickLine={{ stroke: 'rgba(148,163,184,0.3)' }}
            label={{
              value: 'Frequency (Hz)',
              position: 'insideBottom',
              offset: -8,
              fill: '#94a3b8',
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            domain={[config.yMin, config.yMax]}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(148,163,184,0.3)' }}
            tickLine={{ stroke: 'rgba(148,163,184,0.3)' }}
            label={{
              value: 'Relative Gain (dB)',
              angle: -90,
              position: 'insideLeft',
              fill: '#94a3b8',
              fontSize: 11,
            }}
          />
          <Tooltip content={<FFTTooltip />} />
          {showReference !== null && (
            <ReferenceLine
              x={showReference}
              stroke="rgba(255,255,255,0.22)"
              strokeDasharray="4 6"
            />
          )}
          <Line
            type="monotone"
            dataKey="magnitude"
            stroke={config.color}
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
            activeDot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
