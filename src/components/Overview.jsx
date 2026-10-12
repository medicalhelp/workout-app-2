import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WorkoutCard from './WorkoutCard'
import './Overview.scss'

const CARD_TRANSITION = { duration: 0.22, ease: [0.32, 0.72, 0, 1] }

export default function Overview({ workouts, onOpenWorkout, onDeleteWorkout }) {
  const [openSwipeId, setOpenSwipeId] = useState(null)

  return (
    <div className="overview">
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
