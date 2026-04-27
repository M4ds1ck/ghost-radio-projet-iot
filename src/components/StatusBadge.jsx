export default function StatusBadge({ label, status = 'ready' }) {
  const tone =
    status === 'active'
      ? 'status-active'
      : status === 'idle'
        ? 'status-idle'
        : 'status-ready'

  return (
    <div className="label-chip">
      <span className={`status-dot ${tone}`} />
      <span>{label}</span>
    </div>
  )
}
