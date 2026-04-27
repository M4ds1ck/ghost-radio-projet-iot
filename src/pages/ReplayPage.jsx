import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useOutletContext } from 'react-router-dom'
import FFTChart from '../components/FFTChart/FFTChart'
import FlowGraph from '../components/FlowGraph/FlowGraph'
import { PauseIcon, PlayIcon, ResetIcon } from '../components/Icons'
import WaveformChart from '../components/WaveformChart/WaveformChart'
import { GNURADIO, getCaptureDurationSeconds } from '../constants/gnuradio'
import useCountUp from '../hooks/useCountUp'
import useSignalSimulator from '../hooks/useSignalSimulator'

const REPLAY_DURATION = getCaptureDurationSeconds()

function formatLogTime(seconds) {
  const totalMs = Math.floor(seconds * 1000)
  const minutes = String(Math.floor(totalMs / 60000)).padStart(2, '0')
  const secondsPart = String(Math.floor((totalMs % 60000) / 1000)).padStart(2, '0')
  const milliseconds = String(totalMs % 1000).padStart(3, '0')
  return `${minutes}:${secondsPart}.${milliseconds}`
}

function createBaseLogs() {
  return [
    '> [00:00.000] Loading captured_target.raw...',
    '> [00:00.012] File source initialized. 62.4MB | loop=true',
    '> [00:00.024] NBFM RX demodulator started',
    '> [00:00.036] Throttle block active: 480000 sps',
    '> [00:00.048] Audio sink streaming at 48000 Hz',
  ]
}

