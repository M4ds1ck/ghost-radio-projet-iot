export default function HardwareNode({
  id,
  label,
  specs,
  layer,
  position,
  active,
  color,
  icon,
  selected = false,
  subtitle,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
}) {
  return (
    <button
      type="button"
      data-node-id={id}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      className="absolute rounded-sm border bg-[rgba(20,24,32,0.94)] p-3 text-left transition duration-200"
      style={{
        left: position.x,
        top: position.y,
        width: position.w,
        height: position.h,
        opacity: active || selected ? 1 : 0.42,
        borderColor: selected ? color : 'var(--border)',
        boxShadow:
          active || selected
            ? `0 0 22px ${color}33, inset 0 1px 0 rgba(255,255,255,0.04)`
            : 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-100">{label}</div>
          {subtitle && (
            <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500">
              {subtitle}
            </div>
          )}
          <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">
            {layer}
          </div>
        </div>
        <div
          className="shrink-0 rounded-sm border p-2"
          style={{
            borderColor: `${color}55`,
            color,
            boxShadow: active || selected ? `0 0 14px ${color}22` : 'none',
          }}
        >
          {typeof icon === 'function' ? icon('h-7 w-7') : icon}
        </div>
      </div>

      <div className="mt-3 text-[10px] uppercase tracking-[0.12em] text-slate-400">
        {Array.isArray(specs) ? specs[0] : specs}
      </div>

      {children && <div className="mt-3">{children}</div>}
    </button>
  )
}
