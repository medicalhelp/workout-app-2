import { useEffect, useRef, useState } from 'react'
import { formatDate } from '../utils/date'
import './WorkoutCard.scss'

const DELETE_WIDTH = 88
const TAP_THRESHOLD = 8

export default function WorkoutCard({ workout, open, onOpen, onSwipeChange, onDelete }) {
  const [dragX, setDragX] = useState(0)
  const draggingRef = useRef(false)
  const startXRef = useRef(0)
  const startDragXRef = useRef(0)

  useEffect(() => {
    if (draggingRef.current) return
    setDragX(open ? -DELETE_WIDTH : 0)
  }, [open])

  function handlePointerDown(e) {
    draggingRef.current = true
    startXRef.current = e.clientX
    startDragXRef.current = dragX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e) {
    if (!draggingRef.current) return
    const delta = e.clientX - startXRef.current
    const next = Math.min(0, Math.max(-DELETE_WIDTH, startDragXRef.current + delta))
    setDragX(next)
  }

  function handlePointerUp(e) {
    if (!draggingRef.current) return
    draggingRef.current = false
    const totalDelta = e.clientX - startXRef.current

    if (Math.abs(totalDelta) < TAP_THRESHOLD) {
      if (open) {
        setDragX(0)
        onSwipeChange(false)
      } else {
        onOpen(workout.id)
      }
      return
    }

    const shouldOpen = dragX < -DELETE_WIDTH / 2
    setDragX(shouldOpen ? -DELETE_WIDTH : 0)
    onSwipeChange(shouldOpen)
  }

  return (
    <div className="workout-card">
      <button className="workout-card__delete" onClick={() => onDelete(workout.id)} aria-label="Delete workout">
        Delete
      </button>
      <div
        className="workout-card__surface"
        style={{ transform: `translateX(${dragX}px)`, transition: draggingRef.current ? 'none' : 'transform 0.2s ease-out' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span className="text-headline workout-card__type">{workout.type}</span>
        <span className="text-body workout-card__date">{formatDate(workout.date)}</span>
      </div>
    </div>
  )
}