export default function ReplayPage() {
  const { replayPlaying, setReplayPlaying } = useOutletContext()
  const [elapsed, setElapsed] = useState(0)
  const [loopEnabled, setLoopEnabled] = useState(true)
  const [logs, setLogs] = useState(() => createBaseLogs())
  const logRef = useRef(null)
  const frameCounterRef = useRef(0)
  const waveform = useSignalSimulator({
    amplitude: 0.92,
    noise: 0.08,
    speed: 1.15,
    running: replayPlaying,
    dualChannel: true,
  })
  const animatedDuration = useCountUp(REPLAY_DURATION, 1200, 2)

  useEffect(() => {
    return () => {
      setReplayPlaying(false)
    }
  }, [setReplayPlaying])

  useEffect(() => {
    if (!replayPlaying) {
      return undefined
    }

    const progressTimer = setInterval(() => {
      setElapsed((current) => {
        const next = current + 0.1
        if (next >= REPLAY_DURATION) {
          if (loopEnabled) {
            frameCounterRef.current = 0
            setLogs(createBaseLogs())
            return 0
          }

          setReplayPlaying(false)
          return REPLAY_DURATION
        }

        return next
      })
    }, 100)

    return () => clearInterval(progressTimer)
  }, [loopEnabled, replayPlaying, setReplayPlaying])

  useEffect(() => {
    if (!replayPlaying) {
      return undefined
    }

    const logTimer = setInterval(() => {
      frameCounterRef.current += 1
      const timestamp = frameCounterRef.current * 1.2
      setLogs((previous) => {
        const next = [
          ...previous,
          `> [${formatLogTime(timestamp)}] Frame ${frameCounterRef.current}/520 transmitted \u2713`,
        ]
        return next.length > 80 ? next.slice(next.length - 80) : next
      })
    }, 1200)

    return () => clearInterval(logTimer)
  }, [replayPlaying])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [logs])

  const progress = (elapsed / REPLAY_DURATION) * 100

  const handleReset = () => {
    setReplayPlaying(false)
    setElapsed(0)
    frameCounterRef.current = 0
    setLogs(createBaseLogs())
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-sm border border-[rgba(255,149,0,0.35)] bg-[rgba(255,149,0,0.08)] px-3 py-2 text-[color:var(--accent-orange)] shadow-[0_0_18px_rgba(255,149,0,0.16)]">
          REPLAY
        </div>
        <div>
          <div className="text-2xl uppercase tracking-[0.18em] text-[color:var(--accent-orange)]">
            Replay Attack
          </div>
          <div className="mt-1 text-sm text-slate-400">
            Replay_Attack.py demodulation and looped playback surface
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="space-y-4">
          <div className="panel p-5 text-sm text-slate-300">
            <div className="section-heading">Capture File</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>File</span>
                <span>captured_target.raw</span>
              </div>
              <div className="flex justify-between">
                <span>Size</span>
                <span>{GNURADIO.replay.input_size_bytes.toLocaleString('en-US')} bytes</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span>{animatedDuration.toFixed(2)} seconds</span>
              </div>
              <div className="flex justify-between">
                <span>Repeat</span>
                <span>YES (loop enabled)</span>
              </div>
              <div className="flex justify-between">
                <span>Offset / Length</span>
                <span>0 | 0</span>
              </div>
              <div className="flex justify-between">
                <span>NBFM RX</span>
                <span>audio=48k | quad=480k</span>
              </div>
              <div className="flex justify-between">
                <span>RX tau / max_dev</span>
                <span>75\u00b5s | 5k</span>
              </div>
              <div className="flex justify-between">
                <span>Output gain</span>
                <span>x0.5</span>
              </div>
              <div className="flex justify-between">
                <span>Audio Sink</span>
                <span>48,000 Hz</span>
              </div>
            </div>
          </div>

          <div className="panel p-5">
            <div className="section-heading">Playback Controls</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="control-button" onClick={handleReset}>
                <ResetIcon />
                <span>RESET</span>
              </button>
              <button
                type="button"
                className="control-button border-[rgba(255,149,0,0.35)] text-[color:var(--accent-orange)]"
                onClick={() => setReplayPlaying(true)}
              >
                <PlayIcon />
                <span>PLAY</span>
              </button>
              <button
                type="button"
                className="control-button"
                onClick={() => setReplayPlaying(false)}
              >
                <PauseIcon />
                <span>PAUSE</span>
              </button>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-slate-500">
                <span>Progress</span>
                <span>{formatLogTime(elapsed)}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-[color:var(--border)] bg-[color:var(--bg-secondary)]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent-orange),#ffd166)] transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    boxShadow: '0 0 14px rgba(255,149,0,0.24)',
                  }}
                />
              </div>
              <button
                type="button"
                className={`mt-4 rounded-sm border px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition ${
                  loopEnabled
                    ? 'border-[rgba(255,149,0,0.35)] bg-[rgba(255,149,0,0.08)] text-[color:var(--accent-orange)]'
                    : 'border-[color:var(--border)] bg-[color:var(--bg-secondary)] text-slate-300'
                }`}
                onClick={() => setLoopEnabled((current) => !current)}
              >
                {'\u{1F501} LOOP ENABLED'}
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="panel p-5">
            <div className="section-heading">IQ Waveform</div>
            <div className="mt-4 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/75 p-4">
              <WaveformChart data={waveform} height={240} playhead={progress / 100} />
            </div>
          </div>

          <div className="panel p-5">
            <div className="section-heading">Replay Spectrum</div>
            <div className="mt-4 rounded-sm border border-[color:var(--border)] bg-[color:var(--bg-secondary)]/75 p-4">
              <FFTChart mode="replay" height={220} />
            </div>
          </div>

          <div className="panel p-5">
            <div className="section-heading">Replay Status</div>
            <div
              ref={logRef}
              className="terminal-scrollbar mt-4 h-[240px] overflow-y-auto rounded-sm border border-[rgba(0,255,65,0.18)] bg-[#050807] p-4 font-mono text-sm text-[color:var(--accent-green)] shadow-[inset_0_0_14px_rgba(0,255,65,0.12)]"
            >
              <AnimatePresence initial={false}>
                {logs.map((line, index) => (
                  <motion.div
                    key={`${index}-${line}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mb-2 last:mb-0"
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      <section className="panel p-5">
        <div className="section-heading">Flowgraph Topology</div>
        <div className="mt-4">
          <FlowGraph module="replay" />
        </div>
      </section>
    </section>
  )
}
