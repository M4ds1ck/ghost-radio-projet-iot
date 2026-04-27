import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import FFTChart from '../components/FFTChart/FFTChart'
import FlowGraph from '../components/FlowGraph/FlowGraph'
import { GNURADIO } from '../constants/gnuradio'
import useCountUp from '../hooks/useCountUp'

function getPowerColor(power) {
  if (power === 0) {
    return 'var(--accent-green)'
  }

  if (power <= 0.8) {
    return 'var(--accent-orange)'
  }

  return 'var(--accent-red)'
}

export default function JammingPage() {
  const { jammerPower, setJammerPower, jammerActive, setJammerActive } = useOutletContext()
  const [warningVisible, setWarningVisible] = useState(true)
  const powerColor = getPowerColor(jammerPower)
  const snrTarget = 20 * Math.log10(1 / (jammerPower + 0.001))
  const animatedSnr = useCountUp(snrTarget, 500, 1)
  const snrRatio = useMemo(() => {
    const normalized = Math.max(0, Math.min(1, (snrTarget + 10) / 70))
    return normalized * 100
  }, [snrTarget])

  return (
    <section
      className={`space-y-6 rounded-sm border border-transparent p-0.5 ${
        jammerActive ? 'jammer-alert border-[rgba(255,45,85,0.4)]' : ''
      }`}
    >
      {warningVisible && (
        <div className="rounded-sm border border-[rgba(255,45,85,0.35)] bg-[rgba(255,45,85,0.12)] px-4 py-3 text-sm text-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-[color:var(--accent-red)]">
                Warning
              </div>
              <div className="mt-2">
                EDUCATIONAL USE ONLY - Radio jamming is illegal in most jurisdictions.
                This interface represents a controlled lab simulation.
              </div>
            </div>
            <button
              type="button"
              className="text-slate-300 transition hover:text-white"
              onClick={() => setWarningVisible(false)}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="rounded-sm border border-[rgba(255,45,85,0.35)] bg-[rgba(255,45,85,0.08)] px-3 py-2 text-[color:var(--accent-red)] shadow-[0_0_18px_rgba(255,45,85,0.16)]">
          JAM
        </div>
        <div>
          <div className="text-2xl uppercase tracking-[0.18em] text-[color:var(--accent-red)]">
            RF Jammer Control
          </div>
          <div className="mt-1 text-sm text-slate-400">
            Jamming.py transmit + Gaussian injection + NBFM receive loop
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="panel p-5 text-sm text-slate-300">
          <div className="section-heading">Jammer Power</div>
          <div className="mt-4 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/75 p-4">
            <div className="section-heading">Gaussian Noise Amplitude</div>
            <div
              className="mt-4 text-5xl uppercase tracking-[0.18em]"
              style={{ color: powerColor }}
            >
              {jammerPower.toFixed(1)}
            </div>
            <input
              type="range"
              min={GNURADIO.jamming.jammer_power_min}
              max={GNURADIO.jamming.jammer_power_max}
              step={GNURADIO.jamming.jammer_power_step}
              value={jammerPower}
              onChange={(event) => setJammerPower(Number(event.target.value))}
              className="power-slider mt-5"
              style={{ '--thumb-color': powerColor, '--thumb-glow': jammerPower / 2 }}
            />
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex justify-between">
              <span>samp_rate</span>
              <span>480,000 Hz</span>
            </div>
            <div className="flex justify-between">
              <span>NBFM TX</span>
              <span>audio=48k | quad=480k</span>
            </div>
            <div className="flex justify-between">
              <span>TX tau / max_dev / fh</span>
              <span>75\u00b5s | 5k | -1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Noise</span>
              <span>Gaussian | Seed: 0</span>
            </div>
            <div className="flex justify-between">
              <span>NBFM RX</span>
              <span>audio=48k | quad=480k</span>
            </div>
            <div className="flex justify-between">
              <span>RX tau / max_dev</span>
              <span>75\u00b5s | 5k</span>
            </div>
            <div className="flex justify-between">
              <span>Output gain</span>
              <span>x0.2</span>
            </div>
            <div className="flex justify-between">
              <span>Audio Sink</span>
              <span>48,000 Hz</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setJammerActive((current) => !current)}
            className={`mt-6 w-full rounded-sm border px-4 py-3 text-sm uppercase tracking-[0.18em] transition ${
              jammerActive
                ? 'animate-pulse border-[rgba(255,45,85,0.55)] bg-[rgba(255,45,85,0.9)] text-white shadow-[0_0_24px_rgba(255,45,85,0.25)]'
                : 'border-[color:var(--border)] bg-[color:var(--bg-secondary)] text-slate-200'
            }`}
          >
            {jammerActive ? 'JAMMING ACTIVE' : 'ACTIVATE JAMMER'}
          </button>

          <div className="mt-6 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/75 p-4">
            <div className="flex items-center justify-between">
              <div className="section-heading">SNR</div>
              <div
                className="text-lg uppercase tracking-[0.18em]"
                style={{ color: powerColor }}
              >
                SNR: {animatedSnr.toFixed(1)} dB
              </div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--bg-secondary)]">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${snrRatio}%`,
                  background: `linear-gradient(90deg, var(--accent-green), ${powerColor})`,
                  boxShadow: `0 0 14px ${powerColor}`,
                }}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="panel p-5">
            <div className="section-heading">Input Signal (clean)</div>
            <div className="mt-4 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/75 p-4">
              <FFTChart mode="normal" height={210} />
            </div>
          </div>

          <div className="panel p-5">
            <div className="section-heading">Jammed Output</div>
            <div className="mt-4 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/75 p-4">
              <FFTChart mode="jamming" jammerPower={jammerPower} height={260} />
            </div>
          </div>
        </section>
      </div>

      <section className="panel p-5">
        <div className="section-heading">Flowgraph Topology</div>
        <div className="mt-4">
          <FlowGraph module="jamming" jammerPower={jammerPower} />
        </div>
      </section>
    </section>
  )
}
