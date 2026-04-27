import { useMemo, useState } from 'react'
import ConnectionLine from '../components/Topology/ConnectionLine'
import HardwareNode from '../components/Topology/HardwareNode'
import SignalWave from '../components/Topology/SignalWave'

function iconProps(className) {
  return {
    className,
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: '1.6',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }
}

function Esp32Icon(className = 'h-7 w-7') {
  return (
    <svg {...iconProps(className)}>
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <rect x="9" y="8" width="6" height="8" rx="1" />
      <path d="M8 2v2" />
      <path d="M12 2v2" />
      <path d="M16 2v2" />
      <path d="M8 20v2" />
      <path d="M12 20v2" />
      <path d="M16 20v2" />
      <path d="M4 8h2" />
      <path d="M4 12h2" />
      <path d="M4 16h2" />
      <path d="M18 8h2" />
      <path d="M18 12h2" />
      <path d="M18 16h2" />
    </svg>
  )
}

function OledIcon(className = 'h-7 w-7') {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 19h8" />
      <path d="M10 17v2" />
      <path d="M14 17v2" />
      <path d="M6 9h12" opacity="0.4" />
      <path d="M6 12h9" opacity="0.4" />
    </svg>
  )
}

function ButtonIcon(className = 'h-7 w-7') {
  return (
    <svg {...iconProps(className)}>
      <rect x="5" y="7" width="14" height="10" rx="2" />
      <path d="M9 7V4" />
      <path d="M15 7V4" />
      <path d="M9 17v3" />
      <path d="M15 17v3" />
    </svg>
  )
}

function BreadboardIcon(className = 'h-7 w-7') {
  return (
    <svg {...iconProps(className)}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M7 6h10" />
      <path d="M7 18h10" />
      <path d="M8 9h.01" />
      <path d="M12 9h.01" />
      <path d="M16 9h.01" />
      <path d="M8 13h.01" />
      <path d="M12 13h.01" />
      <path d="M16 13h.01" />
    </svg>
  )
}

function LedIcon(className = 'h-7 w-7') {
  return (
    <svg {...iconProps(className)}>
      <path d="M8 10a4 4 0 1 1 8 0c0 1.5-.8 2.5-1.7 3.6-.9 1.1-1.3 2-1.3 3.4h-2c0-1.4-.4-2.3-1.3-3.4C8.8 12.5 8 11.5 8 10Z" />
      <path d="M10 17v4" />
      <path d="M14 17v4" />
    </svg>
  )
}

function AntennaIcon(className = 'h-7 w-7') {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 4v12" />
      <path d="M9 19h6" />
      <path d="M7 16h10" />
      <path d="M6 8c1.5-1.3 3.3-2 6-2s4.5.7 6 2" />
      <path d="M4 5c2.1-2 4.7-3 8-3s5.9 1 8 3" opacity="0.7" />
      <path d="M4 11c2 1.5 4.7 2.3 8 2.3s6-.8 8-2.3" opacity="0.4" />
    </svg>
  )
}

function SdrIcon(className = 'h-7 w-7') {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="7" width="12" height="10" rx="2" />
      <path d="M15 12h3" />
      <path d="M18 10v4" />
      <path d="M8 4v3" />
      <path d="M10 4v3" />
      <path d="M12 4v3" />
      <path d="M7 10h4" />
      <path d="M7 13h5" opacity="0.45" />
    </svg>
  )
}

function HostIcon(className = 'h-7 w-7') {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M10 17v3" />
      <path d="M14 17v3" />
      <path d="M6 9h8" />
      <path d="M6 12h10" opacity="0.45" />
    </svg>
  )
}

function TargetRadioIcon(className = 'h-7 w-7') {
  return (
    <svg {...iconProps(className)}>
      <rect x="6" y="5" width="10" height="16" rx="2" />
      <path d="M11 5V2" />
      <path d="M9 9h4" />
      <circle cx="11" cy="15" r="2" />
      <path d="M16 8c1.4.7 2 1.7 2 3s-.6 2.3-2 3" />
      <path d="M18 6c2.2 1.3 3 3 3 5s-.8 3.7-3 5" opacity="0.65" />
    </svg>
  )
}

