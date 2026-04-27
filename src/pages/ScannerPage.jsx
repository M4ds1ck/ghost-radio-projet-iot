import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'
import FFTChart from '../components/FFTChart/FFTChart'
import FlowGraph from '../components/FlowGraph/FlowGraph'
import {
  GNURADIO,
  formatBytes,
  getCaptureDurationSeconds,
} from '../constants/gnuradio'
import useCountUp from '../hooks/useCountUp'

const BASE_SIGNALS = [
  {
    id: 1,
    frequency: '433.920 MHz',
    power: '-62 dBm',
    modulation: 'NBFM',
    status: `CAPTURED \u2713`,
  },
  {
    id: 2,
    frequency: '868.350 MHz',
    power: '-78 dBm',
    modulation: 'OOK',
    status: 'WEAK',
  },
  {
    id: 3,
    frequency: '2.450 GHz',
    power: '-45 dBm',
    modulation: 'DSSS',
    status: `ACTIVE \u26a1`,
  },
]

export default function ScannerPage() {
  const { scannerActive, setScannerActive } = useOutletContext()
  const [selectedSignal, setSelectedSignal] = useState(1)
  const [visibleRows, setVisibleRows] = useState(BASE_SIGNALS.length)
  const [capturedIds, setCapturedIds] = useState(new Set([1]))
  const fileSize = useCountUp(GNURADIO.sniffer.output_size_bytes)
  const duration = useCountUp(getCaptureDurationSeconds(), 1200, 1)

  useEffect(() => {
    if (!scannerActive) {
      return undefined
    }

    let shown = 0
    const timer = setInterval(() => {
      shown += 1
      setVisibleRows(Math.min(shown, BASE_SIGNALS.length))
      if (shown >= BASE_SIGNALS.length) {
        clearInterval(timer)
      }
    }, 180)

    return () => clearInterval(timer)
  }, [scannerActive])

  const rows = useMemo(() => BASE_SIGNALS.slice(0, visibleRows), [visibleRows])

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-sm border border-[rgba(0,212,255,0.35)] bg-[rgba(0,212,255,0.08)] px-3 py-2 text-[color:var(--accent-blue)] shadow-[0_0_18px_rgba(0,212,255,0.16)]">
          SNIFF
        </div>
        <div>
          <div className="text-2xl uppercase tracking-[0.18em] text-[color:var(--accent-blue)]">
            RF Signal Sniffer
          </div>
          <div className="mt-1 text-sm text-slate-400">
            Sniffer.py capture path mirrored from GNU Radio 3.10.12.0
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="panel p-5 text-sm text-slate-300">
          <div className="section-heading">Capture Parameters</div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Input source</span>
              <span>final-version.wav (repeat: Yes)</span>
            </div>
            <div className="flex justify-between">
              <span>NBFM TX</span>
              <span>audio=48k | quad=480k</span>
            </div>
            <div className="flex justify-between">
              <span>tau</span>
              <span>75\u00b5s</span>
            </div>
            <div className="flex justify-between">
              <span>max_dev</span>
              <span>5k</span>
            </div>
            <div className="flex justify-between">
              <span>fh</span>
              <span>-1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Throttle</span>
              <span>480,000 sps | limit=None</span>
            </div>
            <div className="flex justify-between">
              <span>Output</span>
              <span>captured_target.raw</span>
            </div>
            <div className="flex justify-between">
              <span>Append</span>
              <span>OFF</span>
            </div>
            <div className="flex justify-between">
              <span>Unbuffered</span>
              <span>OFF</span>
            </div>
            <div className="flex justify-between">
              <span>File size</span>
              <span>{formatBytes(Math.round(fileSize))}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span>{duration.toFixed(1)} seconds</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (scannerActive) {
                setScannerActive(false)
                return
              }

              setVisibleRows(0)
              setScannerActive(true)
            }}
            className={`mt-6 w-full rounded-sm border px-4 py-3 text-sm uppercase tracking-[0.18em] transition ${
              scannerActive
                ? 'animate-pulse border-[rgba(0,212,255,0.45)] bg-[rgba(0,212,255,0.12)] text-[color:var(--accent-blue)] shadow-[0_0_18px_rgba(0,212,255,0.18)]'
                : 'border-[color:var(--border)] bg-[color:var(--bg-secondary)] text-slate-200'
            }`}
          >
            {scannerActive ? 'STOP' : 'START SNIFFING'}
          </button>
        </section>

        <section className="panel p-5">
          <div className="section-heading">Detected Signals</div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="pb-2">#</th>
                  <th className="pb-2">Frequency</th>
                  <th className="pb-2">Power (dBm)</th>
                  <th className="pb-2">Modulation</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rows.map((signal, index) => (
                    <motion.tr
                      key={signal.id}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -18 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => setSelectedSignal(signal.id)}
                      className="group cursor-pointer text-slate-300"
                    >
                      {[signal.id, signal.frequency, signal.power, signal.modulation].map(
                        (value, cellIndex) => (
                          <td
                            key={`${signal.id}-${cellIndex}`}
                            className={`border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/78 px-4 py-3 ${
                              cellIndex === 0 ? 'rounded-l-sm' : ''
                            }`}
                            style={{
                              boxShadow:
                                selectedSignal === signal.id
                                  ? '0 0 18px rgba(0,212,255,0.12)'
                                  : 'none',
                            }}
                          >
                            {value}
                          </td>
                        ),
                      )}
                      <td
                        className="rounded-r-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/78 px-4 py-3"
                        style={{
                          boxShadow:
                            selectedSignal === signal.id
                              ? '0 0 18px rgba(0,212,255,0.12)'
                              : 'none',
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>{capturedIds.has(signal.id) ? 'CAPTURED ✓' : signal.status}</span>
                          <span className="opacity-0 transition group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setCapturedIds((prev) => {
                                  const next = new Set(prev)
                                  if (next.has(signal.id)) {
                                    next.delete(signal.id)
                                  } else {
                                    next.add(signal.id)
                                  }
                                  return next
                                })
                              }}
                              className="rounded-sm border border-[rgba(0,212,255,0.4)] bg-[rgba(0,212,255,0.08)] px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-[color:var(--accent-blue)] transition hover:bg-[rgba(0,212,255,0.18)]"
                            >
                              {capturedIds.has(signal.id) ? 'CAPTURED ✓' : 'Capture'}
                            </button>
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel p-5">
          <div className="section-heading">Flowgraph Topology</div>
          <div className="mt-4">
            <FlowGraph module="sniffer" />
          </div>
        </section>

        <section className="panel p-5">
          <div className="section-heading">Captured NBFM Spectrum</div>
          <div className="mt-4 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/75 p-4">
            <FFTChart mode="sniffing" height={320} />
          </div>
        </section>
      </div>
    </section>
  )
}
