import { useState } from 'react'
import Overview from './components/Overview'
import TypePickerDrawer from './components/TypePickerDrawer'
import WorkoutScreen from './components/WorkoutScreen'
import { createWorkout, deleteWorkout, getWorkoutById, getWorkouts } from './data/workoutStore'

export default function App() {
  const [workouts, setWorkouts] = useState(() => getWorkouts())
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  function refreshWorkouts() {
    setWorkouts(getWorkouts())
  }

  function handleStartWorkout() {
    setDrawerOpen(true)
  }

  function handleSelectType(type) {
    setDrawerOpen(false)
    setActiveWorkout(createWorkout(type))
  }

  function handleOpenWorkout(id) {
    const workout = getWorkoutById(id)
    if (workout) setActiveWorkout(workout)
  }

  function handleBackFromWorkout() {
    setActiveWorkout(null)
    refreshWorkouts()
  }

  function handleDeleteWorkout(id) {
    deleteWorkout(id)
    refreshWorkouts()
  }

  if (activeWorkout) {
    return <WorkoutScreen workout={activeWorkout} onBack={handleBackFromWorkout} />
  }

  return (
    <>
      <Overview
        workouts={workouts}
        onStartWorkout={handleStartWorkout}
        onOpenWorkout={handleOpenWorkout}
        onDeleteWorkout={handleDeleteWorkout}
      />
      <TypePickerDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSelect={handleSelectType} />
    </>
  )
}