const NODE_POSITIONS = {
  buttonUp: { x: 28, y: 120, w: 132, h: 88 },
  buttonDown: { x: 28, y: 240, w: 132, h: 88 },
  buttonSelect: { x: 28, y: 360, w: 132, h: 88 },
  breadboard: { x: 188, y: 170, w: 196, h: 278 },
  ledGreen: { x: 198, y: 82, w: 176, h: 76 },
  ledRed: { x: 198, y: 478, w: 176, h: 76 },
  esp32: { x: 438, y: 192, w: 258, h: 220 },
  oled: { x: 764, y: 86, w: 278, h: 162 },
  antenna: { x: 792, y: 312, w: 200, h: 120 },
  rtlSdr: { x: 118, y: 610, w: 188, h: 92 },
  host: { x: 380, y: 560, w: 310, h: 152 },
  target: { x: 1088, y: 280, w: 160, h: 196 },
}

function nodeCenter(position) {
  return {
    x: position.x + position.w / 2,
    y: position.y + position.h / 2,
  }
}

const COMPONENTS = [
  {
    id: 'esp32',
    label: 'ESP32 DevKit v1',
    short: '240MHz dual-core | 4MB Flash | Wi-Fi + BT',
    specs: [
      '240MHz dual-core Xtensa',
      '520KB SRAM',
      '4MB Flash',
      'Wi-Fi 802.11 b/g/n',
      'Bluetooth 4.2',
    ],
    layer: 'Processing',
    connection: 'Center hub | GPIO / I2C / RF / USB serial',
    role: 'Main controller for the Ghost Radio device. Handles the local menu, GPIO inputs, LED outputs, and coordinates the RF workflow shown in the application layer.',
    color: 'var(--accent-green)',
    position: NODE_POSITIONS.esp32,
    icon: Esp32Icon,
  },
  {
    id: 'oled',
    label: 'OLED 128x64 SSD1306',
    short: '128x64px | I2C addr 0x3C | 3.3V',
    specs: ['128x64 pixels', 'SSD1306 controller', 'I2C address 0x3C', '3.3V logic'],
    layer: 'Application',
    connection: 'I2C: SDA=GPIO21 | SCL=GPIO22',
    role: 'Physical operator display. Mirrors the menu system visualized in the dashboard and ESP32 simulator.',
    color: 'var(--accent-green)',
    position: NODE_POSITIONS.oled,
    icon: OledIcon,
  },
  {
    id: 'buttonUp',
    label: 'Button UP',
    short: 'Tactile 6x6mm | 10kΩ pull-up',
    specs: ['6x6mm tactile push button', '10kΩ pull-up resistor', 'Momentary input'],
    layer: 'Perception',
    connection: 'GPIO 12',
    role: 'Physical navigation input for moving upward through the Ghost Radio menu.',
    color: 'var(--accent-blue)',
    position: NODE_POSITIONS.buttonUp,
    icon: ButtonIcon,
  },
  {
    id: 'buttonDown',
    label: 'Button DOWN',
    short: 'Tactile 6x6mm | 10kΩ pull-up',
    specs: ['6x6mm tactile push button', '10kΩ pull-up resistor', 'Momentary input'],
    layer: 'Perception',
    connection: 'GPIO 13',
    role: 'Physical navigation input for moving downward through the Ghost Radio menu.',
    color: 'var(--accent-blue)',
    position: NODE_POSITIONS.buttonDown,
    icon: ButtonIcon,
  },
  {
    id: 'buttonSelect',
    label: 'Button SELECT',
    short: 'Tactile 6x6mm | 10kΩ pull-up',
    specs: ['6x6mm tactile push button', '10kΩ pull-up resistor', 'Momentary input'],
    layer: 'Perception',
    connection: 'GPIO 14',
    role: 'Physical confirmation button used to enter Scanner, Jamming, Replay, or Signal Normal mode.',
    color: 'var(--accent-blue)',
    position: NODE_POSITIONS.buttonSelect,
    icon: ButtonIcon,
  },
  {
    id: 'breadboard',
    label: 'Breadboard 400pt',
    short: '2 power rails | 3.3V and GND distribution',
    specs: ['400-point breadboard', 'Dual power rails', '3.3V and GND distribution'],
    layer: 'Perception',
    connection: 'Physical wiring backbone',
    role: 'Distributes power and ties the buttons and LEDs into the ESP32 GPIO harness.',
    color: 'var(--accent-green)',
    position: NODE_POSITIONS.breadboard,
    icon: BreadboardIcon,
  },
  {
    id: 'ledGreen',
    label: 'LED Green',
    short: '5mm | Vf=2.0V | 220Ω series resistor',
    specs: ['5mm LED', 'Forward voltage 2.0V', '20mA', '220Ω resistor'],
    layer: 'Application',
    connection: 'GPIO 25',
    role: 'Status LED for active and ready states while the platform is operating normally.',
    color: 'var(--accent-green)',
    position: NODE_POSITIONS.ledGreen,
    icon: LedIcon,
  },
  {
    id: 'ledRed',
    label: 'LED Red',
    short: '5mm | Vf=1.8V | 220Ω series resistor',
    specs: ['5mm LED', 'Forward voltage 1.8V', '20mA', '220Ω resistor'],
    layer: 'Application',
    connection: 'GPIO 26',
    role: 'Alert LED used to indicate that the jamming path is armed or active.',
    color: 'var(--accent-red)',
    position: NODE_POSITIONS.ledRed,
    icon: LedIcon,
  },
  {
    id: 'antenna',
    label: 'RF Antenna',
    short: '433MHz / 2.4GHz | 50Ω impedance',
    specs: ['433MHz / 2.4GHz', '50Ω impedance', 'Transmit + receive path'],
    layer: 'Network',
    connection: 'ESP32 RF pin',
    role: 'Physical RF interface for jamming and replay transmission, and the conceptual air link shown by the application layer.',
    color: 'var(--accent-orange)',
    position: NODE_POSITIONS.antenna,
    icon: AntennaIcon,
  },
  {
    id: 'rtlSdr',
    label: 'RTL-SDR USB Dongle',
    short: 'RTL2832U + R820T2 | 24MHz–1.766GHz',
    specs: ['RTL2832U baseband', 'R820T2 tuner', '24MHz to 1.766GHz', '8-bit ADC'],
    layer: 'Network',
    connection: 'USB 2.0 -> Host',
    role: 'Captures RF energy during sniffing mode and feeds GNU Radio for analysis and IQ recording.',
    color: 'var(--accent-blue)',
    position: NODE_POSITIONS.rtlSdr,
    icon: SdrIcon,
  },
  {
    id: 'host',
    label: 'Host Machine / GNU Radio',
    short: 'GNU Radio 3.10.12 | Python 3.10',
    specs: ['GNU Radio 3.10.12', 'Python 3.10', 'Ubuntu/Windows host', 'IQ capture and playback'],
    layer: 'Processing',
    connection: 'USB -> RTL-SDR | USB serial -> ESP32',
    role: 'Runs signal_normal.py, Sniffer.py, Jamming.py, and Replay_Attack.py, then exposes that topology through the Ghost Radio dashboard.',
    color: 'var(--accent-yellow)',
    position: NODE_POSITIONS.host,
    icon: HostIcon,
  },
  {
    id: 'target',
    label: 'Walkie-Talkie Target',
    short: 'Generic 433MHz PMR446 | analog FM',
    specs: ['Generic RF endpoint', '433MHz / PMR446 style radio', 'Analog FM behavior'],
    layer: 'Network',
    connection: 'RF air medium',
    role: 'Represents the victim or observed radio endpoint that is sniffed, jammed, or replayed against.',
    color: 'var(--accent-orange)',
    position: NODE_POSITIONS.target,
    icon: TargetRadioIcon,
  },
]

