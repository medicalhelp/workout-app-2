import { useState } from 'react'
import WorkoutCard from './WorkoutCard'
import './Overview.scss'

export default function Overview({ workouts, onStartWorkout, onOpenWorkout, onDeleteWorkout }) {
  const [openSwipeId, setOpenSwipeId] = useState(null)

  return (
    <div className="overview">
      <div className="overview__header">
        <h1 className="text-headline">Workouts</h1>
        <button className="text-body overview__start" onClick={onStartWorkout}>
          Start Workout
        </button>
      </div>

      {workouts.length === 0 ? (
        <p className="text-body overview__empty">No workouts yet.</p>
      ) : (
        <ul className="overview__list">
          {workouts.map((workout) => (
            <li key={workout.id}>
              <WorkoutCard
                workout={workout}
                open={openSwipeId === workout.id}
                onOpen={onOpenWorkout}
                onSwipeChange={(isOpen) => setOpenSwipeId(isOpen ? workout.id : null)}
                onDelete={onDeleteWorkout}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
