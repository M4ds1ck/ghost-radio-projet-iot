import { useEffect, useState } from 'react'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function gaussianNoise() {
  let u = 0
  let v = 0

  while (u === 0) {
    u = Math.random()
  }

  while (v === 0) {
    v = Math.random()
  }

  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function createWaveFrame({
  points,
  amplitude,
  noise,
  speed,
  phase,
  dualChannel,
  offset,
}) {
  return Array.from({ length: points }, (_, index) => {
    const x = index / (points - 1)
    const carrier = Math.sin(x * Math.PI * 5 + phase * speed) * amplitude
    const harmonic = Math.sin(x * Math.PI * 13 + phase * 0.65) * amplitude * 0.2
    const sampleNoise = gaussianNoise() * noise
    const primary = clamp(carrier + harmonic + sampleNoise, -1.2, 1.2)

    if (!dualChannel) {
      return { x, i: primary }
    }

    const quadrature =
      Math.cos(x * Math.PI * 5 + phase * speed + offset) * amplitude * 0.92 +
      Math.sin(x * Math.PI * 11 + phase * 0.5) * amplitude * 0.16 +
      gaussianNoise() * noise

    return {
      x,
      i: primary,
      q: clamp(quadrature, -1.2, 1.2),
    }
  })
}

export default function useSignalSimulator({
  points = 160,
  amplitude = 0.9,
  noise = 0.1,
  speed = 1,
  running = true,
  dualChannel = false,
  offset = Math.PI / 2,
} = {}) {
  const [frame, setFrame] = useState(() =>
    createWaveFrame({
      points,
      amplitude,
      noise,
      speed,
      phase: 0,
      dualChannel,
      offset,
    }),
  )

  useEffect(() => {
    let animationFrame = 0
    let phase = 0

    const tick = () => {
      if (running) {
        phase += 0.08
        setFrame(
          createWaveFrame({
            points,
            amplitude,
            noise,
            speed,
            phase,
            dualChannel,
            offset,
          }),
        )
      }

      animationFrame = requestAnimationFrame(tick)
    }

    animationFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrame)
  }, [amplitude, dualChannel, noise, offset, points, running, speed])

  return frame
}
