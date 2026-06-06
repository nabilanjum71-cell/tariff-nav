'use client'
import { useEffect, useState } from 'react'

export default function DutyRateHero({ rate }: { rate: number }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (rate === 0) { setDisplayed(0); return }
    let start = 0
    const end = rate
    const duration = 1200
    const step = 16
    const increment = end / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setDisplayed(end); clearInterval(timer) }
      else setDisplayed(parseFloat(start.toFixed(1)))
    }, step)
    return () => clearInterval(timer)
  }, [rate])

  return (
    <div style={{ animation: 'countUp 0.4s ease both' }}>
      {rate === 0 ? (
        <span className="font-display" style={{ fontSize: '2.25rem', color: '#22c55e' }}>Free</span>
      ) : (
        <span className="font-display" style={{ fontSize: '2.25rem', color: rate < 5 ? '#86efac' : rate < 15 ? '#fbbf24' : '#f87171' }}>
          {displayed.toFixed(rate % 1 === 0 ? 0 : 1)}%
        </span>
      )}
    </div>
  )
}
