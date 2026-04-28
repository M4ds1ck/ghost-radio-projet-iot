import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import FFTChart from '../components/Charts/FFTChart'
import { TARGET_FREQUENCY_MHZ, estimateSnr } from '../constants/hardware'
import useFFT from '../hooks/useFFT'

function getPowerColor(power) {
  if (power <= 0) return 'var(--accent-green)'
  if (power < 1) return 'var(--accent-yellow)'
  return 'var(--accent-red)'
}

export default function JammingPage() {
  const { systemState, api } = useOutletContext()
  const [warningVisible, setWarningVisible] = useState(true)
  const cleanSpectrum = useFFT({ mode: 'normal', jammerPower: 0, profile: 'rf' })
  const jammedSpectrum = useFFT({
    mode: 'jamming',
    jammerPower: systemState.jammerPower,
    profile: 'rf',
  })

  const powerColor = getPowerColor(systemState.jammerPower)
  const snrValue = estimateSnr(systemState.jammerPower)
  const snrLabel = Number.isFinite(snrValue) ? `${snrValue.toFixed(1)} dB` : 'INF dB'
  const snrWidth = useMemo(() => {
    if (!Number.isFinite(snrValue)) return 100
    return Math.max(6, Math.min(100, ((snrValue + 10) / 20) * 100))
  }, [snrValue])

  return (
    <section className="space-y-4">
      {warningVisible && (
        <section className="panel dense-panel border-[rgba(255,51,85,0.35)] p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="section-label text-[var(--accent-red)]">Avertissement technique</div>
              <div className="mt-2 text-sm text-slate-300">
                Signal bruite sur {TARGET_FREQUENCY_MHZ.toFixed(1)} MHz - Communications interrompues. Interface reservee a une simulation de laboratoire.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setWarningVisible(false)}
              className="rounded-sm border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-300 transition hover:border-[var(--accent-red)]"
            >
              Masquer
            </button>
          </div>
        </section>
      )}

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className={`panel dense-panel p-4 ${systemState.jammingRunning ? 'jammer-alert' : ''}`}>
          <div className="section-label">Controle jammer</div>
          <div className="mt-4 border border-white/10 bg-white/[0.02] p-4">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Jammer Power
            </div>
            <div className="mt-2 text-4xl uppercase tracking-[0.18em]" style={{ color: powerColor }}>
              {systemState.jammerPower.toFixed(1)} / 2.0
            </div>
            <div className="mt-2 text-sm text-slate-400">Amplitude de bruit gaussien injectee sur la porteuse.</div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.2"
              value={systemState.jammerPower}
              onChange={(event) => api.setJammerPower(Number(event.target.value))}
              className="control-slider mt-5"
              style={{ '--slider-color': powerColor }}
            />
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <KeyValue label="Frequence cible" value={`${TARGET_FREQUENCY_MHZ.toFixed(1)} MHz`} />
            <KeyValue label="CC1101 mode" value="RF noise injection" />
            <KeyValue label="API" value="POST /api/mode + POST /api/jammer" />
            <KeyValue label="RSSI mesure" value={`${systemState.rssi.toFixed(1)} dBm`} />
            <KeyValue label="Etat liaison" value={systemState.connected ? 'WiFi connected' : 'Offline'} />
          </div>

          <div className="mt-5 border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">SNR estime</div>
              <div className="text-sm uppercase tracking-[0.16em]" style={{ color: powerColor }}>
                {snrLabel}
              </div>
            </div>
            <div className="mt-3 h-2 bg-white/5">
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${snrWidth}%`,
                  background: `linear-gradient(90deg, var(--accent-green), ${powerColor})`,
                }}
              />
            </div>
            <div className="mt-2 text-xs text-slate-500">SNR = -10 * log10(power)</div>
          </div>

          <button
            type="button"
            onClick={() => api.setJammingActive(!systemState.jammingRunning)}
            className={`mt-5 w-full rounded-sm border px-4 py-3 text-[11px] uppercase tracking-[0.18em] transition ${
              systemState.jammingRunning
                ? 'border-[var(--accent-red)] bg-[rgba(255,51,85,0.12)] text-[var(--accent-red)]'
                : 'border-white/10 text-slate-200'
            }`}
          >
            {systemState.jammingRunning ? 'Stop jamming' : 'Start jamming'}
          </button>
        </section>

        <section className="space-y-4">
          <section className="panel dense-panel p-4">
            <div className="section-label">Input signal propre</div>
            <div className="mt-4 border border-white/10 bg-[#0c1118] px-2 py-3">
              <FFTChart
                data={cleanSpectrum}
                xDomain={[444, 448]}
                yDomain={[-120, 0]}
                xLabel="Frequence (MHz)"
                marker={TARGET_FREQUENCY_MHZ}
                stroke="#00ff88"
                height={220}
              />
            </div>
          </section>

          <section className="panel dense-panel p-4">
            <div className="section-label">Sortie brouillee</div>
            <div className="mt-4 border border-white/10 bg-[#0c1118] px-2 py-3">
              <FFTChart
                data={jammedSpectrum}
                xDomain={[444, 448]}
                yDomain={[-120, 0]}
                xLabel="Frequence (MHz)"
                marker={TARGET_FREQUENCY_MHZ}
                stroke="#ff3355"
                height={260}
              />
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
              {systemState.jammingRunning
                ? 'Jammer actif - le plancher de bruit remonte avec la puissance'
                : 'Jammer inactif - la sortie RF reste proche de la baseline'}
            </div>
          </section>
        </section>
      </div>
    </section>
  )
}

function KeyValue({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right uppercase tracking-[0.14em] text-slate-200">{value}</span>
    </div>
  )
}
