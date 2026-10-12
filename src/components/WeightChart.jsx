import { useLayoutEffect, useRef, useState } from 'react'
import './WeightChart.scss'

const PADDING_Y = 12

// Catmull-Rom -> cubic Bezier conversion, giving a smooth curve that actually passes through
// every point (not an approximation) — matches the soft hand-drawn curve from the reference
// sketch rather than a sharp point-to-point polyline.
function buildSmoothPath(points) {
  const d = [`M ${points[0].x} ${points[0].y}`]
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`)
  }
  return d.join(' ')
}

// `entries` oldest -> newest, each { date, value }. The exact numbers are always available in
// the list below this chart — this is a glanceable trend, not the only place the data lives,
// so it's fine for it to carry no further interaction of its own.
export default function WeightChart({ entries }) {
  const containerRef = useRef(null)
  // The SVG's viewBox is set to the container's real measured pixel size (rather than an
  // arbitrary fixed box) so the line's stroke-width and the end-dot's radius are correct,
  // actual screen pixels — with preserveAspectRatio="none" stretching an arbitrary viewBox to
  // fit, a fixed-unit radius would render at the wrong physical size on different devices.
  const [size, setSize] = useState(null)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const values = entries.map((e) => e.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points =
    size &&
    entries.map((entry, i) => {
      const x = entries.length === 1 ? size.width / 2 : (i / (entries.length - 1)) * size.width
      const t = (entry.value - min) / range
      const y = size.height - PADDING_Y - t * (size.height - PADDING_Y * 2)
      return { x, y }
    })

  const last = points?.[points.length - 1]

  return (
    <div className="weight-chart" ref={containerRef}>
      {size && (
        <svg
          className="weight-chart__svg"
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {points.length > 1 && <path className="weight-chart__line" d={buildSmoothPath(points)} />}
          <circle className="weight-chart__dot-ring" cx={last.x} cy={last.y} r="6" />
          <circle className="weight-chart__dot" cx={last.x} cy={last.y} r="4" />
        </svg>
      )}
    </div>
  )
}
