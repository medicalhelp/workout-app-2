import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatRelativeShort } from '../utils/date'
import { formatWeight } from '../utils/weight'
import WorkoutCard from './WorkoutCard'
import './Overview.scss'

const CARD_TRANSITION = { duration: 0.22, ease: [0.32, 0.72, 0, 1] }

export default function Overview({ workouts, latestWeight, onOpenWorkout, onDeleteWorkout, onOpenWeight }) {
  const [openSwipeId, setOpenSwipeId] = useState(null)

  return (
    <div className="overview">
      <div className="overview__header">
        <h1 className="text-headline overview__title">Workout</h1>
        {/* Glance-and-forget freshness indicator (relative date, not absolute) — the dedicated
            Weight screen this opens shows full dates instead, for actually reviewing history. */}
        <button className="text-body overview__weight-badge" onClick={onOpenWeight}>
          {latestWeight ? `${formatWeight(latestWeight.value)}kg · ${formatRelativeShort(latestWeight.date)}` : '+ Weight'}
        </button>
      </div>

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
