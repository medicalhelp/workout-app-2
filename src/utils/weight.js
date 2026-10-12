// Comma-decimal display/input — matches this app's established convention for weight values
// (see workout-app-design.md's "kg, comma-decimal input" decision), distinct from the
// en-GB dates used elsewhere.
export function formatWeight(value) {
  const rounded = Math.round(value * 10) / 10
  return rounded.toString().replace('.', ',')
}

// Returns a finite positive number, or null if the input isn't a valid weight.
export function parseWeightInput(text) {
  const normalized = text.trim().replace(',', '.')
  if (normalized === '') return null
  const value = Number(normalized)
  return Number.isFinite(value) && value > 0 ? value : null
}
