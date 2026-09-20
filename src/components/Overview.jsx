import { formatDate } from '../utils/date'
import './Overview.scss'

export default function Overview({ workouts, onStartWorkout, onOpenWorkout }) {
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
              <button className="overview__card" onClick={() => onOpenWorkout(workout.id)}>
                <span className="text-headline overview__card-type">{workout.type}</span>
                <span className="text-body overview__card-date">{formatDate(workout.date)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
