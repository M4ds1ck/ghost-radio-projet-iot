import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Antenna from '../components/Hardware/Antenna'
import Battery from '../components/Hardware/Battery'
import Buttons from '../components/Hardware/Buttons'
import CC1101 from '../components/Hardware/CC1101'
import ESP32 from '../components/Hardware/ESP32'
import OLED from '../components/Hardware/OLED'
import { HARDWARE, MODE_DETAILS } from '../constants/hardware'

function TP4056Svg({ active, color }) {
  return (
    <svg viewBox="0 0 160 90" className="h-full w-full">
      <rect x="12" y="14" width="136" height="60" rx="8" fill="#0d4b39" stroke="#2f7a62" />
      <rect x="20" y="34" width="22" height="14" rx="3" fill="#cbd5e1" />
      <rect x="42" y="37" width="12" height="8" rx="2" fill="#475569" />
      <rect x="70" y="28" width="28" height="20" rx="3" fill="#0b1117" stroke="#334155" />
      <circle cx="120" cy="38" r="6" fill={active ? color : '#334155'} />
      <circle cx="120" cy="52" r="6" fill="#334155" />
      <text x="80" y="66" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="JetBrains Mono, monospace">
        TP4056
      </text>
    </svg>
  )
}

function RegulatorSvg({ active, color }) {
  return (
    <svg viewBox="0 0 120 90" className="h-full w-full">
      <rect x="38" y="18" width="44" height="42" rx="5" fill="#11151c" stroke="#475569" />
      <rect x="50" y="28" width="20" height="12" rx="2" fill={active ? color : '#334155'} />
      <path d="M48 60v18M60 60v18M72 60v18" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
      <text x="60" y="84" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="JetBrains Mono, monospace">
        AMS1117
      </text>
    </svg>
  )
}

function CapacitorsSvg({ active, color }) {
  return (
    <svg viewBox="0 0 140 90" className="h-full w-full">
      <path d="M38 18v44M48 18v44" stroke={active ? color : '#cbd5e1'} strokeWidth="4" />
      <path d="M92 18v44M102 18v44" stroke={active ? color : '#cbd5e1'} strokeWidth="4" />
      <path d="M20 40h18M48 40h18M74 40h18M102 40h18" stroke="#94a3b8" strokeWidth="3" />
      <text x="42" y="78" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="JetBrains Mono, monospace">
        100uF
      </text>
      <text x="98" y="78" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="JetBrains Mono, monospace">
        100nF
      </text>
    </svg>
  )
}

function TargetSvg({ active, color }) {
  return (
    <svg viewBox="0 0 160 220" className="h-full w-full">
      <rect x="42" y="30" width="76" height="150" rx="16" fill="#161b22" stroke="#475569" />
      <path d="M80 30V10" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <rect x="58" y="50" width="44" height="24" rx="4" fill="#0c1118" stroke={active ? color : '#334155'} />
      <circle cx="80" cy="106" r="17" fill="#0b1117" stroke="#64748b" />
      <circle cx="80" cy="106" r="7" fill={active ? color : '#334155'} />
      <rect x="68" y="136" width="24" height="12" rx="3" fill="#334155" />
      <path d="M120 68c10 8 15 18 15 30s-5 22-15 30" stroke={active ? color : '#64748b'} strokeWidth="4" fill="none" />
      <text x="80" y="202" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="JetBrains Mono, monospace">
        PMR446
      </text>
    </svg>
  )
}

function WifiSvg({ active, color }) {
  return (
    <svg viewBox="0 0 180 110" className="h-full w-full">
      <path d="M55 76c0-17 16-30 35-30 8 0 14 2 20 6 6-4 12-6 20-6 19 0 35 13 35 30 0 15-12 26-28 26H83C67 102 55 91 55 76Z" fill="#141a22" stroke="#475569" />
      <path d="M90 74c10-10 28-10 38 0" stroke={active ? color : '#64748b'} strokeWidth="4" fill="none" />
      <path d="M98 84c6-5 16-5 22 0" stroke={active ? color : '#64748b'} strokeWidth="4" fill="none" />
      <circle cx="109" cy="92" r="4" fill={active ? color : '#64748b'} />
      <text x="110" y="36" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="JetBrains Mono, monospace">
        WiFi 192.168.4.1
      </text>
    </svg>
  )
}

