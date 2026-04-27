import { useEffect, useRef, useState } from 'react'

export default function useCountUp(target, duration = 1200, decimals = 0) {
  const [value, setValue] = useState(0)
  const previousRef = useRef(0)

  useEffect(() => {
    let frameId = 0
    const start = performance.now()
    const startValue = previousRef.current
    const delta = target - startValue

    const animate = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const nextValue = startValue + delta * eased
      setValue(nextValue)

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      } else {
        previousRef.current = target
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [duration, target])

  return Number(value.toFixed(decimals))
}