const SHARED_ACTIVE_IDS = [
  'esp32',
  'oled',
  'breadboard',
  'buttonUp',
  'buttonDown',
  'buttonSelect',
]

const MODE_CONFIG = {
  normal: {
    label: 'NORMAL',
    color: 'var(--accent-green)',
    description:
      'Signal Normal mode shows the clean reference path. The host generates a stable baseline waveform, the OLED stays online, and the RF path is visualized as a low-amplitude clean carrier.',
    activeIds: [...SHARED_ACTIVE_IDS, 'host', 'ledGreen', 'antenna'],
  },
  sniffer: {
    label: 'SNIFFER',
    color: 'var(--accent-blue)',
    description:
      'Sniffer mode captures the target transmission through the RTL-SDR USB dongle. GNU Radio records IQ samples while the application layer tracks the reverse RF path back into the host.',
    activeIds: [...SHARED_ACTIVE_IDS, 'host', 'rtlSdr', 'target', 'ledGreen'],
  },
  jamming: {
    label: 'JAMMING',
    color: 'var(--accent-red)',
    description:
      'Jamming mode drives Gaussian noise toward the target. The ESP32 control path, antenna, and red alert LED are emphasized while the outgoing RF waveform accelerates and grows in amplitude.',
    activeIds: [...SHARED_ACTIVE_IDS, 'antenna', 'target', 'ledRed'],
  },
  replay: {
    label: 'REPLAY',
    color: 'var(--accent-orange)',
    description:
      'Replay mode transmits the captured IQ stream back toward the target. The host retains the recorded file while the antenna radiates the replayed signal at a faster cadence than the baseline.',
    activeIds: [...SHARED_ACTIVE_IDS, 'host', 'antenna', 'target', 'ledGreen'],
  },
}