function DashboardSvg({ active, color }) {
  return (
    <svg viewBox="0 0 180 120" className="h-full w-full">
      <rect x="18" y="18" width="144" height="84" rx="8" fill="#11151c" stroke="#475569" />
      <rect x="28" y="28" width="124" height="52" rx="4" fill="#0c1118" stroke="#334155" />
      <path d="M38 66h32l12-18 20 10 18-22 22 12" stroke={active ? color : '#64748b'} strokeWidth="3" fill="none" />
      <text x="90" y="94" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontFamily="JetBrains Mono, monospace">
        React Dashboard
      </text>
    </svg>
  )
}

function componentCenter(node) {
  return {
    x: node.x + node.w / 2,
    y: node.y + node.h / 2,
  }
}

function buildPath(from, to, bends = []) {
  const points = [from, ...bends, to]
  return points.reduce((acc, point, index) => {
    const prefix = index === 0 ? 'M' : 'L'
    return `${acc} ${prefix}${point.x} ${point.y}`
  }, '')
}

function Wire({ from, to, bends, color, label, active = false, dashed = false, width = 3 }) {
  const path = buildPath(from, to, bends)
  return (
    <>
      <path
        d={path}
        className={`hardware-wire ${active ? 'is-active' : ''}`}
        style={{
          '--wire-color': color,
          stroke: color,
          strokeWidth: width,
          strokeDasharray: dashed ? '12 10' : 'none',
        }}
      />
      {label && (
        <text
          x={(from.x + to.x) / 2}
          y={(from.y + to.y) / 2 - 8}
          fill={color}
          fontSize="10"
          fontFamily="JetBrains Mono, monospace"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </>
  )
}

function buildWavePath(from, to, amplitude) {
  const span = to.x - from.x
  const segments = 10
  let path = `M ${from.x} ${from.y}`
  for (let index = 1; index <= segments; index += 1) {
    const progress = index / segments
    const x = from.x + span * progress
    const y = from.y + Math.sin(progress * Math.PI * 4) * amplitude
    path += ` L ${x} ${y}`
  }
  return path
}

function SignalWave({ from, to, color, speed = '1s', active = false }) {
  const path = buildWavePath(from, to, 16)
  return (
    <path
      d={path}
      className={`hardware-wave ${active ? 'is-active' : ''}`}
      style={{
        '--wave-color': color,
        '--wave-speed': speed,
        stroke: color,
      }}
    />
  )
}

function TopologyNode({
  label,
  hint,
  active,
  selected,
  color,
  style,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`hardware-node absolute text-left ${active ? 'is-active' : ''} ${selected ? 'is-selected' : ''}`}
      style={{ ...style, '--node-color': color }}
    >
      <div className="border border-white/10 bg-[#0b1016] p-3">
        <div className="h-full">{children}</div>
        <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-200">{label}</div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">{hint}</div>
      </div>
    </button>
  )
}

const POSITIONS = {
  buttonUp: { x: 30, y: 80, w: 110, h: 130 },
  buttonDown: { x: 30, y: 230, w: 110, h: 130 },
  buttonSelect: { x: 30, y: 380, w: 110, h: 130 },
  battery: { x: 20, y: 640, w: 250, h: 120 },
  tp4056: { x: 310, y: 625, w: 180, h: 130 },
  regulator: { x: 530, y: 630, w: 150, h: 120 },
  capacitors: { x: 720, y: 630, w: 180, h: 120 },
  cc1101: { x: 210, y: 220, w: 230, h: 170 },
  esp32: { x: 520, y: 195, w: 280, h: 200 },
  oled: { x: 900, y: 70, w: 250, h: 180 },
  antenna: { x: 940, y: 255, w: 140, h: 230 },
  wifi: { x: 880, y: 500, w: 260, h: 150 },
  dashboard: { x: 1170, y: 520, w: 220, h: 170 },
  target: { x: 1180, y: 170, w: 180, h: 250 },
}

const MODE_ACTIVE = {
  normal: ['battery', 'tp4056', 'regulator', 'capacitors', 'esp32', 'oled', 'wifi', 'dashboard'],
  scanner: ['battery', 'regulator', 'cc1101', 'esp32', 'oled', 'antenna', 'wifi', 'dashboard', 'target'],
  jamming: ['battery', 'tp4056', 'regulator', 'capacitors', 'cc1101', 'esp32', 'antenna', 'target', 'oled'],
  replay: ['battery', 'regulator', 'cc1101', 'esp32', 'antenna', 'wifi', 'dashboard', 'target', 'oled'],
}

const MODE_EXPLANATION = {
  normal:
    'Mode de reference: le dashboard reste connecte a l ESP32, l OLED reste allume et le chemin RF n injecte aucune activite malveillante.',
  scanner:
    'Mode Scanner: la cible emet dans l air, l antenne capte, le CC1101 convertit, puis l ESP32 expose la telemetrie et les captures vers l application.',
  jamming:
    'Mode Jamming: l ESP32 commande le CC1101 pour rayonner du bruit sur 446.0 MHz. La chaine d alimentation et la voie RF deviennent prioritaires.',
  replay:
    'Mode Replay: l application charge une capture, l ESP32 la ressort vers le CC1101, puis l antenne la reemet vers le talkie-walkie cible.',
}

export default function TopologyPage() {
  const { systemState, api } = useOutletContext()
  const [selectedId, setSelectedId] = useState('esp32')
  const [tooltip, setTooltip] = useState(null)

  const mode = systemState.mode
  const modeColor = MODE_DETAILS[mode]?.color ?? '#00ff88'
  const activeIds = useMemo(() => new Set(MODE_ACTIVE[mode] ?? MODE_ACTIVE.normal), [mode])
  const components = useMemo(
    () => ({
      buttonUp: HARDWARE.buttonUp,
      buttonDown: HARDWARE.buttonDown,
      buttonSelect: HARDWARE.buttonSelect,
      battery: HARDWARE.battery,
      tp4056: HARDWARE.tp4056,
      regulator: HARDWARE.regulator,
      capacitors: HARDWARE.capacitors,
      cc1101: HARDWARE.cc1101,
      esp32: HARDWARE.esp32,
      oled: HARDWARE.oled,
      antenna: HARDWARE.antenna,
      wifi: HARDWARE.wifi,
      dashboard: HARDWARE.dashboard,
      target: HARDWARE.target,
    }),
    [],
  )
  const selected = components[selectedId] ?? HARDWARE.esp32
  const centers = useMemo(() => {
    return Object.fromEntries(
      Object.entries(POSITIONS).map(([key, position]) => [key, componentCenter(position)]),
    )
  }, [])

  function handleModeClick(nextMode) {
    if (nextMode === 'scanner') {
      api.setScannerActive(true)
      return
    }
    if (nextMode === 'jamming') {
      api.setJammingActive(true)
      return
    }
    if (nextMode === 'replay') {
      api.startReplay()
      return
    }
    api.setMode('normal')
  }

  function tooltipHandlers(component) {
    return {
      onMouseEnter: (event) => {
        setTooltip({ component, x: event.clientX, y: event.clientY })
      },
      onMouseMove: (event) => {
        setTooltip({ component, x: event.clientX, y: event.clientY })
      },
      onMouseLeave: () => setTooltip(null),
    }
  }

  const detailPreview = renderPreview(selected.id, activeIds.has(selected.id), modeColor, systemState.mode)

  return (
    <section className="space-y-4">
      <section className="panel dense-panel p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="section-label">Topologie hardware</div>
            <div className="mt-2 text-sm text-slate-400">
              Representation 2D du montage physique: ESP32, CC1101, antenne SMA, alimentation, OLED et chemin WiFi jusqu au dashboard.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(MODE_DETAILS).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleModeClick(key)}
                className="rounded-sm border px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition"
                style={{
                  borderColor: mode === key ? config.color : 'rgba(255,255,255,0.1)',
                  color: mode === key ? config.color : '#cbd5e1',
                  background: mode === key ? `${config.color}12` : 'transparent',
                }}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="panel dense-panel p-4">
          <div className="section-label">Simulation Wokwi</div>
          <div className="mt-4 overflow-x-auto">
            <div className="relative h-[800px] w-[1420px] border border-white/10 bg-[#090d12]">
              <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />

              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1420 800">
                <Wire
                  from={{ x: POSITIONS.cc1101.x + POSITIONS.cc1101.w, y: POSITIONS.cc1101.y + 54 }}
                  to={{ x: POSITIONS.esp32.x, y: POSITIONS.esp32.y + 60 }}
                  bends={[{ x: 470, y: 274 }]}
                  color="#ffcc00"
                  label="SPI"
                  active={activeIds.has('cc1101') && activeIds.has('esp32')}
                />
                <Wire
                  from={{ x: POSITIONS.cc1101.x + POSITIONS.cc1101.w, y: POSITIONS.cc1101.y + 88 }}
                  to={{ x: POSITIONS.esp32.x, y: POSITIONS.esp32.y + 108 }}
                  bends={[{ x: 470, y: 308 }]}
                  color="#ffcc00"
                  active={activeIds.has('cc1101') && activeIds.has('esp32')}
                />
                <Wire
                  from={{ x: POSITIONS.cc1101.x + POSITIONS.cc1101.w, y: POSITIONS.cc1101.y + 122 }}
                  to={{ x: POSITIONS.esp32.x, y: POSITIONS.esp32.y + 154 }}
                  bends={[{ x: 470, y: 342 }]}
                  color="#00ff88"
                  label="GDO"
                  active={activeIds.has('cc1101') && activeIds.has('esp32')}
                />
                <Wire
                  from={{ x: POSITIONS.oled.x, y: POSITIONS.oled.y + 120 }}
                  to={{ x: POSITIONS.esp32.x + POSITIONS.esp32.w, y: POSITIONS.esp32.y + 64 }}
                  bends={[{ x: 860, y: 190 }]}
                  color="#3399ff"
                  label="I2C"
                  active={activeIds.has('oled') && activeIds.has('esp32')}
                />
                <Wire
                  from={centers.buttonUp}
                  to={{ x: POSITIONS.esp32.x, y: POSITIONS.esp32.y + 46 }}
                  bends={[{ x: 160, y: centers.buttonUp.y }, { x: 160, y: 240 }]}
                  color="#00ff88"
                  label="GPIO12"
                  active
                />
                <Wire
                  from={centers.buttonDown}
                  to={{ x: POSITIONS.esp32.x, y: POSITIONS.esp32.y + 92 }}
                  bends={[{ x: 160, y: centers.buttonDown.y }, { x: 160, y: 286 }]}
                  color="#00ff88"
                  label="GPIO13"
                  active
                />
                <Wire
                  from={centers.buttonSelect}
                  to={{ x: POSITIONS.esp32.x, y: POSITIONS.esp32.y + 138 }}
                  bends={[{ x: 160, y: centers.buttonSelect.y }, { x: 160, y: 332 }]}
                  color="#00ff88"
                  label="GPIO14"
                  active
                />
                <Wire
                  from={{ x: POSITIONS.battery.x + POSITIONS.battery.w, y: centers.battery.y - 18 }}
                  to={{ x: POSITIONS.tp4056.x, y: centers.tp4056.y - 18 }}
                  color="#ff3355"
                  label="VCC"
                  active
                />
                <Wire
                  from={{ x: POSITIONS.tp4056.x + POSITIONS.tp4056.w, y: centers.tp4056.y - 12 }}
                  to={{ x: POSITIONS.regulator.x, y: centers.regulator.y - 12 }}
                  color="#ff3355"
                  active
                />
                <Wire
                  from={{ x: POSITIONS.regulator.x + POSITIONS.regulator.w, y: centers.regulator.y - 10 }}
                  to={{ x: POSITIONS.capacitors.x, y: centers.capacitors.y - 10 }}
                  color="#ff3355"
                  active
                />
                <Wire
                  from={{ x: POSITIONS.capacitors.x + POSITIONS.capacitors.w, y: centers.capacitors.y - 10 }}
                  to={{ x: POSITIONS.esp32.x + 70, y: POSITIONS.esp32.y + POSITIONS.esp32.h }}
                  bends={[{ x: 930, y: 660 }, { x: 930, y: 430 }, { x: 650, y: 430 }]}
                  color="#ff3355"
                  active
                />
                <Wire
                  from={{ x: POSITIONS.capacitors.x + POSITIONS.capacitors.w, y: centers.capacitors.y + 16 }}
                  to={{ x: POSITIONS.cc1101.x + 30, y: POSITIONS.cc1101.y + POSITIONS.cc1101.h }}
                  bends={[{ x: 920, y: 686 }, { x: 920, y: 470 }, { x: 260, y: 470 }]}
                  color="#111111"
                  label="GND"
                  active
                  width={4}
                />
                <Wire
                  from={{ x: POSITIONS.esp32.x + POSITIONS.esp32.w, y: POSITIONS.esp32.y + 170 }}
                  to={{ x: POSITIONS.wifi.x, y: POSITIONS.wifi.y + 40 }}
                  bends={[{ x: 840, y: 400 }, { x: 840, y: 540 }]}
                  color="#9f5fff"
                  label="WiFi"
                  active={activeIds.has('wifi') && activeIds.has('esp32')}
                  dashed
                />
                <Wire
                  from={{ x: POSITIONS.wifi.x + POSITIONS.wifi.w, y: POSITIONS.wifi.y + 50 }}
                  to={{ x: POSITIONS.dashboard.x, y: POSITIONS.dashboard.y + 56 }}
                  color="#9f5fff"
                  label="HTTP"
                  active={activeIds.has('wifi') && activeIds.has('dashboard')}
                  dashed
                />
                <Wire
                  from={{ x: POSITIONS.cc1101.x + POSITIONS.cc1101.w, y: centers.cc1101.y }}
                  to={{ x: POSITIONS.antenna.x, y: centers.antenna.y }}
                  bends={[{ x: 720, y: centers.cc1101.y }, { x: 720, y: centers.antenna.y }]}
                  color="#ff8a1a"
                  label="RF"
                  active={activeIds.has('cc1101') && activeIds.has('antenna')}
                />
                <SignalWave
                  from={{ x: POSITIONS.antenna.x + POSITIONS.antenna.w, y: centers.antenna.y }}
                  to={{ x: POSITIONS.target.x, y: centers.target.y - 20 }}
                  color={modeColor}
                  speed={mode === 'jamming' ? '0.4s' : mode === 'replay' ? '0.6s' : mode === 'scanner' ? '0.8s' : '1.5s'}
                  active={mode !== 'scanner'}
                />
                <SignalWave
                  from={{ x: POSITIONS.target.x, y: centers.target.y + 20 }}
                  to={{ x: POSITIONS.antenna.x + POSITIONS.antenna.w, y: centers.antenna.y + 26 }}
                  color="#3399ff"
                  speed="0.8s"
                  active={mode === 'scanner'}
                />
              </svg>

              <TopologyNode
                label="UP"
                hint="GPIO 12"
                active
                selected={selectedId === 'buttonUp'}
                color="#00ff88"
                style={POSITIONS.buttonUp}
                onClick={() => setSelectedId('buttonUp')}
                {...tooltipHandlers(components.buttonUp)}
              >
                <Buttons label="UP" active color="#00ff88" />
              </TopologyNode>

              <TopologyNode
                label="DOWN"
                hint="GPIO 13"
                active
                selected={selectedId === 'buttonDown'}
                color="#00ff88"
                style={POSITIONS.buttonDown}
                onClick={() => setSelectedId('buttonDown')}
                {...tooltipHandlers(components.buttonDown)}
              >
                <Buttons label="DOWN" active color="#00ff88" />
              </TopologyNode>

              <TopologyNode
                label="SELECT"
                hint="GPIO 14"
                active
                selected={selectedId === 'buttonSelect'}
                color="#00ff88"
                style={POSITIONS.buttonSelect}
                onClick={() => setSelectedId('buttonSelect')}
                {...tooltipHandlers(components.buttonSelect)}
              >
                <Buttons label="SELECT" active={activeIds.has('buttonSelect')} color={modeColor} />
              </TopologyNode>

              <TopologyNode
                label={components.cc1101.name}
                hint={components.cc1101.connection}
                active={activeIds.has('cc1101')}
                selected={selectedId === 'cc1101'}
                color={modeColor}
                style={POSITIONS.cc1101}
                onClick={() => setSelectedId('cc1101')}
                {...tooltipHandlers(components.cc1101)}
              >
                <CC1101 active={activeIds.has('cc1101')} color={modeColor} />
              </TopologyNode>

              <TopologyNode
                label={components.esp32.name}
                hint={components.esp32.connection}
                active={activeIds.has('esp32')}
                selected={selectedId === 'esp32'}
                color={modeColor}
                style={POSITIONS.esp32}
                onClick={() => setSelectedId('esp32')}
                {...tooltipHandlers(components.esp32)}
              >
                <ESP32 active={activeIds.has('esp32')} color={modeColor} />
              </TopologyNode>

              <TopologyNode
                label={components.oled.name}
                hint="I2C | SSD1306"
                active={activeIds.has('oled')}
                selected={selectedId === 'oled'}
                color={modeColor}
                style={POSITIONS.oled}
                onClick={() => setSelectedId('oled')}
                {...tooltipHandlers(components.oled)}
              >
                <OLED active={activeIds.has('oled')} mode={mode} frequency={systemState.frequency} color={modeColor} />
              </TopologyNode>

              <TopologyNode
                label={components.antenna.name}
                hint={components.antenna.connection}
                active={activeIds.has('antenna')}
                selected={selectedId === 'antenna'}
                color={modeColor}
                style={POSITIONS.antenna}
                onClick={() => setSelectedId('antenna')}
                {...tooltipHandlers(components.antenna)}
              >
                <Antenna active={activeIds.has('antenna')} color={modeColor} />
              </TopologyNode>

              <TopologyNode
                label={components.target.name}
                hint="RF cible"
                active={activeIds.has('target')}
                selected={selectedId === 'target'}
                color={modeColor}
                style={POSITIONS.target}
                onClick={() => setSelectedId('target')}
                {...tooltipHandlers(components.target)}
              >
                <TargetSvg active={activeIds.has('target')} color={modeColor} />
              </TopologyNode>

              <TopologyNode
                label={components.battery.name}
                hint="Alimentation principale"
                active={activeIds.has('battery')}
                selected={selectedId === 'battery'}
                color="#00ff88"
                style={POSITIONS.battery}
                onClick={() => setSelectedId('battery')}
                {...tooltipHandlers(components.battery)}
              >
                <Battery active={activeIds.has('battery')} color="#00ff88" />
              </TopologyNode>

              <div
                className="absolute"
                style={{ left: POSITIONS.tp4056.x, top: POSITIONS.tp4056.y, width: POSITIONS.tp4056.w, height: POSITIONS.tp4056.h }}
              >
                <button
                  type="button"
                  className={`hardware-node h-full w-full text-left ${activeIds.has('tp4056') ? 'is-active' : ''} ${selectedId === 'tp4056' ? 'is-selected' : ''}`}
                  style={{ '--node-color': '#00ff88' }}
                  onClick={() => setSelectedId('tp4056')}
                  {...tooltipHandlers(components.tp4056)}
                >
                  <div className="border border-white/10 bg-[#0b1016] p-3">
                    <TP4056Svg active={activeIds.has('tp4056')} color="#00ff88" />
                    <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-200">{components.tp4056.name}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">Charge USB</div>
                  </div>
                </button>
              </div>

              <div
                className="absolute"
                style={{ left: POSITIONS.regulator.x, top: POSITIONS.regulator.y, width: POSITIONS.regulator.w, height: POSITIONS.regulator.h }}
              >
                <button
                  type="button"
                  className={`hardware-node h-full w-full text-left ${activeIds.has('regulator') ? 'is-active' : ''} ${selectedId === 'regulator' ? 'is-selected' : ''}`}
                  style={{ '--node-color': '#00ff88' }}
                  onClick={() => setSelectedId('regulator')}
                  {...tooltipHandlers(components.regulator)}
                >
                  <div className="border border-white/10 bg-[#0b1016] p-3">
                    <RegulatorSvg active={activeIds.has('regulator')} color="#00ff88" />
                    <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-200">{components.regulator.name}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">3.3V rail</div>
                  </div>
                </button>
              </div>

              <div
                className="absolute"
                style={{ left: POSITIONS.capacitors.x, top: POSITIONS.capacitors.y, width: POSITIONS.capacitors.w, height: POSITIONS.capacitors.h }}
              >
                <button
                  type="button"
                  className={`hardware-node h-full w-full text-left ${activeIds.has('capacitors') ? 'is-active' : ''} ${selectedId === 'capacitors' ? 'is-selected' : ''}`}
                  style={{ '--node-color': '#00ff88' }}
                  onClick={() => setSelectedId('capacitors')}
                  {...tooltipHandlers(components.capacitors)}
                >
                  <div className="border border-white/10 bg-[#0b1016] p-3">
                    <CapacitorsSvg active={activeIds.has('capacitors')} color="#00ff88" />
                    <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-200">{components.capacitors.name}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">Filtrage alim</div>
                  </div>
                </button>
              </div>

              <div
                className="absolute"
                style={{ left: POSITIONS.wifi.x, top: POSITIONS.wifi.y, width: POSITIONS.wifi.w, height: POSITIONS.wifi.h }}
              >
                <button
                  type="button"
                  className={`hardware-node h-full w-full text-left ${activeIds.has('wifi') ? 'is-active' : ''} ${selectedId === 'wifi' ? 'is-selected' : ''}`}
                  style={{ '--node-color': '#9f5fff' }}
                  onClick={() => setSelectedId('wifi')}
                  {...tooltipHandlers(components.wifi)}
                >
                  <div className="border border-white/10 bg-[#0b1016] p-3">
                    <WifiSvg active={activeIds.has('wifi')} color="#9f5fff" />
                    <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-200">{components.wifi.name}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">REST transport</div>
                  </div>
                </button>
              </div>

              <div
                className="absolute"
                style={{ left: POSITIONS.dashboard.x, top: POSITIONS.dashboard.y, width: POSITIONS.dashboard.w, height: POSITIONS.dashboard.h }}
              >
                <button
                  type="button"
                  className={`hardware-node h-full w-full text-left ${activeIds.has('dashboard') ? 'is-active' : ''} ${selectedId === 'dashboard' ? 'is-selected' : ''}`}
                  style={{ '--node-color': '#3399ff' }}
                  onClick={() => setSelectedId('dashboard')}
                  {...tooltipHandlers(components.dashboard)}
                >
                  <div className="border border-white/10 bg-[#0b1016] p-3">
                    <DashboardSvg active={activeIds.has('dashboard')} color="#3399ff" />
                    <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-200">{components.dashboard.name}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-500">fetch() HTTP</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300">
            {MODE_EXPLANATION[mode]}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="panel dense-panel p-4">
            <div className="section-label">Detail composant</div>
            <div className="mt-4 border border-white/10 bg-white/[0.02] p-4">
              <div className="h-[180px] border border-white/10 bg-[#0c1118] p-3">{detailPreview}</div>
              <div className="mt-4 text-[11px] uppercase tracking-[0.18em] text-slate-500">{selected.layer}</div>
              <div className="mt-1 text-sm uppercase tracking-[0.16em] text-slate-100">{selected.name}</div>
              <div className="mt-3 text-sm text-slate-300">{selected.role}</div>
              <div className="mt-4 text-[10px] uppercase tracking-[0.16em] text-slate-500">Connexion</div>
              <div className="mt-2 text-sm text-slate-300">{selected.connection}</div>
              <div className="mt-4 text-[10px] uppercase tracking-[0.16em] text-slate-500">Specs</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                {selected.specs.map((spec) => (
                  <li key={spec} className="border border-white/10 bg-[#0c1118] px-3 py-2">
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="panel dense-panel p-4">
            <div className="section-label">Legende des liaisons</div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <LegendItem color="#ff3355" label="VCC 3.3V" />
              <LegendItem color="#111111" label="GND" />
              <LegendItem color="#ffcc00" label="SPI" />
              <LegendItem color="#3399ff" label="I2C" />
              <LegendItem color="#00ff88" label="GPIO" />
              <LegendItem color="#ff8a1a" label="RF" />
              <LegendItem color="#9f5fff" label="WiFi / HTTP" dashed />
            </div>
          </section>
        </aside>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 max-w-[280px] border border-white/10 bg-[#0c1118] px-3 py-2 text-xs text-slate-200 shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          <div className="text-[11px] uppercase tracking-[0.16em] text-slate-100">{tooltip.component.name}</div>
          <div className="mt-1 text-slate-400">{tooltip.component.summary}</div>
          <div className="mt-2 uppercase tracking-[0.12em] text-slate-500">Couche: {tooltip.component.layer}</div>
          <div className="mt-1 uppercase tracking-[0.12em] text-slate-500">Lien: {tooltip.component.connection}</div>
          <div className="mt-1 uppercase tracking-[0.12em]" style={{ color: activeIds.has(tooltip.component.id) ? modeColor : '#64748b' }}>
            {activeIds.has(tooltip.component.id) ? 'Actif dans ce mode' : 'Inactif dans ce mode'}
          </div>
        </div>
      )}
    </section>
  )
}

function renderPreview(id, active, color, mode) {
  switch (id) {
    case 'buttonUp':
      return <Buttons label="UP" active={active} color={color} />
    case 'buttonDown':
      return <Buttons label="DOWN" active={active} color={color} />
    case 'buttonSelect':
      return <Buttons label="SELECT" active={active} color={color} />
    case 'battery':
      return <Battery active={active} color="#00ff88" />
    case 'tp4056':
      return <TP4056Svg active={active} color="#00ff88" />
    case 'regulator':
      return <RegulatorSvg active={active} color="#00ff88" />
    case 'capacitors':
      return <CapacitorsSvg active={active} color="#00ff88" />
    case 'cc1101':
      return <CC1101 active={active} color={color} />
    case 'esp32':
      return <ESP32 active={active} color={color} />
    case 'oled':
      return <OLED active={active} mode={mode} frequency={446.0} color={color} />
    case 'antenna':
      return <Antenna active={active} color={color} />
    case 'wifi':
      return <WifiSvg active={active} color="#9f5fff" />
    case 'dashboard':
      return <DashboardSvg active={active} color="#3399ff" />
    case 'target':
      return <TargetSvg active={active} color={color} />
    default:
      return <ESP32 active={active} color={color} />
  }
}

function LegendItem({ color, label, dashed = false }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-block h-[2px] w-12"
        style={{
          backgroundImage: dashed
            ? `repeating-linear-gradient(90deg, ${color} 0 8px, transparent 8px 14px)`
            : `linear-gradient(90deg, ${color}, ${color})`,
        }}
      />
      <span>{label}</span>
    </div>
  )
}
