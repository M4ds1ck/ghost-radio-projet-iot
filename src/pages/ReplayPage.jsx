import { useEffect, useMemo, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import FFTChart from '../components/Charts/FFTChart'
import WaveformChart from '../components/Charts/WaveformChart'
import CapturesTable from '../components/CapturesTable'
import { TARGET_FREQUENCY_MHZ, formatBytes } from '../constants/hardware'
import useFFT from '../hooks/useFFT'

function buildReplayWaveform(phase) {
  return Array.from({ length: 128 }, (_, index) => {
    const x = Number((index * 0.08).toFixed(2))
    const y =
      Math.sin(index * 0.38 + phase) * 0.78 +
      Math.sin(index * 0.12 + phase * 0.4) * 0.18 +
      (Math.random() * 0.08 - 0.04)

    return {
      x,
      y: Number(y.toFixed(3)),
    }
  })
}

function formatReplayTime(progress, duration) {
  const seconds = (progress / 100) * duration
  return `${seconds.toFixed(1)}s / ${duration.toFixed(1)}s`
}

export default function ReplayPage() {
  const { systemState, api } = useOutletContext()
  const [phase, setPhase] = useState(0)
  const [logs, setLogs] = useState([
    '> capture selected from SPIFFS',
    '> replay path armed on 446.0 MHz',
  ])
  const logRef = useRef(null)
  const replaySpectrum = useFFT({ mode: 'replay', jammerPower: systemState.jammerPower, profile: 'rf' })
  const waveformData = useMemo(() => buildReplayWaveform(phase), [phase])
  const selectedCapture = systemState.selectedCapture

  useEffect(() => {
    if (!systemState.replayPlaying) {
      return undefined
    }

    const timer = setInterval(() => {
      setPhase((current) => current + 0.28)
    }, 120)

    return () => clearInterval(timer)
  }, [systemState.replayPlaying])

  useEffect(() => {
    if (!systemState.replayPlaying) {
      return undefined
    }

    const timer = setInterval(() => {
      setLogs((current) => {
        const nextLine = `> ${new Date().toLocaleTimeString('fr-FR')} | replay frame pushed to RF path`
        return [...current, nextLine].slice(-10)
      })
    }, 1200)

    return () => clearInterval(timer)
  }, [systemState.replayPlaying])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])

  return (
    <section className="space-y-4">
      <section className="panel dense-panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="section-label">Replay attaque</div>
            <div className="mt-2 text-sm text-slate-400">
              Les captures chargees depuis <code className="mono-inline">GET /api/captures</code> sont relues par
              <code className="mono-inline ml-1">POST /api/replay/start</code> puis reemises sur 446.0 MHz.
            </div>
          </div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            {systemState.replayPlaying ? `Reemet sur ${TARGET_FREQUENCY_MHZ.toFixed(1)} MHz...` : 'Replay inactif'}
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="panel dense-panel p-4">
          <div className="section-label">Etape 1 - captures disponibles</div>
          <div className="mt-4">
            <CapturesTable
              captures={systemState.captures}
              selectedId={systemState.selectedCaptureId}
              actionLabel="Charger"
              onAction={(capture) => api.loadCapture(capture.id)}
            />
          </div>
        </section>

        <aside className="panel dense-panel p-4">
          <div className="section-label">Capture chargee</div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <KeyValue label="ID" value={String(selectedCapture.id)} />
            <KeyValue label="Date" value={selectedCapture.timestamp} />
            <KeyValue label="Frequence" value={`${selectedCapture.frequency.toFixed(4)} MHz`} />
            <KeyValue label="Duree" value={`${selectedCapture.duration}s`} />
            <KeyValue label="Taille" value={formatBytes(selectedCapture.size_bytes)} />
            <KeyValue label="RSSI peak" value={`${selectedCapture.rssi_peak} dBm`} />
            <KeyValue label="Fichier" value={selectedCapture.file_path} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => api.startReplay()}
              className="rounded-sm border border-[var(--accent-yellow)] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-[var(--accent-yellow)] transition hover:bg-[rgba(255,204,0,0.08)]"
            >
              Play
            </button>
            <button
              type="button"
              onClick={() => api.stopReplay()}
              className="rounded-sm border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-slate-200 transition hover:border-white/20"
            >
              Stop
            </button>
          </div>
          <div className="mt-4">
            <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">Progression</div>
            <div className="h-2 bg-white/5">
              <div
                className="h-full bg-[var(--accent-yellow)] transition-all duration-150"
                style={{ width: `${systemState.replayPosition}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">
              {formatReplayTime(systemState.replayPosition, selectedCapture.duration)}
            </div>
          </div>
        </aside>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="panel dense-panel p-4">
          <div className="section-label">Etape 2 - signal capture</div>
          <div className="mt-4 border border-white/10 bg-[#0c1118] px-2 py-3">
            <WaveformChart
              data={waveformData}
              xLabel="Temps (ms)"
              yLabel="Amplitude"
              stroke="#ffcc00"
              height={260}
              playhead={(systemState.replayPosition / 100) * 10}
            />
          </div>
          <div className="mt-4 border border-white/10 bg-[#0c1118] px-2 py-3">
            <FFTChart
              data={replaySpectrum}
              xDomain={[444, 448]}
              yDomain={[-120, 0]}
              xLabel="Frequence (MHz)"
              marker={TARGET_FREQUENCY_MHZ}
              stroke="#ffcc00"
              height={240}
            />
          </div>
        </section>

        <section className="panel dense-panel p-4">
          <div className="section-label">Journal replay</div>
          <div
            ref={logRef}
            className="mt-4 h-[538px] overflow-y-auto border border-white/10 bg-[#0c1118] p-3 text-sm text-slate-300"
          >
            {logs.map((line, index) => (
              <div key={`${index}-${line}`} className="border-b border-white/5 py-2 last:border-b-0">
                {line}
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

function KeyValue({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right text-slate-200">{value}</span>
    </div>
  )
}
