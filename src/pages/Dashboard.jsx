import { useOutletContext } from 'react-router-dom'
import FFTChart from '../components/Charts/FFTChart'
import CapturesTable from '../components/CapturesTable'
import StatusLED from '../components/StatusLED'
import {
  API_ENDPOINTS,
  SQLITE_ENGINE,
  SQLITE_SCHEMA,
  TARGET_FREQUENCY_MHZ,
  formatBytes,
  formatDbm,
  formatModeLabel,
  formatUptime,
} from '../constants/hardware'
import useFFT from '../hooks/useFFT'

export default function Dashboard() {
  const { systemState, api } = useOutletContext()
  const fftData = useFFT({
    mode: systemState.mode,
    jammerPower: systemState.jammerPower,
    profile: 'rf',
  })

  return (
    <section className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <section className="panel dense-panel p-4">
          <div className="section-label">Statut systeme</div>
          <div className="mt-4 space-y-2">
            <StatusLED
              label="Scanner"
              active={systemState.mode === 'scanner'}
              color="#3399ff"
              note={systemState.scannerRunning ? 'listening' : 'idle'}
            />
            <StatusLED
              label="Jamming"
              active={systemState.mode === 'jamming'}
              color="#ff3355"
              note={systemState.jammingRunning ? 'active' : 'standby'}
            />
            <StatusLED
              label="Replay"
              active={systemState.mode === 'replay'}
              color="#ffcc00"
              note={systemState.replayPlaying ? 'playing' : 'loaded'}
            />
            <StatusLED
              label="Signal Normal"
              active={systemState.mode === 'normal'}
              color="#00ff88"
              note="baseline"
            />
          </div>
        </section>

        <section className="panel dense-panel p-4">
          <div className="section-label">Telemetrie distante</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Metric label="IP ESP32" value="192.168.4.1" />
            <Metric label="Batterie" value={`${systemState.battery}%`} accent="var(--accent-green)">
              <div className="mt-2 h-2 bg-white/5">
                <div className="h-full bg-[var(--accent-green)]" style={{ width: `${systemState.battery}%` }} />
              </div>
            </Metric>
            <Metric label="Uptime" value={formatUptime(systemState.uptime)} />
            <Metric label="Frequence cible" value={`${systemState.frequency.toFixed(1)} MHz`} accent="var(--accent-yellow)" />
            <Metric
              label="RSSI actuel"
              value={formatDbm(systemState.rssi)}
              accent={systemState.rssi > -70 ? 'var(--accent-green)' : 'var(--accent-red)'}
            />
            <Metric label="Mode actif" value={formatModeLabel(systemState.mode)} accent="var(--accent-blue)" />
          </div>
        </section>
      </div>

      <section className="panel dense-panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="section-label">FFT temps reel</div>
            <div className="mt-2 text-sm text-slate-400">
              Le dashboard lit <code className="mono-inline">GET /api/signal</code> pour afficher la puissance RF autour de la cible PMR446.
            </div>
          </div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Fenetre 444.0 to 448.0 MHz
          </div>
        </div>
        <div className="mt-4 h-[360px] border border-white/10 bg-[#0c1118] px-2 py-3">
          <FFTChart
            data={fftData}
            xDomain={[444, 448]}
            yDomain={[-120, 0]}
            xLabel="Frequence (MHz)"
            marker={TARGET_FREQUENCY_MHZ}
            stroke={
              systemState.mode === 'jamming'
                ? '#ff3355'
                : systemState.mode === 'replay'
                  ? '#ffcc00'
                  : systemState.mode === 'scanner'
                    ? '#3399ff'
                    : '#00ff88'
            }
          />
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="panel dense-panel p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="section-label">Dernieres captures</div>
            <button
              type="button"
              onClick={() => api.startReplay()}
              className="rounded-sm border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] transition hover:border-[var(--accent-yellow)]"
            >
              Replay selectionne
            </button>
          </div>
          <div className="mt-4">
            <CapturesTable
              captures={systemState.captures}
              selectedId={systemState.selectedCaptureId}
              onAction={(capture) => {
                api.loadCapture(capture.id)
                api.startReplay()
              }}
            />
          </div>
        </section>

        <section className="panel dense-panel p-4">
          <div className="section-label">Base de donnees</div>
          <div className="mt-4 space-y-4">
            <div className="border border-white/10 bg-white/[0.02] p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-300">{SQLITE_ENGINE}</div>
              <div className="mt-2 text-sm text-slate-400">
                SQLite reste leger, embarquable et ne demande aucun serveur separe. Les metadonnees vivent en base, les fichiers IQ restent en
                <code className="mono-inline ml-1">SPIFFS</code>.
              </div>
            </div>

            <div className="grid gap-3">
              <SchemaBlock title="captures" value={SQLITE_SCHEMA.captures} />
              <SchemaBlock title="signal_logs" value={SQLITE_SCHEMA.signalLogs} />
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-300">Endpoints simules</div>
              <div className="mt-3 space-y-2 text-sm text-slate-400">
                {API_ENDPOINTS.map((endpoint) => (
                  <div key={endpoint} className="mono-inline block">
                    {endpoint}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-300">Capture chargee</div>
              <div className="mt-2 text-sm text-slate-400">
                {systemState.selectedCapture.file_path} | {formatBytes(systemState.selectedCapture.size_bytes)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

function Metric({ label, value, accent, children }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] px-3 py-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm uppercase tracking-[0.14em]" style={{ color: accent ?? '#e2e8f0' }}>
        {value}
      </div>
      {children}
    </div>
  )
}

function SchemaBlock({ title, value }) {
  return (
    <div className="border border-white/10 bg-[#0b1117] p-3">
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-300">{title}</div>
      <pre className="mono-block mt-3 whitespace-pre-wrap text-[11px] leading-5 text-slate-400">
        {value}
      </pre>
    </div>
  )
}
