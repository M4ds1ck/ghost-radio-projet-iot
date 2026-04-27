import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { GNURADIO, formatMicroseconds } from '../../constants/gnuradio'

const BLOCK_STYLE = {
  fill: '#c8d0e8',
  stroke: '#60729d',
  text: '#19202b',
  port: '#f59e0b',
}

function formatLines(lines) {
  return lines.map((line) => (typeof line === 'string' ? line : String(line)))
}

function createModules(jammerPower) {
  return {
    signal_normal: {
      width: 980,
      height: 250,
      blocks: [
        {
          id: 'sine',
          title: 'Sine Source',
          lines: ['freq:1kHz', 'amp:1', 'samp:32k'],
          tooltip: [
            'analog_sig_source_x_0',
            'Type: complex sine wave',
            'Frequency: 1,000 Hz',
            'Amplitude: 1.0',
            'Phase: 0',
            'Sample rate: 32,000 Hz',
          ],
          x: 40,
          y: 78,
          width: 180,
          height: 92,
          inputs: [],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'throttle',
          title: 'Throttle',
          lines: ['32k sps', 'limit:auto'],
          tooltip: ['blocks_throttle2_0', 'Sample rate: 32,000 sps', 'Limit: auto'],
          x: 320,
          y: 84,
          width: 170,
          height: 80,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'fft',
          title: 'FFT Freq Sink',
          lines: ['1024 bins', 'BH window', '-140/+10dB'],
          tooltip: [
            'qtgui_freq_sink_x_0',
            'FFT size: 1024',
            'Window: WIN_BLACKMAN_hARRIS',
            'Center freq: 0 Hz',
            'Bandwidth: 32,000 Hz',
            'Y-axis: -140 dB to +10 dB',
            'Update: 0.10 s',
            'Trace color: blue',
          ],
          x: 600,
          y: 70,
          width: 220,
          height: 108,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [],
        },
      ],
      connections: [
        { from: ['sine', 'out'], to: ['throttle', 'in'] },
        { from: ['throttle', 'out'], to: ['fft', 'in'] },
      ],
    },
    sniffer: {
      width: 1160,
      height: 260,
      blocks: [
        {
          id: 'wav',
          title: 'Wav File Source',
          lines: ['final-version.wav', 'repeat:Yes'],
          tooltip: [
            'blocks_wavfile_source_0',
            'Input: final-version.wav',
            'Repeat: True',
          ],
          x: 40,
          y: 78,
          width: 195,
          height: 92,
          inputs: [],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'nbfm_tx',
          title: 'NBFM Transmit',
          lines: ['Audio:48k', 'Quad:480k', 'Tau:75u', 'MaxDev:5k', 'fh:-1'],
          tooltip: [
            'analog_nbfm_tx_0',
            'audio_rate: 48,000 Hz',
            'quad_rate: 480,000 Hz',
            `tau: ${formatMicroseconds(GNURADIO.sniffer.nbfm_tau)}`,
            'max_dev: 5,000 Hz',
            'fh: -1.0',
          ],
          x: 300,
          y: 58,
          width: 220,
          height: 132,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'throttle',
          title: 'Throttle',
          lines: ['480k sps', 'limit:none'],
          tooltip: ['blocks_throttle2_0', 'Sample rate: 480,000 sps', 'Limit: none'],
          x: 590,
          y: 84,
          width: 180,
          height: 80,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'file_sink',
          title: 'File Sink',
          lines: ['captured_target.raw', 'Append:Off'],
          tooltip: [
            'blocks_file_sink_0',
            'Output: captured_target.raw',
            'Type: complex IQ',
            'Append: False',
            'Unbuffered: Off',
          ],
          x: 860,
          y: 78,
          width: 210,
          height: 92,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [],
        },
      ],
      connections: [
        { from: ['wav', 'out'], to: ['nbfm_tx', 'in'] },
        { from: ['nbfm_tx', 'out'], to: ['throttle', 'in'] },
        { from: ['throttle', 'out'], to: ['file_sink', 'in'] },
      ],
    },
    jamming: {
      width: 1360,
      height: 360,
      blocks: [
        {
          id: 'wav',
          title: 'Wav File Source',
          lines: ['final-version.wav', 'repeat:Yes'],
          tooltip: [
            'blocks_wavfile_source_0',
            'Input: final-version.wav',
            'Repeat: True',
          ],
          x: 40,
          y: 58,
          width: 200,
          height: 92,
          inputs: [],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'tx',
          title: 'NBFM Transmit',
          lines: ['Audio:48k', 'Quad:480k', 'Tau:75u', 'MaxDev:5k', 'fh:-1'],
          tooltip: [
            'analog_nbfm_tx_0',
            'audio_rate: 48,000 Hz',
            'quad_rate: 480,000 Hz',
            `tau: ${formatMicroseconds(GNURADIO.jamming.nbfm_tx_tau)}`,
            'max_dev: 5,000 Hz',
            'fh: -1.0',
          ],
          x: 300,
          y: 36,
          width: 230,
          height: 136,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'throttle',
          title: 'Throttle',
          lines: ['480k sps', 'limit:none'],
          tooltip: ['blocks_throttle2_0', 'Sample rate: 480,000 sps', 'Limit: none'],
          x: 585,
          y: 64,
          width: 180,
          height: 80,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'add',
          title: 'Add',
          lines: ['in0 signal', 'in1 noise'],
          tooltip: [
            'blocks_add_xx_0',
            'in0: throttled signal',
            'in1: Gaussian noise',
            'out: combined complex stream',
          ],
          x: 845,
          y: 76,
          width: 150,
          height: 96,
          inputs: [
            { id: 'in0', y: 0.32, label: 'in0' },
            { id: 'in1', y: 0.72, label: 'in1' },
          ],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'rx',
          title: 'NBFM Receive',
          lines: ['Audio:48k', 'Quad:480k', 'Tau:75u', 'MaxDev:5k'],
          tooltip: [
            'analog_nbfm_rx_0',
            'audio_rate: 48,000 Hz',
            'quad_rate: 480,000 Hz',
            `tau: ${formatMicroseconds(GNURADIO.jamming.nbfm_rx_tau)}`,
            'max_dev: 5,000 Hz',
          ],
          x: 1055,
          y: 48,
          width: 220,
          height: 120,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'mult',
          title: 'Multiply Const',
          lines: ['0.2'],
          tooltip: [
            'blocks_multiply_const_vxx_0',
            `Constant: ${GNURADIO.jamming.multiply_const}`,
          ],
          x: 1088,
          y: 232,
          width: 170,
          height: 78,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'audio',
          title: 'Audio Sink',
          lines: ['48kHz'],
          tooltip: ['audio_sink_0', 'Sample rate: 48,000 Hz'],
          x: 1298,
          y: 230,
          width: 140,
          height: 82,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [],
        },
        {
          id: 'noise',
          title: 'Noise Source',
          lines: ['Gaussian', `Amp:${jammerPower.toFixed(1)}`, 'Seed:0'],
          tooltip: [
            'analog_noise_source_x_0',
            'Type: complex Gaussian',
            `Amplitude: ${jammerPower.toFixed(1)}`,
            'Seed: 0',
          ],
          x: 610,
          y: 236,
          width: 190,
          height: 96,
          inputs: [],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
      ],
      connections: [
        { from: ['wav', 'out'], to: ['tx', 'in'] },
        { from: ['tx', 'out'], to: ['throttle', 'in'] },
        { from: ['throttle', 'out'], to: ['add', 'in0'] },
        { from: ['noise', 'out'], to: ['add', 'in1'] },
        { from: ['add', 'out'], to: ['rx', 'in'] },
        { from: ['rx', 'out'], to: ['mult', 'in'] },
        { from: ['mult', 'out'], to: ['audio', 'in'] },
      ],
    },
    replay: {
      width: 1180,
      height: 260,
      blocks: [
        {
          id: 'file',
          title: 'File Source',
          lines: ['captured_target.raw', 'repeat:Yes', 'Offset:0', 'Length:0'],
          tooltip: [
            'blocks_file_source_0',
            'Input: captured_target.raw',
            'Repeat: True',
            'Offset: 0',
            'Length: 0',
          ],
          x: 36,
          y: 58,
          width: 220,
          height: 126,
          inputs: [],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'throttle',
          title: 'Throttle',
          lines: ['480k sps', 'limit:none'],
          tooltip: ['blocks_throttle2_0', 'Sample rate: 480,000 sps', 'Limit: none'],
          x: 320,
          y: 86,
          width: 175,
          height: 80,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'rx',
          title: 'NBFM Receive',
          lines: ['Audio:48k', 'Quad:480k', 'Tau:75u', 'MaxDev:5k'],
          tooltip: [
            'analog_nbfm_rx_0',
            'audio_rate: 48,000 Hz',
            'quad_rate: 480,000 Hz',
            `tau: ${formatMicroseconds(GNURADIO.replay.nbfm_tau)}`,
            'max_dev: 5,000 Hz',
          ],
          x: 570,
          y: 58,
          width: 220,
          height: 136,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'mult',
          title: 'Multiply Const',
          lines: ['0.5'],
          tooltip: [
            'blocks_multiply_const_vxx_0',
            `Constant: ${GNURADIO.replay.multiply_const}`,
          ],
          x: 856,
          y: 90,
          width: 175,
          height: 80,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [{ id: 'out', y: 0.5, label: 'out' }],
        },
        {
          id: 'audio',
          title: 'Audio Sink',
          lines: ['48kHz'],
          tooltip: ['audio_sink_0', 'Sample rate: 48,000 Hz'],
          x: 1080,
          y: 88,
          width: 130,
          height: 84,
          inputs: [{ id: 'in', y: 0.5, label: 'in' }],
          outputs: [],
        },
      ],
      connections: [
        { from: ['file', 'out'], to: ['throttle', 'in'] },
        { from: ['throttle', 'out'], to: ['rx', 'in'] },
        { from: ['rx', 'out'], to: ['mult', 'in'] },
        { from: ['mult', 'out'], to: ['audio', 'in'] },
      ],
    },
  }
}

function getPortPosition(block, side, portId) {
  const ports = side === 'in' ? block.inputs : block.outputs
  const port = ports.find((entry) => entry.id === portId)
  const x = side === 'in' ? block.x : block.x + block.width
  const y = block.y + block.height * (port?.y ?? 0.5)
  return { x, y, label: port?.label ?? portId }
}

function renderConnection(blockMap, connection) {
  const fromBlock = blockMap.get(connection.from[0])
  const toBlock = blockMap.get(connection.to[0])
  const source = getPortPosition(fromBlock, 'out', connection.from[1])
  const target = getPortPosition(toBlock, 'in', connection.to[1])
  const delta = Math.max(48, (target.x - source.x) * 0.35)

  return `M ${source.x} ${source.y} C ${source.x + delta} ${source.y}, ${target.x - delta} ${target.y}, ${target.x} ${target.y}`
}

export default function FlowGraph({ module, jammerPower = 0, isActive = false }) {
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [hoveredBlockId, setHoveredBlockId] = useState(null)
  const [rawPosition, setRawPosition] = useState(null)

  const definition = useMemo(() => createModules(jammerPower)[module], [jammerPower, module])
  const blockMap = useMemo(
    () => new Map(definition.blocks.map((block) => [block.id, block])),
    [definition.blocks],
  )
  const hoveredBlock = definition.blocks.find((block) => block.id === hoveredBlockId) ?? null

  return (
    <div className="relative h-full w-full">
      <div className="mb-2 text-[10px] uppercase tracking-[0.15em] text-slate-500">
        GNU Radio flowgraph - click a block for details
      </div>
      <div className="overflow-x-auto rounded-sm border border-[color:var(--border)] bg-[linear-gradient(180deg,#f8fbff,#dbe7ff)] p-4 shadow-[inset_0_0_22px_rgba(96,114,157,0.22)]">
        <svg
          viewBox={`0 0 ${definition.width} ${definition.height}`}
          className="min-w-[780px]"
        >
          <defs>
            <pattern
              id={`grid-${module}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="rgba(96,114,157,0.14)"
                strokeWidth="1"
              />
            </pattern>
            <filter id={`glow-${module}`} x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#60a5fa" floodOpacity="0.55" />
            </filter>
            <filter id={`alert-glow-${module}`} x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ff2d55" floodOpacity="0.45" />
            </filter>
            <marker
              id={`fg-arrow-${module}`}
              viewBox="0 0 10 6"
              refX="9"
              refY="3"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0L10 3L0 6Z" fill="#475569" />
            </marker>
          </defs>

          <rect
            x="0"
            y="0"
            width={definition.width}
            height={definition.height}
            fill={`url(#grid-${module})`}
          />

          {definition.connections.map((connection) => (
            <path
              key={`${connection.from.join('-')}-${connection.to.join('-')}`}
              d={renderConnection(blockMap, connection)}
              fill="none"
              stroke="#475569"
              strokeWidth="3"
              markerEnd={`url(#fg-arrow-${module})`}
            />
          ))}

          {definition.blocks.map((block) => {
            const selected = selectedBlockId === block.id
            const activeAlert =
              isActive && module === 'jamming' && (block.id === 'noise' || block.id === 'add')
            const strokeColor = activeAlert
              ? '#ff2d55'
              : selected
                ? '#3b82f6'
                : BLOCK_STYLE.stroke
            const strokeWidth = activeAlert || selected ? 3 : 2
            const filter = activeAlert
              ? `url(#alert-glow-${module})`
              : selected
                ? `url(#glow-${module})`
                : undefined

            return (
              <g
                key={block.id}
                transform={`translate(${block.x}, ${block.y})`}
                onMouseEnter={() => setHoveredBlockId(block.id)}
                onMouseLeave={() => {
                  setHoveredBlockId(null)
                  setRawPosition(null)
                }}
                onMouseMove={(event) => {
                  setRawPosition({
                    x: event.clientX,
                    y: event.clientY,
                  })
                }}
                onClick={() => setSelectedBlockId((current) => (current === block.id ? null : block.id))}
                className="cursor-pointer"
              >
                <rect
                  width={block.width}
                  height={block.height}
                  rx="8"
                  fill={BLOCK_STYLE.fill}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  filter={filter}
                />
                <rect
                  x="0"
                  y="0"
                  width={block.width}
                  height="28"
                  rx="8"
                  fill="rgba(96,114,157,0.24)"
                />
                <text
                  x="12"
                  y="18"
                  fontSize="12"
                  fontWeight="700"
                  fill={BLOCK_STYLE.text}
                >
                  {block.title}
                </text>
                {formatLines(block.lines).map((line, index) => (
                  <text
                    key={`${block.id}-${line}`}
                    x="12"
                    y={46 + index * 14}
                    fontSize="10"
                    fill={BLOCK_STYLE.text}
                  >
                    {line}
                  </text>
                ))}

                {block.inputs.map((port) => (
                  <g key={`${block.id}-${port.id}`}>
                    <circle
                      cx="0"
                      cy={block.height * port.y}
                      r="6"
                      fill={BLOCK_STYLE.port}
                      stroke="#b45309"
                      strokeWidth="1.5"
                    />
                    <text
                      x="8"
                      y={block.height * port.y + 4}
                      fontSize="9"
                      fill={BLOCK_STYLE.text}
                    >
                      {port.label}
                    </text>
                  </g>
                ))}

                {block.outputs.map((port) => (
                  <g key={`${block.id}-${port.id}`}>
                    <circle
                      cx={block.width}
                      cy={block.height * port.y}
                      r="6"
                      fill={BLOCK_STYLE.port}
                      stroke="#b45309"
                      strokeWidth="1.5"
                    />
                    <text
                      x={block.width - 26}
                      y={block.height * port.y + 4}
                      fontSize="9"
                      fill={BLOCK_STYLE.text}
                    >
                      {port.label}
                    </text>
                  </g>
                ))}
              </g>
            )
          })}
        </svg>
      </div>
      {hoveredBlock &&
        rawPosition &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[9999] max-w-[260px] rounded-sm border border-[rgba(30,37,48,0.8)] bg-[rgba(10,12,15,0.96)] px-3 py-2 text-xs uppercase tracking-[0.12em] text-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
            style={{ left: rawPosition.x + 14, top: rawPosition.y + 14 }}
          >
            {hoveredBlock.tooltip.map((line) => (
              <div key={`${hoveredBlock.id}-${line}`} className="leading-5">
                {line}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}
