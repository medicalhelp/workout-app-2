const STORAGE_KEY = 'workout-tracker-data'

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { workouts: [] }
    const parsed = JSON.parse(raw)
    return { workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [] }
  } catch {
    return { workouts: [] }
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getWorkouts() {
  return readAll().workouts.slice().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function getWorkoutById(id) {
  return readAll().workouts.find((w) => w.id === id) ?? null
}

export function getMostRecentWorkoutByType(type) {
  return getWorkouts().find((w) => w.type === type) ?? null
}

export function saveWorkout(workout) {
  const data = readAll()
  const index = data.workouts.findIndex((w) => w.id === workout.id)
  const next = { ...workout, updatedAt: Date.now() }
  if (index === -1) {
    data.workouts.push(next)
  } else {
    data.workouts[index] = next
  }
  writeAll(data)
  return next
}

export function createWorkout(type) {
  const previous = getMostRecentWorkoutByType(type)
  return {
    id: crypto.randomUUID(),
    type,
    date: new Date().toISOString(),
    content: previous ? previous.content : '',
    updatedAt: Date.now(),
  }
}
