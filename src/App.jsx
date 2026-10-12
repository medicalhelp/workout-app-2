import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Overview from './components/Overview'
import StartWorkoutSheet from './components/StartWorkoutSheet'
import WorkoutScreen from './components/WorkoutScreen'
import WeightScreen from './components/WeightScreen'
import { createWorkout, deleteWorkout, getWorkoutById, getWorkouts } from './data/workoutStore'
import { getLatestWeightEntry } from './data/weightStore'
import './App.scss'

// Matches the ease already used for the Start Workout sheet morph, for a consistent feel.
const PAGE_TRANSITION = { duration: 0.34, ease: [0.32, 0.72, 0, 1] }

export default function App() {
  const [workouts, setWorkouts] = useState(() => getWorkouts())
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [weightScreenOpen, setWeightScreenOpen] = useState(false)
  const [latestWeight, setLatestWeight] = useState(() => getLatestWeightEntry())

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

  function handleBackFromWeight() {
    setWeightScreenOpen(false)
    setLatestWeight(getLatestWeightEntry())
  }

  // Covers both WorkoutScreen and WeightScreen — the persistent sheet-title pair is
  // position:fixed and always mounted (needed to stay in lockstep for its own crossfade), so
  // it doesn't get covered by either page-slide overlay the normal DOM-order way. See the
  // earlier fix for WorkoutScreen; the same bleed-through would happen on WeightScreen too
  // without this.
  const anyScreenOpen = Boolean(activeWorkout) || weightScreenOpen

  return (
    <div className="app-stack">
      <Overview
        workouts={workouts}
        latestWeight={latestWeight}
        onOpenWorkout={handleOpenWorkout}
        onDeleteWorkout={handleDeleteWorkout}
        onOpenWeight={() => setWeightScreenOpen(true)}
      />
      <StartWorkoutSheet
        open={drawerOpen}
        hidden={anyScreenOpen}
        onOpen={handleStartWorkout}
        onClose={() => setDrawerOpen(false)}
        onSelect={handleSelectType}
      />
      {/* Overview stays mounted underneath at all times; WorkoutScreen/WeightScreen slide
          in/out on top of it as an overlay (Notes/iOS-style push), instead of a hard instant
          swap. */}
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
        {weightScreenOpen && (
          <motion.div
            key="weight"
            className="app-stack__overlay"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={PAGE_TRANSITION}
          >
            <WeightScreen onBack={handleBackFromWeight} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
