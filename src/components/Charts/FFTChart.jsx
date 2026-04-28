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

function tooltipLabel(label, xUnit) {
  return `${label.toFixed(3)} ${xUnit}`
}

export default function FFTChart({
  data,
  height = 320,
  stroke = '#3399ff',
  xDomain,
  yDomain,
  xLabel,
  yLabel = 'Puissance (dBm)',
  xUnit = 'MHz',
  marker,
}) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 12, right: 14, left: 6, bottom: 18 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
          <XAxis
            type="number"
            dataKey="x"
            domain={xDomain}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            tickLine={{ stroke: 'rgba(255,255,255,0.12)' }}
            tickFormatter={(value) => value.toFixed(xUnit === 'Hz' ? 0 : 1)}
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
            domain={yDomain}
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
            labelFormatter={(label) => tooltipLabel(label, xUnit)}
            formatter={(value) => [`${Number(value).toFixed(1)} dBm`, 'Signal']}
          />
          {typeof marker === 'number' && (
            <ReferenceLine x={marker} stroke="rgba(255,204,0,0.65)" strokeDasharray="5 5" />
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
