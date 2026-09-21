import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { formatDate } from '../utils/date'
import { getWorkoutById, saveWorkout } from '../data/workoutStore'
import Timer from './Timer'
import './WorkoutScreen.scss'

const AUTOSAVE_INTERVAL_MS = 15000
const TAP_TRANSITION = { type: 'spring', stiffness: 700, damping: 30 }

export default function WorkoutScreen({ workout, onBack }) {
  const [content, setContent] = useState(workout.content)
  const dirtyRef = useRef(false)
  const contentRef = useRef(content)
  const textareaRef = useRef(null)

  useEffect(() => {
    contentRef.current = content
  }, [content])

  function persist() {
    if (!dirtyRef.current) return
    // Merge onto the latest stored record (not the stale `workout` prop from mount) so
    // this doesn't clobber timer state the Timer component may have persisted since.
    const current = getWorkoutById(workout.id) ?? workout
    saveWorkout({ ...current, content: contentRef.current })
    dirtyRef.current = false
  }

  useEffect(() => {
    const interval = setInterval(persist, AUTOSAVE_INTERVAL_MS)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [content])

  function handleChange(e) {
    setContent(e.target.value)
    dirtyRef.current = true
  }

  function handleBack() {
    persist()
    onBack()
  }

  return (
    <div className="workout-screen">
      <motion.button
        className="workout-screen__back"
        onClick={handleBack}
        whileTap={{ scale: 0.88 }}
        transition={TAP_TRANSITION}
        aria-label="Back"
      >
        ‹
      </motion.button>
      <span className="text-headline workout-screen__title">
        {workout.type} {formatDate(workout.date)}
      </span>

      <textarea
        ref={textareaRef}
        className="text-body workout-screen__content"
        value={content}
        onChange={handleChange}
        placeholder="Log your sets..."
      />

      <Timer workout={workout} />
    </div>
  )
}
