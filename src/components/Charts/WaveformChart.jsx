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

export default function WaveformChart({
  data,
  height = 260,
  stroke = '#00ff88',
  xLabel = 'Temps (ms)',
  yLabel = 'Amplitude',
  playhead,
}) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 12, right: 14, left: 6, bottom: 18 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
          <XAxis
            type="number"
            dataKey="x"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            label={{
              value: xLabel,
              position: 'insideBottom',
              offset: -8,
              fill: '#64748b',
              fontSize: 11,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[-1.2, 1.2]}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              fill: '#64748b',
              fontSize: 11,
            }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#0f1318',
              color: '#e2e8f0',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
            labelFormatter={(label) => `${label.toFixed(1)} ms`}
            formatter={(value) => [Number(value).toFixed(3), 'Amplitude']}
          />
          {typeof playhead === 'number' && (
            <ReferenceLine x={playhead} stroke="rgba(255,204,0,0.65)" strokeDasharray="5 5" />
          )}
          <Line
            type="monotone"
            dataKey="y"
            stroke={stroke}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
