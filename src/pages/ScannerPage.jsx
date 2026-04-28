import { useOutletContext } from 'react-router-dom'
import FFTChart from '../components/Charts/FFTChart'
import useFFT from '../hooks/useFFT'
import { TARGET_FREQUENCY_MHZ, formatDbm } from '../constants/hardware'

export default function ScannerPage() {
  const { systemState, api } = useOutletContext()
  const fftData = useFFT({
    mode: 'scanner',
    jammerPower: systemState.jammerPower,
    profile: 'rf',
  })

  return (
    <section className="space-y-4">
      <section className="panel dense-panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="section-label">Scanner RF</div>
            <div className="mt-2 text-sm text-slate-400">
              Ecoute passive sur <code className="mono-inline">{TARGET_FREQUENCY_MHZ.toFixed(1)} MHz</code> via
              <code className="mono-inline ml-1">POST /api/mode</code> puis lecture temps reel de
              <code className="mono-inline ml-1">GET /api/signal</code>.
            </div>
          </div>
          <button
            type="button"
            onClick={() => api.setScannerActive(!systemState.scannerRunning)}
            className={`rounded-sm border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition ${
              systemState.scannerRunning
                ? 'border-[var(--accent-blue)] text-[var(--accent-blue)]'
                : 'border-white/10 text-slate-300'
            }`}
          >
            {systemState.scannerRunning ? 'Stop scanner' : 'Start scanner'}
          </button>
        </div>

        <div className="mt-4 border border-white/10 bg-[#0c1118] px-2 py-3">
          <FFTChart
            data={fftData}
            xDomain={[444, 448]}
            yDomain={[-120, 0]}
            xLabel="Frequence (MHz)"
            marker={TARGET_FREQUENCY_MHZ}
            stroke="#3399ff"
            height={380}
          />
        </div>

        <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-500">
          {systemState.scannerRunning
            ? `Listening on ${TARGET_FREQUENCY_MHZ.toFixed(1)} MHz...`
            : 'Scanner idle - waiting for operator command'}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="panel dense-panel p-4">
          <div className="section-label">Frequences detectees</div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] border-separate border-spacing-y-1.5 text-left text-sm">
              <thead className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-3 py-2">Signal</th>
                  <th className="px-3 py-2">Frequence</th>
                  <th className="px-3 py-2">RSSI</th>
                  <th className="px-3 py-2">Etat</th>
                  <th className="px-3 py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {systemState.detectedSignals.map((entry) => (
                  <tr key={entry.id}>
                    <td className="rounded-l-sm border border-white/10 bg-white/[0.02] px-3 py-3">{entry.label}</td>
                    <td className="border border-white/10 bg-white/[0.02] px-3 py-3">{entry.frequency.toFixed(4)} MHz</td>
                    <td className="border border-white/10 bg-white/[0.02] px-3 py-3">{formatDbm(entry.rssi)}</td>
                    <td className="border border-white/10 bg-white/[0.02] px-3 py-3 text-[var(--accent-blue)]">{entry.status}</td>
                    <td className="rounded-r-sm border border-white/10 bg-white/[0.02] px-3 py-3 text-slate-400">{entry.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel dense-panel p-4">
          <div className="section-label">Log temps reel</div>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            {systemState.scannerLog.map((entry) => (
              <div key={entry.id} className="border border-white/10 bg-[#0c1118] px-3 py-2">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  {entry.timestamp} | {entry.rssi} dBm
                </div>
                <div className="mt-1">{entry.message}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
