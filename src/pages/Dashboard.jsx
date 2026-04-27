import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  InterferenceIcon,
  LoopSignalIcon,
  RadarIcon,
  SignalNormalIcon,
} from '../components/Icons'
import FFTChart from '../components/FFTChart/FFTChart'
import useCountUp from '../hooks/useCountUp'
import {
  GNURADIO,
  formatBytes,
  getCaptureDurationSeconds,
} from '../constants/gnuradio'

const architectureLayers = [
  {
    key: 'perception',
    label: 'PERCEPTION',
    description:
      'Hardware sensing layer - ESP32-S3 on Wokwi, physical navigation buttons (UP / DOWN / SELECT / BACK), OLED display, and the RF antenna that captures existing radio waves in Replay mode.',
  },
  {
    key: 'reseau',
    label: 'RÉSEAU',
    description:
      'Network transport layer - GNU Radio 3.10.12: signal_normal.py (baseline), Sniffer.py (IQ capture -> captured_target.raw, 62 MB), Jamming.py (Gaussian noise injection), Replay_Attack.py (looped IQ playback). NBFM modulation at 480 kHz.',
  },
  {
    key: 'traitement',
    label: 'TRAITEMENT',
    description:
      'Processing layer - the ESP32-S3 microcontroller. Processes button input, generates the attack payload, stores the captured IQ signal in memory, and coordinates the four GNU Radio modules.',
  },
  {
    key: 'application',
    label: 'APPLICATION ★',
    description:
      'Application layer (this dashboard) - React + Vite operator interface. ESP32 screen simulator, GNU Radio flowgraph viewer, live FFT & IQ waveform charts, jamming power control with real-time SNR readout. Includes hardware topology visualizer - interactive map of all physical components and RF signal flow. All parameters mirror the actual .py scripts.',
  },
]

