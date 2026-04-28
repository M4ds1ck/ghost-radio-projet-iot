import { useEffect, useMemo, useState } from 'react'
import FFTChart from '../components/Charts/FFTChart'
import WaveformChart from '../components/Charts/WaveformChart'
import useFFT from '../hooks/useFFT'

function buildWaveform(phase) {
  return Array.from({ length: 128 }, (_, index) => {
    const x = Number((index * 0.25).toFixed(2))
    const y = Math.sin(index * 0.42 + phase)
    return { x, y: Number(y.toFixed(3)) }
  })
}

export default function SignalNormalPage() {
  const [phase, setPhase] = useState(0)
  const fftData = useFFT({ mode: 'normal', jammerPower: 0, profile: 'audio' })
  const waveformData = useMemo(() => buildWaveform(phase), [phase])

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((current) => current + 0.16)
    }, 120)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="space-y-4">
      <section className="panel dense-panel p-4">
        <div className="section-label">Signal normal</div>
        <div className="mt-2 text-sm text-slate-400">
          Reference baseline - Aucune activite malveillante. Signal sinusoidal propre a 1 kHz, echantillonne a 32 kHz.
        </div>
      </section>

      <section className="panel dense-panel p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Param label="samp_rate" value="32,000 Hz" />
          <Param label="Signal" value="1 kHz" />
          <Param label="Type" value="Sine" />
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel dense-panel p-4">
          <div className="section-label">Spectre frequentiel</div>
          <div className="mt-4 border border-white/10 bg-[#0c1118] px-2 py-3">
            <FFTChart
              data={fftData}
              xDomain={[0, 2000]}
              yDomain={[-120, 0]}
              xLabel="Frequence (Hz)"
              marker={1000}
              stroke="#00ff88"
              xUnit="Hz"
              height={320}
            />
          </div>
        </section>

        <section className="panel dense-panel p-4">
          <div className="section-label">Signal temporel</div>
          <div className="mt-4 border border-white/10 bg-[#0c1118] px-2 py-3">
            <WaveformChart
              data={waveformData}
              xLabel="Temps (ms)"
              yLabel="Amplitude"
              stroke="#00ff88"
              height={320}
            />
          </div>
        </section>
      </div>

      <section className="panel dense-panel p-4">
        <div className="section-label">Interpretation</div>
        <div className="mt-3 text-sm text-slate-300">
          Cette page sert de reference visuelle. La raie principale reste fine autour de 1 kHz et le domaine temporel conserve une sinusoide stable, sans bruit ajoute ni activite de replay.
        </div>
      </section>
    </section>
  )
}

function Param({ label, value }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm uppercase tracking-[0.14em] text-slate-200">{value}</div>
    </div>
  )
}