const LEGEND_ITEMS = [
  { label: 'Wired', color: '#64748b', type: 'solid' },
  { label: 'I2C', color: '#ff9500', type: 'solid' },
  { label: 'GPIO', color: '#00d4ff', type: 'solid' },
  { label: 'RF', color: '#00ff41', type: 'dashed' },
  { label: 'USB', color: '#94a3b8', type: 'solid' },
]

export default function TopologyPage() {
  const [mode, setMode] = useState('normal')
  const [selectedId, setSelectedId] = useState('esp32')
  const [tooltipState, setTooltipState] = useState(null)

  const modeConfig = MODE_CONFIG[mode]
  const componentMap = useMemo(
    () => new Map(COMPONENTS.map((component) => [component.id, component])),
    [],
  )
  const activeIds = useMemo(() => new Set(modeConfig.activeIds), [modeConfig.activeIds])
  const selectedComponent = componentMap.get(selectedId) ?? COMPONENTS[0]

  const centers = useMemo(() => {
    const entries = Object.entries(NODE_POSITIONS).map(([key, position]) => [key, nodeCenter(position)])
    return Object.fromEntries(entries)
  }, [])

  const connectionActive = (ids) => ids.every((id) => activeIds.has(id))

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-2xl uppercase tracking-[0.18em] text-[color:var(--accent-green)]">
            Hardware Topology
          </div>
          <div className="mt-1 text-sm text-slate-400">
            Interactive map of the physical Ghost Radio system and the RF signal path it represents.
          </div>
        </div>

        <div className="flex flex-wrap rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/80 p-1">
          {Object.entries(MODE_CONFIG).map(([key, entry]) => (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className="rounded-sm px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition"
              style={{
                color: mode === key ? entry.color : 'rgb(148 163 184)',
                background: mode === key ? `${entry.color}12` : 'transparent',
                boxShadow: mode === key ? `0 0 16px ${entry.color}20` : 'none',
              }}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="panel overflow-hidden p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="section-heading">Physical System View</div>
              <div className="mt-2 text-sm text-slate-400">
                The application layer visualizes the missing hardware rig: wiring, control inputs, RF path, and the host GNU Radio environment.
              </div>
            </div>
            <div
              className="rounded-sm border px-3 py-2 text-[10px] uppercase tracking-[0.16em]"
              style={{
                color: modeConfig.color,
                borderColor: `${modeConfig.color}55`,
                boxShadow: `0 0 14px ${modeConfig.color}18`,
              }}
            >
              Active mode: {modeConfig.label}
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <div className="relative h-[780px] w-[1280px] rounded-sm border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(15,19,24,0.96),rgba(10,12,15,0.96))]">
              <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />

              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1280 780">
                <ConnectionLine
                  from={{ x: NODE_POSITIONS.oled.x, y: NODE_POSITIONS.oled.y + 110 }}
                  to={{ x: NODE_POSITIONS.esp32.x + NODE_POSITIONS.esp32.w, y: NODE_POSITIONS.esp32.y + 66 }}
                  points={[
                    { x: 720, y: 196 },
                    { x: 720, y: 152 },
                  ]}
                  type="i2c"
                  color="#ff9500"
                  active={connectionActive(['oled', 'esp32'])}
                />
                <ConnectionLine
                  from={centers.buttonUp}
                  to={{ x: NODE_POSITIONS.esp32.x, y: NODE_POSITIONS.esp32.y + 58 }}
                  points={[
                    { x: 176, y: centers.buttonUp.y },
                    { x: 176, y: 250 },
                  ]}
                  type="gpio"
                  color="#00d4ff"
                  active={connectionActive(['buttonUp', 'esp32'])}
                />
                <ConnectionLine
                  from={centers.buttonDown}
                  to={{ x: NODE_POSITIONS.esp32.x, y: NODE_POSITIONS.esp32.y + 110 }}
                  points={[
                    { x: 176, y: centers.buttonDown.y },
                    { x: 176, y: 302 },
                  ]}
                  type="gpio"
                  color="#00d4ff"
                  active={connectionActive(['buttonDown', 'esp32'])}
                />
                <ConnectionLine
                  from={centers.buttonSelect}
                  to={{ x: NODE_POSITIONS.esp32.x, y: NODE_POSITIONS.esp32.y + 162 }}
                  points={[
                    { x: 176, y: centers.buttonSelect.y },
                    { x: 176, y: 354 },
                  ]}
                  type="gpio"
                  color="#00d4ff"
                  active={connectionActive(['buttonSelect', 'esp32'])}
                />
                <ConnectionLine
                  from={{ x: NODE_POSITIONS.ledGreen.x + NODE_POSITIONS.ledGreen.w, y: centers.ledGreen.y }}
                  to={{ x: NODE_POSITIONS.esp32.x, y: NODE_POSITIONS.esp32.y + 34 }}
                  points={[
                    { x: 406, y: centers.ledGreen.y },
                    { x: 406, y: 224 },
                  ]}
                  type="gpio"
                  color="#00ff41"
                  active={connectionActive(['ledGreen', 'esp32'])}
                />
                <ConnectionLine
                  from={{ x: NODE_POSITIONS.ledRed.x + NODE_POSITIONS.ledRed.w, y: centers.ledRed.y }}
                  to={{ x: NODE_POSITIONS.esp32.x, y: NODE_POSITIONS.esp32.y + 186 }}
                  points={[
                    { x: 406, y: centers.ledRed.y },
                    { x: 406, y: 382 },
                  ]}
                  type="gpio"
                  color="#ff2d55"
                  active={connectionActive(['ledRed', 'esp32'])}
                />
                <ConnectionLine
                  from={{ x: NODE_POSITIONS.breadboard.x + NODE_POSITIONS.breadboard.w, y: NODE_POSITIONS.breadboard.y + 74 }}
                  to={{ x: NODE_POSITIONS.esp32.x, y: NODE_POSITIONS.esp32.y + 90 }}
                  points={[
                    { x: 404, y: NODE_POSITIONS.breadboard.y + 74 },
                    { x: 404, y: 282 },
                  ]}
                  type="power"
                  color="#00ff41"
                  active={connectionActive(['breadboard', 'esp32'])}
                />
                <ConnectionLine
                  from={{ x: centers.host.x, y: NODE_POSITIONS.host.y }}
                  to={{ x: centers.esp32.x, y: NODE_POSITIONS.esp32.y + NODE_POSITIONS.esp32.h }}
                  points={[
                    { x: centers.host.x, y: 520 },
                    { x: centers.esp32.x, y: 520 },
                  ]}
                  type="usb"
                  color="#94a3b8"
                  active={connectionActive(['host', 'esp32'])}
                />
                <ConnectionLine
                  from={{ x: NODE_POSITIONS.rtlSdr.x + NODE_POSITIONS.rtlSdr.w, y: centers.rtlSdr.y }}
                  to={{ x: NODE_POSITIONS.host.x, y: centers.host.y }}
                  points={[
                    { x: 340, y: centers.rtlSdr.y },
                    { x: 340, y: centers.host.y },
                  ]}
                  type="usb"
                  color="#94a3b8"
                  active={connectionActive(['rtlSdr', 'host'])}
                />
                <ConnectionLine
                  from={{ x: centers.esp32.x, y: NODE_POSITIONS.esp32.y + NODE_POSITIONS.esp32.h }}
                  to={{ x: centers.antenna.x, y: NODE_POSITIONS.antenna.y }}
                  points={[
                    { x: centers.esp32.x, y: 456 },
                    { x: centers.antenna.x, y: 456 },
                  ]}
                  type="wired"
                  color="#64748b"
                  active={connectionActive(['esp32', 'antenna'])}
                />
              </svg>

              {COMPONENTS.map((component) => (
                <HardwareNode
                  key={component.id}
                  {...component}
                  active={activeIds.has(component.id)}
                  selected={selectedId === component.id}
                  onClick={() => setSelectedId(component.id)}
                  onMouseEnter={(event) => {
                    setTooltipState({
                      component,
                      x: event.clientX,
                      y: event.clientY,
                    })
                  }}
                  onMouseMove={(event) => {
                    setTooltipState((current) =>
                      current && current.component.id === component.id
                        ? { ...current, x: event.clientX, y: event.clientY }
                        : current,
                    )
                  }}
                  onMouseLeave={() => setTooltipState(null)}
                >
                  {component.id === 'oled' && (
                    <div className="rounded-sm border border-[rgba(0,255,65,0.24)] bg-[#050807] p-2 font-['Press_Start_2P'] text-[7px] uppercase tracking-[0.08em] text-[color:var(--accent-green)] shadow-[inset_0_0_10px_rgba(0,255,65,0.12)]">
                      <div>Ghost Radio</div>
                      <div className="mt-2">&gt; Scanner</div>
                      <div>Jamming</div>
                      <div>Replay</div>
                      <div>Sig Normal</div>
                    </div>
                  )}
                  {component.id === 'breadboard' && (
                    <div className="space-y-2 text-[9px] uppercase tracking-[0.14em] text-slate-400">
                      <div className="flex justify-between rounded-sm border border-[rgba(0,255,65,0.14)] bg-[rgba(0,255,65,0.05)] px-2 py-1">
                        <span>VCC</span>
                        <span className="text-[color:var(--accent-green)]">3.3V rail</span>
                      </div>
                      <div className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(0,255,65,0.18),rgba(0,255,65,0.58))]" />
                      <div className="flex justify-between rounded-sm border border-[rgba(148,163,184,0.14)] bg-[rgba(148,163,184,0.05)] px-2 py-1">
                        <span>GND</span>
                        <span>return rail</span>
                      </div>
                      <div className="h-2 rounded-full bg-[linear-gradient(90deg,rgba(148,163,184,0.2),rgba(148,163,184,0.52))]" />
                    </div>
                  )}
                  {component.id === 'host' && (
                    <div className="rounded-sm border border-[rgba(255,214,10,0.16)] bg-[rgba(255,214,10,0.05)] p-2 text-[9px] uppercase tracking-[0.12em] text-slate-300">
                      <div>signal_normal.py</div>
                      <div>Sniffer.py</div>
                      <div>Jamming.py</div>
                      <div>Replay_Attack.py</div>
                    </div>
                  )}
                </HardwareNode>
              ))}

              <SignalWave
                mode={mode}
                active={mode !== 'sniffer'}
                direction="right"
                from={{ x: NODE_POSITIONS.antenna.x + NODE_POSITIONS.antenna.w, y: centers.antenna.y }}
                to={{ x: NODE_POSITIONS.target.x, y: centers.target.y }}
              />
              <SignalWave
                mode={mode}
                active={mode === 'sniffer'}
                direction="left"
                from={{ x: NODE_POSITIONS.target.x, y: centers.target.y + 26 }}
                to={{ x: NODE_POSITIONS.rtlSdr.x + NODE_POSITIONS.rtlSdr.w, y: centers.rtlSdr.y - 40 }}
              />

              <div className="absolute bottom-4 left-4 rounded-sm border border-[color:var(--border)] bg-[rgba(10,12,15,0.86)] px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Legend</div>
                <div className="mt-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.14em] text-slate-300">
                  {LEGEND_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span
                        className="inline-block h-[2px] w-8"
                        style={{
                          backgroundImage:
                            item.type === 'dashed'
                              ? `repeating-linear-gradient(90deg, ${item.color} 0 8px, transparent 8px 14px)`
                              : `linear-gradient(90deg, ${item.color}, ${item.color})`,
                        }}
                      />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/80 p-4 text-sm text-slate-300">
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Physical mode explanation
            </div>
            <div className="mt-2">{modeConfig.description}</div>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="panel p-5">
            <div className="section-heading">Component Detail</div>
            <div className="mt-4 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/80 p-4">
              <div className="flex items-start gap-4">
                <div
                  className="rounded-sm border p-4"
                  style={{
                    color: selectedComponent.color,
                    borderColor: `${selectedComponent.color}55`,
                    boxShadow: `0 0 18px ${selectedComponent.color}18`,
                  }}
                >
                  {selectedComponent.icon('h-14 w-14')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm uppercase tracking-[0.16em] text-slate-100">
                    {selectedComponent.label}
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    {selectedComponent.layer}
                  </div>
                  <div className="mt-2 text-sm text-slate-300">{selectedComponent.role}</div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-300">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Specs</div>
                  <ul className="mt-2 space-y-1">
                    {selectedComponent.specs.map((spec) => (
                      <li key={spec}>{spec}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Connection</div>
                  <div className="mt-2">{selectedComponent.connection}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="panel p-5">
            <div className="section-heading">Active Components</div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              {COMPONENTS.filter((component) => activeIds.has(component.id)).map((component) => (
                <button
                  key={component.id}
                  type="button"
                  onClick={() => setSelectedId(component.id)}
                  className="flex w-full items-center justify-between rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/70 px-3 py-2 text-left transition hover:border-slate-500"
                >
                  <span>{component.label}</span>
                  <span style={{ color: modeConfig.color }}>ACTIVE</span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {tooltipState && (
        <div
          className="pointer-events-none fixed z-[9999] max-w-[260px] rounded-sm border border-[rgba(30,37,48,0.8)] bg-[rgba(10,12,15,0.96)] px-3 py-2 text-xs uppercase tracking-[0.12em] text-slate-200 shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
          style={{ left: tooltipState.x + 14, top: tooltipState.y + 14 }}
        >
          <div className="text-slate-100">{tooltipState.component.label}</div>
          <div className="mt-1">{tooltipState.component.short}</div>
          <div className="mt-1">Layer: {tooltipState.component.layer}</div>
          <div className="mt-1">Link: {tooltipState.component.connection}</div>
        </div>
      )}
    </section>
  )
}
