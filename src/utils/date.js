export function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Short relative form for the Overview weight badge only ("today", "3d", "2w") — the
// dedicated Weight screen always shows full dates instead (formatDate), per explicit
// decision: relative dates read fine as a glance-and-forget freshness indicator, but not
// when actually reviewing history.
export function formatRelativeShort(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  if (days < 1) return 'today'
  if (days < 7) return `${days}d`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w`
  const months = Math.floor(days / 30)
  return `${months}mo`
}
