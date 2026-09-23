import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Overview from './components/Overview'
import StartWorkoutSheet from './components/StartWorkoutSheet'
import WorkoutScreen from './components/WorkoutScreen'
import { createWorkout, deleteWorkout, getWorkoutById, getWorkouts } from './data/workoutStore'
import './App.scss'

// Matches the ease already used for the Start Workout sheet morph, for a consistent feel.
const PAGE_TRANSITION = { duration: 0.34, ease: [0.32, 0.72, 0, 1] }

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

  return (
    <div className="app-stack">
      <Overview workouts={workouts} onOpenWorkout={handleOpenWorkout} onDeleteWorkout={handleDeleteWorkout} />
      <StartWorkoutSheet
        open={drawerOpen}
        hidden={Boolean(activeWorkout)}
        onOpen={handleStartWorkout}
        onClose={() => setDrawerOpen(false)}
        onSelect={handleSelectType}
      />
      {/* Overview stays mounted underneath at all times; WorkoutScreen slides in/out on top of
          it as an overlay (Notes/iOS-style push), instead of a hard instant swap. */}
      <AnimatePresence>
        {activeWorkout && (
          <motion.div
            key="workout"
            className="app-stack__overlay"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={PAGE_TRANSITION}
          >
            <WorkoutScreen workout={activeWorkout} onBack={handleBackFromWorkout} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
