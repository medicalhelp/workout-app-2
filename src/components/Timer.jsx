import { useEffect, useRef, useState } from 'react'
import { DEFAULT_TIMER_STATE, updateWorkoutTimer } from '../data/workoutStore'
import './Timer.scss'

function formatElapsed(ms) {
  const totalCentiseconds = Math.floor(ms / 10)
  const minutes = Math.floor(totalCentiseconds / 6000)
  const seconds = Math.floor((totalCentiseconds % 6000) / 100)
  const centiseconds = totalCentiseconds % 100
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(minutes)}:${pad(seconds)},${pad(centiseconds)}`
}

// Exact path data from Figma's play_arrow_filled icon (node 193:1754, Group 2134355738).
function PlayIcon() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <path d="M26 37V23L37 30L26 37Z" fill="#1C1C1E" />
    </svg>
  )
}

// No Figma asset exists for the running/pause state (the design only captured the idle
// state) — hand-drawn to match the play icon's weight and color.
function PauseIcon() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <rect x="22" y="21" width="6" height="18" fill="#1C1C1E" />
      <rect x="32" y="21" width="6" height="18" fill="#1C1C1E" />
    </svg>
  )
}

// Exact path data from Figma's close icon (node 193:1754, Group 2134355739).
function XIcon() {
  return (
    <svg viewBox="0 0 60 60" width="60" height="60">
      <path
        d="M24.4 37L23 35.6L28.6 30L23 24.4L24.4 23L30 28.6L35.6 23L37 24.4L31.4 30L37 35.6L35.6 37L30 31.4L24.4 37Z"
        fill="white"
        fillOpacity="0.45"
      />
    </svg>
  )
}

export default function Timer({ workout }) {
  const initialTimer = workout.timer ?? DEFAULT_TIMER_STATE
  const initialElapsedMs =
    initialTimer.running && initialTimer.startedAt != null
      ? Date.now() - initialTimer.startedAt
      : initialTimer.elapsedMs ?? 0

  const [running, setRunning] = useState(Boolean(initialTimer.running))
  const [elapsedMs, setElapsedMs] = useState(initialElapsedMs)
  const startedAtRef = useRef(Date.now() - initialElapsedMs)
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
      updateWorkoutTimer(workout, { running: false, startedAt: null, elapsedMs })
    } else {
      const startedAt = Date.now() - elapsedMs
      startedAtRef.current = startedAt
      setRunning(true)
      updateWorkoutTimer(workout, { running: true, startedAt, elapsedMs })
    }
  }

  function handleReset() {
    setRunning(false)
    setElapsedMs(0)
    updateWorkoutTimer(workout, { running: false, startedAt: null, elapsedMs: 0 })
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
