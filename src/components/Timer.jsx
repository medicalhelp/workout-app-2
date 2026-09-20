import { useEffect, useRef, useState } from 'react'
import './Timer.scss'

function formatElapsed(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`
}

export default function Timer() {
  const [running, setRunning] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const startedAtRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!running) return

    function tick() {
      setElapsedMs(Date.now() - startedAtRef.current)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameRef.current)
  }, [running])

  function handleStartStop() {
    if (running) {
      setRunning(false)
    } else {
      startedAtRef.current = Date.now() - elapsedMs
      setRunning(true)
    }
  }

  function handleReset() {
    setRunning(false)
    setElapsedMs(0)
  }

  return (
    <div className="timer">
      <span className="text-timer timer__display">{formatElapsed(elapsedMs)}</span>
      <div className="timer__controls">
        <button className="timer__reset" onClick={handleReset} disabled={elapsedMs === 0}>
          Reset
        </button>
        <button
          className={`timer__start-stop ${running ? 'timer__start-stop--running' : ''}`}
          onClick={handleStartStop}
        >
          {running ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  )
}
