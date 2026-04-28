import { useEffect, useState } from 'react'

export default function useUptime(initialValue = 0) {
  const [uptime, setUptime] = useState(initialValue)

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime((current) => current + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return uptime
}
