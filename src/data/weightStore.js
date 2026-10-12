const STORAGE_KEY = 'weight-tracker-data'

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { entries: [] }
    const parsed = JSON.parse(raw)
    return { entries: Array.isArray(parsed.entries) ? parsed.entries : [] }
  } catch {
    return { entries: [] }
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getWeightEntries() {
  return readAll().entries.slice().sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getLatestWeightEntry() {
  return getWeightEntries()[0] ?? null
}

export function saveWeightEntry(value) {
  const data = readAll()
  const entry = {
    id: crypto.randomUUID(),
    value,
    date: new Date().toISOString(),
    updatedAt: Date.now(),
  }
  data.entries.push(entry)
  writeAll(data)
  return entry
}