const dashboardCards = [
  {
    key: 'signal-normal',
    title: 'Signal Normal',
    eyebrow: 'Baseline Reference',
    accent: 'var(--accent-yellow)',
    icon: SignalNormalIcon,
    details: ['samp_rate: 32,000 Hz', 'Signal: 1 kHz sine', 'FFT: 1024 bins | Blackman-Harris'],
    action: 'VIEW SPECTRUM ->',
    path: '/signal-normal',
  },
  {
    key: 'scanner',
    title: 'Sniffer',
    eyebrow: '1 File Captured',
    accent: 'var(--accent-blue)',
    icon: RadarIcon,
    details: [
      'captured_target.raw',
      '62,481,664 bytes | 16.3 seconds',
      'samp_rate: 480,000 Hz',
    ],
    action: 'RUN SNIFFER ->',
    path: '/scanner',
  },
  {
    key: 'jamming',
    title: 'Jamming',
    eyebrow: 'Standby',
    accent: 'var(--accent-red)',
    icon: InterferenceIcon,
    details: [
      'Jammer Power: dynamic / 2.0',
      'Noise: Gaussian | Seed: 0',
      'samp_rate: 480,000 Hz',
    ],
    action: 'CONFIGURE ->',
    path: '/jamming',
  },
  {
    key: 'replay',
    title: 'Replay',
    eyebrow: 'Ready To Replay',
    accent: 'var(--accent-orange)',
    icon: LoopSignalIcon,
    details: ['captured_target.raw', 'Gain x0.5 | Loop: ON', 'samp_rate: 480,000 Hz'],
    action: 'REPLAY ->',
    path: '/replay',
  },
]

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const staggerCard = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { jammerPower } = useOutletContext()
  const [monitorMode, setMonitorMode] = useState('normal')
  const [hoveredLayer, setHoveredLayer] = useState('application')
  const [layerNote, setLayerNote] = useState('')
  const sampleRateCount = useCountUp(GNURADIO.signalNormal.samp_rate)
  const fileSizeCount = useCountUp(GNURADIO.sniffer.output_size_bytes)
  const durationCount = useCountUp(getCaptureDurationSeconds(), 1200, 1)
  const jammerPowerCount = useCountUp(jammerPower, 500, 1)
  const layerRoutes = {
    perception: null,
    reseau: null,
    traitement: null,
    application: '/',
  }

  return (
    <section className="space-y-6">
      <motion.div
        className="grid gap-4 md:grid-cols-2"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {dashboardCards.map((card) => {
          const Icon = card.icon
          const detailLines =
            card.key === 'signal-normal'
              ? [
                  `samp_rate: ${sampleRateCount.toLocaleString('en-US')} Hz`,
                  'Signal: 1 kHz sine',
                  'FFT: 1024 bins | Blackman-Harris',
                ]
              : card.key === 'scanner'
                ? [
                    'captured_target.raw',
                    `${formatBytes(Math.round(fileSizeCount))} | ${durationCount.toFixed(1)} seconds`,
                    'samp_rate: 480,000 Hz',
                  ]
                : card.key === 'jamming'
                  ? [
                      `Jammer Power: ${jammerPowerCount.toFixed(1)} / 2.0`,
                      'Noise: Gaussian | Seed: 0',
                      'samp_rate: 480,000 Hz',
                    ]
                  : card.details

          return (
            <motion.button
              key={card.key}
              type="button"
              variants={staggerCard}
              onClick={() => navigate(card.path)}
              className="panel flex min-h-[250px] flex-col items-start p-5 text-left transition hover:-translate-y-1"
            >
              <div
                className="mb-5 rounded-sm border px-3 py-2"
                style={{
                  color: card.accent,
                  borderColor: `${card.accent}40`,
                  boxShadow: `0 0 14px ${card.accent}18`,
                }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="section-heading">{card.title}</div>
              <div
                className="mt-4 text-2xl uppercase tracking-[0.18em] md:text-[1.75rem]"
                style={{ color: card.accent }}
              >
                {card.eyebrow}
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                {detailLines.map((line) => (
                  <div key={`${card.key}-${line}`}>{line}</div>
                ))}
              </div>
              <div className="mt-auto pt-6 text-xs uppercase tracking-[0.16em]" style={{ color: card.accent }}>
                {card.action}
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      <section className="panel p-5">
        <div className="section-heading">Architecture</div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {architectureLayers.map((layer, index) => (
            <div key={layer.key} className="flex items-center gap-3">
              <button
                type="button"
                onMouseEnter={() => setHoveredLayer(layer.key)}
                onClick={() => {
                  setHoveredLayer(layer.key)
                  const route = layerRoutes[layer.key]

                  if (route) {
                    setLayerNote('')
                    navigate(route)
                    return
                  }

                  if (layer.key === 'reseau') {
                    setLayerNote('Reseau layer - see Projet_IOT/ (GNU Radio scripts)')
                  } else if (layer.key === 'perception') {
                    setLayerNote('Perception layer - ESP32-S3 hardware on Wokwi')
                  } else if (layer.key === 'traitement') {
                    setLayerNote('Traitement layer - ESP32-S3 firmware logic')
                  }
                }}
                className="rounded-sm border px-4 py-3 text-xs uppercase tracking-[0.15em] transition"
                style={{
                  color:
                    layer.key === 'application' ? 'var(--accent-green)' : 'var(--text-primary)',
                  borderColor:
                    hoveredLayer === layer.key
                      ? layer.key === 'application'
                        ? 'rgba(0,255,65,0.45)'
                        : 'rgba(0,212,255,0.38)'
                      : 'var(--border)',
                  background:
                    hoveredLayer === layer.key
                      ? layer.key === 'application'
                        ? 'rgba(0,255,65,0.08)'
                        : 'rgba(0,212,255,0.08)'
                      : 'transparent',
                  boxShadow:
                    hoveredLayer === layer.key
                      ? layer.key === 'application'
                        ? '0 0 16px rgba(0,255,65,0.14)'
                        : '0 0 16px rgba(0,212,255,0.1)'
                      : 'none',
                }}
              >
                {layer.label}
              </button>
              {index < architectureLayers.length - 1 && <span className="text-slate-500">-&gt;</span>}
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/80 p-4 text-sm text-slate-300">
          {architectureLayers.find((layer) => layer.key === hoveredLayer)?.description}
        </div>
        {layerNote && (
          <div className="mt-3 text-[10px] uppercase tracking-[0.15em] text-[color:var(--accent-blue)]">
            ↳ {layerNote}
          </div>
        )}
      </section>

      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="section-heading">Live Signal Monitor</div>
            <div className="mt-2 text-sm text-slate-400">
              Reference FFT view across all four GNU Radio module roles.
            </div>
          </div>
          <div className="flex rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/80 p-1">
            {[
              ['normal', 'NORMAL'],
              ['jamming', 'JAMMING'],
              ['sniffing', 'SNIFFING'],
              ['replay', 'REPLAY'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMonitorMode(key)}
                className={`rounded-sm px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition ${
                  monitorMode === key
                    ? 'bg-[rgba(0,255,65,0.1)] text-[color:var(--accent-green)]'
                    : 'text-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/75 p-4">
          <FFTChart mode={monitorMode} jammerPower={jammerPower} height={280} />
        </div>
      </section>
    </section>
  )
}
