import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseIcon } from '../Icons'

const MENU_ITEMS = [
  { key: 'scanner', label: '1. SCANNER' },
  { key: 'jamming', label: '2. JAMMING' },
  { key: 'replay', label: '3. REPLAY' },
  { key: 'signal_normal', label: '4. SIG NORMAL' },
]

function PixelRow({ active = false, children }) {
  return (
    <div
      className={`flex min-h-[18px] items-center px-1 ${
        active ? 'bg-[rgba(0,255,65,0.92)] text-black' : 'text-[color:var(--accent-green)]'
      }`}
    >
      {children}
    </div>
  )
}

export default function ESP32Screen({
  open,
  onClose,
  jammerPower = 0,
  onPowerChange,
  activePage,
}) {
  const [selection, setSelection] = useState(activePage ?? 0)
  const [screen, setScreen] = useState('menu')
  const [devicePower, setDevicePower] = useState(jammerPower)
  const [lastPressed, setLastPressed] = useState(null)
  const [scanProgress, setScanProgress] = useState(53)

  useEffect(() => {
    if (screen !== 'scanner') return undefined

    const timer = setInterval(() => {
      setScanProgress((prev) => (prev >= 99 ? 10 : prev + 3))
    }, 400)

    return () => clearInterval(timer)
  }, [screen])

  useEffect(() => {
    if (!lastPressed) return undefined

    const timer = setTimeout(() => {
      setLastPressed(null)
    }, 280)

    return () => clearTimeout(timer)
  }, [lastPressed])

  function flashButton(label) {
    setLastPressed(label)
  }

  const resetState = () => {
    setSelection(activePage ?? 0)
    setScreen('menu')
    setLastPressed(null)
    setScanProgress(53)
    setDevicePower(jammerPower)
    onClose()
  }

  const handleUp = () => {
    flashButton('UP')

    if (screen === 'menu') {
      setSelection((current) => (current - 1 + MENU_ITEMS.length) % MENU_ITEMS.length)
      return
    }

    if (screen === 'jamming') {
      const next = Math.min(2, Number((devicePower + 0.2).toFixed(1)))
      setDevicePower(next)
      onPowerChange?.(next)
    }
  }

  const handleDown = () => {
    flashButton('DOWN')

    if (screen === 'menu') {
      setSelection((current) => (current + 1) % MENU_ITEMS.length)
      return
    }

    if (screen === 'jamming') {
      const next = Math.max(0, Number((devicePower - 0.2).toFixed(1)))
      setDevicePower(next)
      onPowerChange?.(next)
    }
  }

  const handleSelect = () => {
    flashButton('SEL')

    if (screen === 'menu') {
      setScreen(MENU_ITEMS[selection].key)
      return
    }

    setScreen('menu')
  }

  const handleBack = () => {
    flashButton('BACK')

    if (screen === 'menu') {
      resetState()
      return
    }

    setScreen('menu')
  }

  const snr = Math.max(0, Math.round(20 * Math.log10(1 / (devicePower + 0.001))))
  const filled = Math.round(scanProgress / 10)
  const empty = 10 - filled

  const screenContent = {
    menu: (
      <>
        <PixelRow>
          <span className="cursor-blink">&gt;</span>
          <span className="ml-1">GHOST RADIO v2.4</span>
        </PixelRow>
        <div className="px-1 text-[#00b13a]">------------------</div>
        {MENU_ITEMS.map((item, index) => (
          <PixelRow key={item.key} active={selection === index}>
            <span className={selection === index ? 'cursor-blink' : ''}>&gt;</span>
            <span className="ml-1">{item.label}</span>
          </PixelRow>
        ))}
      </>
    ),
    scanner: (
      <>
        <PixelRow>SNIFFING...</PixelRow>
        <PixelRow>Rate: 480k sps</PixelRow>
        <PixelRow>Out: target.raw</PixelRow>
        <PixelRow>{`[${'#'.repeat(filled)}${'-'.repeat(empty)}] ${scanProgress}%`}</PixelRow>
        <PixelRow>Found: 1 file</PixelRow>
      </>
    ),
    jamming: (
      <>
        <PixelRow>JAMMER READY</PixelRow>
        <PixelRow>PWR: [{devicePower.toFixed(1)} ▲▼]</PixelRow>
        <PixelRow>Noise: Gaussian</PixelRow>
        <PixelRow>SNR: {snr} dB</PixelRow>
        <PixelRow>[ACTIVATE]</PixelRow>
      </>
    ),
    replay: (
      <>
        <PixelRow>REPLAY ATTACK</PixelRow>
        <PixelRow>File: target.raw</PixelRow>
        <PixelRow>Gain: x0.5 Loop:ON</PixelRow>
        <PixelRow>Dur: 16.3s</PixelRow>
        <PixelRow>[▶ PLAY] [■ STOP]</PixelRow>
      </>
    ),
    signal_normal: (
      <>
        <PixelRow>BASELINE SIGNAL</PixelRow>
        <PixelRow>Freq: 1000 Hz</PixelRow>
        <PixelRow>Rate: 32000 sps</PixelRow>
        <PixelRow>FFT: 1024 BH</PixelRow>
        <PixelRow>[VIEW FFT]</PixelRow>
      </>
    ),
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetState}
        >
          <motion.div
            className="relative flex w-[320px] max-w-[92vw] items-center gap-4 rounded-[28px] border border-slate-700/60 bg-[linear-gradient(180deg,#2b3138,#181d24)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            initial={{ y: 24, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 18, scale: 0.97 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute right-3 top-3 text-slate-300">
              <button
                type="button"
                className="rounded-full border border-slate-600/70 p-1 transition hover:border-[color:var(--accent-green)] hover:text-[color:var(--accent-green)]"
                onClick={resetState}
                aria-label="Close simulator"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex-1 rounded-[18px] border border-slate-600/60 bg-[linear-gradient(180deg,#11161d,#0a0f14)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="pointer-events-none absolute inset-0 rounded-[18px] opacity-20 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.06)_0,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_4px)]" />
              <div className="mb-3 text-center text-[10px] uppercase tracking-[0.18em] text-slate-400">
                GHOST RADIO ESP32-S3
              </div>
              <div className="pixel-screen relative mx-auto w-full max-w-[228px] rounded-sm border border-[rgba(0,255,65,0.28)] bg-[#030606] px-3 py-3 text-[color:var(--accent-green)] shadow-[inset_0_0_14px_rgba(0,255,65,0.16)]">
                <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:repeating-linear-gradient(0deg,rgba(0,255,65,0.5)_0,rgba(0,255,65,0.5)_1px,transparent_1px,transparent_2px)]" />
                <div className="relative min-h-[220px] space-y-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={screen}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.16 }}
                    >
                      {screenContent[screen]}
                    </motion.div>
                  </AnimatePresence>
                  {lastPressed && (
                    <div className="mt-2 text-[9px] uppercase tracking-[0.12em] text-[rgba(0,255,65,0.6)]">
                      [{lastPressed}] pressed
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[#00b13a]">------------------</div>
                <div className="mt-2 text-[9px] uppercase tracking-[0.12em] text-[#00b13a]">
                  {screen === 'menu' ? '> navigate with buttons' : '> [SELECT] to go back'}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {[
                ['UP', handleUp],
                ['SELECT', handleSelect],
                ['DOWN', handleDown],
                ['BACK', handleBack],
              ].map(([label, action]) => (
                <button
                  key={label}
                  type="button"
                  onClick={action}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-500/60 bg-[linear-gradient(180deg,#303741,#1c2229)] text-[9px] uppercase tracking-[0.15em] text-slate-200 shadow-[0_10px_20px_rgba(0,0,0,0.25)] transition hover:border-[color:var(--accent-green)] hover:text-[color:var(--accent-green)]"
                >
                  <span className="max-w-[42px] text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
