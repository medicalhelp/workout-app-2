import { useEffect, useRef, useState } from 'react'
import './Timer.scss'

function formatElapsed(ms) {
  const totalCentiseconds = Math.floor(ms / 10)
  const minutes = Math.floor(totalCentiseconds / 6000)
  const seconds = Math.floor((totalCentiseconds % 6000) / 100)
  const centiseconds = totalCentiseconds % 100
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(minutes)}:${pad(seconds)},${pad(centiseconds)}`
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
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
      <div className="timer__controls">
        <button className="timer__start-stop" onClick={handleStartStop} aria-label={running ? 'Stop' : 'Start'}>
          {running ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className="timer__reset" onClick={handleReset} disabled={elapsedMs === 0} aria-label="Reset">
          <XIcon />
        </button>
      </div>
      <span className="text-timer timer__display">{formatElapsed(elapsedMs)}</span>
    </div>
  )
}
