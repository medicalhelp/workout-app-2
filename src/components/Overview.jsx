import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WorkoutCard from './WorkoutCard'
import './Overview.scss'

const CARD_TRANSITION = { duration: 0.22, ease: [0.32, 0.72, 0, 1] }

export default function Overview({ workouts, onOpenWorkout, onDeleteWorkout }) {
  const [openSwipeId, setOpenSwipeId] = useState(null)

  return (
    <div className="overview">
      {/* Shared goo filter for every WorkoutCard's swipe-to-delete blob merge (referenced via
          `filter: url(#goo)` in WorkoutCard.scss) — defined once here rather than per-card
          since SVG filters are referenced by id, not duplicated per element. Blurs the two
          shapes together, then the feColorMatrix sharpens the alpha channel back to a hard
          edge everywhere except the blurred overlap, which is what reads as a liquid seam. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
        </filter>
      </svg>

      <h1 className="text-headline overview__title">Workout</h1>

      {workouts.length === 0 ? (
        <p className="text-body overview__empty">No workouts yet.</p>
      ) : (
        <ul className="overview__list">
          <AnimatePresence initial={false}>
            {workouts.map((workout) => (
              // `layout` lets remaining cards smoothly slide into the gap left by a deleted
              // one — the leaving card itself just fades/scales out in place first (via
              // `exit`), so nothing overlaps while both animations are in flight.
              <motion.li
                key={workout.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={CARD_TRANSITION}
              >
                <WorkoutCard
                  workout={workout}
                  open={openSwipeId === workout.id}
                  onOpen={onOpenWorkout}
                  onSwipeChange={(isOpen) => setOpenSwipeId(isOpen ? workout.id : null)}
                  onDelete={onDeleteWorkout}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
