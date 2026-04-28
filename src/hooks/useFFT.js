import { useEffect, useMemo, useState } from 'react'
import { TARGET_FREQUENCY_MHZ } from '../constants/hardware'

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function buildRfSpectrum(mode, jammerPower) {
  const points = 128
  const min = 444
  const max = 448
  const span = max - min
  const noiseFloor =
    mode === 'jamming'
      ? -98 + jammerPower * 22
      : mode === 'replay'
        ? -90
        : mode === 'scanner'
          ? -96
          : -104

  return Array.from({ length: points }, (_, index) => {
    const frequency = min + (index / (points - 1)) * span
    const distance = Math.abs(frequency - TARGET_FREQUENCY_MHZ)
    const mainCarrier =
      mode === 'jamming'
        ? Math.max(-10, -24 + jammerPower * 8 - distance * 120)
        : Math.max(-18, -16 - distance * 180)
    const sideBurst =
      mode === 'scanner'
        ? Math.max(-44, -38 - Math.abs(frequency - 445.9875) * 220)
        : Math.max(-52, -44 - Math.abs(frequency - 446.0188) * 240)

    let power = noiseFloor + randomBetween(-4, 4)

    if (mode === 'normal') {
      power = -104 + randomBetween(-2.5, 2.5)
    }

    if (distance < 0.12) {
      power = Math.max(power, mainCarrier + randomBetween(-1.5, 1.5))
    }

    if (mode !== 'normal' && Math.abs(frequency - 445.9875) < 0.08) {
      power = Math.max(power, sideBurst + randomBetween(-1.5, 1.5))
    }

    if (mode === 'jamming') {
      power = Math.max(power, -48 + jammerPower * 6 + randomBetween(-5, 3))
    }

    return {
      x: Number(frequency.toFixed(4)),
      y: Number(power.toFixed(2)),
    }
  })
}

function buildAudioSpectrum() {
  const points = 128
  return Array.from({ length: points }, (_, index) => {
    const frequency = (index / (points - 1)) * 2000
    const distance = Math.abs(frequency - 1000)
    const power =
      distance < 90
        ? -10 - distance * 0.12 + randomBetween(-0.8, 0.8)
        : -104 + randomBetween(-3, 3)

    return {
      x: Number(frequency.toFixed(0)),
      y: Number(power.toFixed(2)),
    }
  })
}

export default function useFFT({ mode = 'scanner', jammerPower = 0.8, profile = 'rf' }) {
  const [tick, setTick] = useState(0)

  const intervalMs = useMemo(() => {
    if (profile === 'audio') return 850
    if (mode === 'jamming') return 280
    if (mode === 'replay') return 420
    if (mode === 'normal') return 700
    return 520
  }, [mode, profile])

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((current) => current + 1)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [intervalMs])

  return useMemo(() => {
    void tick
    return profile === 'audio'
      ? buildAudioSpectrum()
      : buildRfSpectrum(mode, jammerPower)
  }, [jammerPower, mode, profile, tick])
}
