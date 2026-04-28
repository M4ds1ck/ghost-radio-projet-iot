import { formatBytes } from '../constants/hardware'

export default function CapturesTable({
  captures,
  actionLabel = 'Replay',
  onAction,
  selectedId,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-separate border-spacing-y-1.5 text-left text-sm">
        <thead className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
          <tr>
            <th className="px-3 py-2">ID</th>
            <th className="px-3 py-2">Timestamp</th>
            <th className="px-3 py-2">Fréquence</th>
            <th className="px-3 py-2">Durée</th>
            <th className="px-3 py-2">Taille</th>
            <th className="px-3 py-2">RSSI peak</th>
            <th className="px-3 py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {captures.map((capture) => (
            <tr key={capture.id}>
              <td
                className={`rounded-l-sm border border-white/10 px-3 py-3 ${
                  selectedId === capture.id ? 'bg-[#142034]' : 'bg-white/[0.02]'
                }`}
              >
                {capture.id}
              </td>
              <td className={`border border-white/10 px-3 py-3 ${selectedId === capture.id ? 'bg-[#142034]' : 'bg-white/[0.02]'}`}>
                {capture.timestamp}
              </td>
              <td className={`border border-white/10 px-3 py-3 ${selectedId === capture.id ? 'bg-[#142034]' : 'bg-white/[0.02]'}`}>
                {capture.frequency.toFixed(4)} MHz
              </td>
              <td className={`border border-white/10 px-3 py-3 ${selectedId === capture.id ? 'bg-[#142034]' : 'bg-white/[0.02]'}`}>
                {capture.duration}s
              </td>
              <td className={`border border-white/10 px-3 py-3 ${selectedId === capture.id ? 'bg-[#142034]' : 'bg-white/[0.02]'}`}>
                {formatBytes(capture.size_bytes)}
              </td>
              <td className={`border border-white/10 px-3 py-3 ${selectedId === capture.id ? 'bg-[#142034]' : 'bg-white/[0.02]'}`}>
                {capture.rssi_peak} dBm
              </td>
              <td
                className={`rounded-r-sm border border-white/10 px-3 py-3 text-right ${
                  selectedId === capture.id ? 'bg-[#142034]' : 'bg-white/[0.02]'
                }`}
              >
                {onAction && (
                  <button
                    type="button"
                    onClick={() => onAction(capture)}
                    className="rounded-sm border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-200 transition hover:border-[var(--accent-blue)] hover:text-white"
                  >
                    {actionLabel}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
