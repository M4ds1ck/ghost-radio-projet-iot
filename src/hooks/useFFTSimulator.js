import { useEffect, useState } from 'react'
import { GNURADIO } from '../constants/gnuradio'

const MODE_CONFIG = {
  normal: {
    xMin: -16000,
    xMax: 16000,
    yMin: GNURADIO.signalNormal.y_min,
    yMax: GNURADIO.signalNormal.y_max,
    color: '#3b82f6',
  },
  jamming: {
    xMin: -240000,
    xMax: 240000,
    yMin: -140,
    yMax: 10,
    color: '#ff2d55',
  },
  sniffing: {
    xMin: -240000,
    xMax: 240000,
    yMin: -140,
    yMax: 10,
    color: '#00d4ff',
  },
  replay: {
    xMin: -240000,
    xMax: 240000,
    yMin: -140,
    yMax: 10,
    color: '#ff9500',
  },
}

function lerp(start, end, amount) {
  return start + (end - start) * amount
}

function gaussian(frequency, center, width, amplitude) {
  return amplitude * Math.exp(-((frequency - center) ** 2) / (2 * width ** 2))
}

function nbfmEnvelope(frequency, attenuation = 0) {
  const central = gaussian(frequency, 0, 1500, 64 - attenuation)
  const shoulderLeft = gaussian(frequency, -3500, 1800, 48 - attenuation)
  const shoulderRight = gaussian(frequency, 3500, 1800, 48 - attenuation)
  const skirtsLeft = gaussian(frequency, -6200, 2200, 20 - attenuation * 0.5)
  const skirtsRight = gaussian(frequency, 6200, 2200, 20 - attenuation * 0.5)
  return central + shoulderLeft + shoulderRight + skirtsLeft + skirtsRight
}

function createInitialFrame(mode, points) {
  const config = MODE_CONFIG[mode]
  const span = config.xMax - config.xMin
  return Array.from({ length: points }, (_, index) => {
    const ratio = index / (points - 1)
    return {
      frequency: config.xMin + ratio * span,
      magnitude: config.yMin + 8,
    }
  })
}

function createTargetMagnitude(mode, frequency, phase, jammerPower) {
  const noiseWobble = Math.sin(phase + frequency / 12000) * 1.8
  const fineNoise = Math.cos(phase * 0.7 + frequency / 5500) * 1.1

  if (mode === 'normal') {
    const floor = -120 + noiseWobble * 0.35 + fineNoise * 0.2
    const spike = gaussian(
      frequency,
      GNURADIO.signalNormal.signal_freq,
      120,
      122 + Math.sin(phase * 0.8) * 1.1,
    )
    return floor + spike
  }

  if (mode === 'sniffing') {
    const floor = -118 + noiseWobble * 0.7 + fineNoise * 0.5
    return floor + nbfmEnvelope(frequency, 0)
  }

  if (mode === 'replay') {
    const floor = -121 + noiseWobble * 0.75 + fineNoise * 0.5
    return floor + nbfmEnvelope(frequency, 6)
  }

  const noiseFloor = -120 + jammerPower * 30 + noiseWobble * 0.9 + fineNoise * 0.7
  const buriedPeak = nbfmEnvelope(frequency, jammerPower * 20)
  return noiseFloor + buriedPeak
}

export default function useFFTSimulator({
  mode = 'normal',
  jammerPower = 0,
  points = 120,
} = {}) {
  const [data, setData] = useState(() => createInitialFrame(mode, points))

  useEffect(() => {
    let phase = 0
    const timer = setInterval(() => {
      phase += 0.22
      const config = MODE_CONFIG[mode]
      const span = config.xMax - config.xMin

      setData((current) =>
        Array.from({ length: points }, (_, index) => {
          const ratio = index / (points - 1)
          const frequency = config.xMin + ratio * span
          const previous = current[index]?.magnitude ?? config.yMin + 8
          const target = createTargetMagnitude(mode, frequency, phase, jammerPower)

          return {
            frequency,
            magnitude: lerp(previous, target, 0.28),
          }
        }),
      )
    }, 150)

    return () => clearInterval(timer)
  }, [jammerPower, mode, points])

  return {
    data,
    config: MODE_CONFIG[mode],
  }
}
