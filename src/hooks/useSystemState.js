import { useEffect, useMemo, useState } from 'react'
import {
  INITIAL_CAPTURES,
  INITIAL_DETECTIONS,
  INITIAL_SIGNAL_LOGS,
  TARGET_FREQUENCY_MHZ,
} from '../constants/hardware'
import useUptime from './useUptime'

function nowStamp(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function apiDelay(result) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), 140)
  })
}

function buildScannerLog(rssi) {
  const messages = [
    'porteuse PMR446 detectee sur le canal principal',
    'GDO2 actif, flux brut remonte vers l ESP32',
    'trame candidate stockee dans le buffer SPIFFS',
    'niveau RSSI au-dessus du seuil de capture',
  ]

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    timestamp: nowStamp(),
    rssi,
    message: messages[Math.floor(Math.random() * messages.length)],
  }
}

export default function useSystemState() {
  const uptime = useUptime(3420)
  const [state, setState] = useState({
    mode: 'scanner',
    frequency: TARGET_FREQUENCY_MHZ,
    rssi: -72,
    battery: 87,
    jammerPower: 0.8,
    connected: true,
    scannerRunning: true,
    jammingRunning: false,
    replayPlaying: false,
    captures: INITIAL_CAPTURES,
    selectedCaptureId: INITIAL_CAPTURES[0].id,
  })
  const [signalLogs, setSignalLogs] = useState(INITIAL_SIGNAL_LOGS)
  const [scannerLog, setScannerLog] = useState(() => [
    buildScannerLog(-72),
    buildScannerLog(-69),
    buildScannerLog(-74),
  ])
  const [detectedSignals, setDetectedSignals] = useState(INITIAL_DETECTIONS)
  const [lastApiCall, setLastApiCall] = useState('GET /api/status')
  const [replayPosition, setReplayPosition] = useState(0)

  useEffect(() => {
    const telemetryTimer = setInterval(() => {
      setState((current) => {
        const baseRssi =
          current.mode === 'jamming'
            ? -46 - current.jammerPower * 14
            : current.mode === 'replay'
              ? -59
              : current.mode === 'normal'
                ? -92
                : -72

        return {
          ...current,
          rssi: Number((baseRssi + (Math.random() * 8 - 4)).toFixed(1)),
          battery:
            uptime % 210 === 0 && current.battery > 66 ? current.battery - 1 : current.battery,
        }
      })
    }, 1200)

    return () => clearInterval(telemetryTimer)
  }, [uptime])

  useEffect(() => {
    const logTimer = setInterval(() => {
      setSignalLogs((current) => {
        const next = [
          {
            id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
            timestamp: nowStamp(),
            frequency: TARGET_FREQUENCY_MHZ,
            rssi: state.rssi,
            mode: state.mode,
          },
          ...current,
        ]
        return next.slice(0, 8)
      })

      if (state.scannerRunning) {
        setScannerLog((current) => [buildScannerLog(state.rssi), ...current].slice(0, 10))
        setDetectedSignals((current) =>
          current.map((entry) => ({
            ...entry,
            rssi: Number((entry.rssi + (Math.random() * 6 - 3)).toFixed(0)),
          })),
        )
      }
    }, 2500)

    return () => clearInterval(logTimer)
  }, [state.mode, state.rssi, state.scannerRunning])

  useEffect(() => {
    if (!state.replayPlaying) {
      return undefined
    }

    const replayTimer = setInterval(() => {
      setReplayPosition((current) => (current >= 100 ? 0 : current + 2.25))
    }, 220)

    return () => clearInterval(replayTimer)
  }, [state.replayPlaying])

  const api = useMemo(
    () => ({
      getStatus: async () => {
        setLastApiCall('GET /api/status')
        return apiDelay({
          mode: state.mode,
          frequency: state.frequency,
          rssi: state.rssi,
          battery: state.battery,
          uptime,
        })
      },
      getCaptures: async () => {
        setLastApiCall('GET /api/captures')
        return apiDelay(state.captures)
      },
      getSignal: async () => {
        setLastApiCall('GET /api/signal')
        return apiDelay({
          samples: Array.from({ length: 128 }, (_, index) =>
            Number((Math.sin(index / 8) * 0.8 + Math.random() * 0.2 - 0.1).toFixed(3)),
          ),
        })
      },
      setMode: async (mode) => {
        setLastApiCall(`POST /api/mode { mode: "${mode}" }`)
        setState((current) => ({
          ...current,
          mode,
          scannerRunning: mode === 'scanner',
          jammingRunning: mode === 'jamming',
          replayPlaying: mode === 'replay' ? current.replayPlaying : false,
        }))
        return apiDelay({ success: true, mode })
      },
      setJammerPower: async (power) => {
        setLastApiCall(`POST /api/jammer { power: ${power.toFixed(1)} }`)
        setState((current) => ({
          ...current,
          jammerPower: power,
          mode: current.jammingRunning ? 'jamming' : current.mode,
        }))
        return apiDelay({ success: true, power })
      },
      setJammingActive: async (active) => {
        setLastApiCall(`POST /api/mode { mode: "${active ? 'jamming' : 'normal'}" }`)
        setState((current) => ({
          ...current,
          mode: active ? 'jamming' : 'normal',
          jammingRunning: active,
          scannerRunning: false,
          replayPlaying: false,
        }))
        return apiDelay({ success: true, mode: active ? 'jamming' : 'normal' })
      },
      setScannerActive: async (active) => {
        setLastApiCall(`POST /api/mode { mode: "${active ? 'scanner' : 'normal'}" }`)
        setState((current) => ({
          ...current,
          mode: active ? 'scanner' : 'normal',
          scannerRunning: active,
          jammingRunning: false,
          replayPlaying: false,
        }))
        return apiDelay({ success: true, mode: active ? 'scanner' : 'normal' })
      },
      loadCapture: async (captureId) => {
        setLastApiCall('GET /api/captures')
        setState((current) => ({
          ...current,
          selectedCaptureId: captureId,
        }))
        return apiDelay({ success: true, captureId })
      },
      startReplay: async () => {
        setLastApiCall('POST /api/replay/start')
        setReplayPosition(0)
        setState((current) => ({
          ...current,
          mode: 'replay',
          replayPlaying: true,
          scannerRunning: false,
          jammingRunning: false,
        }))
        return apiDelay({ success: true, playing: true })
      },
      stopReplay: async () => {
        setLastApiCall('POST /api/replay/stop')
        setReplayPosition(0)
        setState((current) => ({
          ...current,
          mode: 'normal',
          replayPlaying: false,
        }))
        return apiDelay({ success: true, playing: false })
      },
    }),
    [state, uptime],
  )

  return {
    systemState: {
      ...state,
      uptime,
      signalLogs,
      scannerLog,
      detectedSignals,
      lastApiCall,
      replayPosition,
      selectedCapture:
        state.captures.find((capture) => capture.id === state.selectedCaptureId) ??
        state.captures[0],
    },
    api,
  }
}
