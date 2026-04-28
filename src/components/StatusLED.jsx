export default function StatusLED({ label, active = false, color = '#00ff88', note }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-300">{label}</div>
        {note && <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">{note}</div>}
      </div>
      <span
        className={`status-led ${active ? 'is-active' : ''}`}
        style={{ '--led-color': color }}
      />
    </div>
  )
}
