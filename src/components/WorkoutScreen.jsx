import { useEffect, useRef, useState } from 'react'
import { formatDate } from '../utils/date'
import { saveWorkout } from '../data/workoutStore'
import Timer from './Timer'
import './WorkoutScreen.scss'

const AUTOSAVE_INTERVAL_MS = 15000

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
    saveWorkout({ ...workout, content: contentRef.current })
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
      <div className="workout-screen__header">
        <button className="workout-screen__back" onClick={handleBack} aria-label="Back">
          ‹
        </button>
        <div className="workout-screen__titles">
          <span className="text-headline">{workout.type}</span>
          <span className="text-body workout-screen__date">{formatDate(workout.date)}</span>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className="text-body workout-screen__content"
        value={content}
        onChange={handleChange}
        placeholder="Log your sets..."
        autoFocus
      />

      <div className="workout-screen__timer">
        <Timer />
      </div>
    </div>
  )
}
