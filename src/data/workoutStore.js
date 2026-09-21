const STORAGE_KEY = 'workout-tracker-data'

export const DEFAULT_TIMER_STATE = { running: false, startedAt: null, elapsedMs: 0 }

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

export function deleteWorkout(id) {
  const data = readAll()
  data.workouts = data.workouts.filter((w) => w.id !== id)
  writeAll(data)
}

// Patches just the timer field, without bumping updatedAt — starting/pausing the
// rest timer shouldn't reorder the Overview list the way editing content does.
// `workout` is the caller's current copy, used to seed the row if this is a brand-new
// workout that hasn't been autosaved yet (e.g. the timer is touched before any typing).
export function updateWorkoutTimer(workout, timer) {
  const data = readAll()
  const index = data.workouts.findIndex((w) => w.id === workout.id)
  if (index === -1) {
    data.workouts.push({ ...workout, timer, updatedAt: Date.now() })
  } else {
    data.workouts[index] = { ...data.workouts[index], timer }
  }
  writeAll(data)
}

export function createWorkout(type) {
  const previous = getMostRecentWorkoutByType(type)
  return {
    id: crypto.randomUUID(),
    type,
    date: new Date().toISOString(),
    content: previous ? previous.content : '',
    updatedAt: Date.now(),
    timer: DEFAULT_TIMER_STATE,
  }
}
