import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { formatDate } from '../utils/date'
import './WorkoutCard.scss'

const DELETE_WIDTH = 88
const FLICK_VELOCITY = 500
const SNAP_TRANSITION = { type: 'spring', stiffness: 420, damping: 30 }

// The reveal is driven by a single motion value (dragX) rather than React state — both the
// draggable surface and the goo blob shapes below read it directly via `style`, so they stay
// in perfect lockstep at 60fps without a re-render on every pointer move.
export default function WorkoutCard({ workout, open, onOpen, onSwipeChange, onDelete }) {
  const dragX = useMotionValue(open ? -DELETE_WIDTH : 0)
  // Mirrors dragX exactly (delete shape's width == however far the surface has been dragged),
  // so the two goo shapes' edges always meet precisely at the same seam, whatever dragX is —
  // including past -DELETE_WIDTH during an elastic overdrag, where the delete shape stretches
  // wider than its resting size before springing back.
  const deleteShapeWidth = useTransform(dragX, (x) => Math.max(0, -x))
  // The label only fades in once there's enough revealed width to read it, rather than
  // appearing distorted/cramped the instant the sliver starts showing.
  const deleteLabelOpacity = useTransform(dragX, [-DELETE_WIDTH * 0.45, -DELETE_WIDTH * 0.9], [0, 1])
  const draggingRef = useRef(false)
  // Set the instant a real drag is recognized (in onDragStart, not onDragEnd) and checked by
  // the click handler below. Framer's `onTap` gesture is documented to auto-suppress after a
  // real drag, but in testing it fired anyway right after a 100px+ drag release, with a
  // *stale* `open` prop, wrongly calling `onOpen`. Tracking it ourselves in onDragEnd instead
  // didn't work either — logging showed the native `click` event actually fires *before*
  // Framer's onDragEnd callback (which is deferred), so by the time onDragEnd could set this,
  // the click had already read (and acted on) the old value. onDragStart is the one callback
  // guaranteed to run before any click from the same gesture, since Framer only invokes it
  // once real movement is recognized — well before pointerup/click.
  const wasRealDragRef = useRef(false)

  useEffect(() => {
    if (draggingRef.current) return
    animate(dragX, open ? -DELETE_WIDTH : 0, SNAP_TRANSITION)
  }, [open, dragX])

  function handleDragStart() {
    draggingRef.current = true
    wasRealDragRef.current = true
  }

  function handleDragEnd(_event, info) {
    draggingRef.current = false
    // A fast flick opens/closes it regardless of how far it's traveled yet — matching how iOS
    // swipe actions respond to velocity, not just distance.
    const fastOpen = info.velocity.x < -FLICK_VELOCITY
    const fastClose = info.velocity.x > FLICK_VELOCITY
    const shouldOpen = fastClose ? false : fastOpen || dragX.get() < -DELETE_WIDTH / 2
    animate(dragX, shouldOpen ? -DELETE_WIDTH : 0, SNAP_TRANSITION)
    onSwipeChange(shouldOpen)
  }

  function handleSurfaceClick() {
    if (wasRealDragRef.current) {
      wasRealDragRef.current = false
      return
    }
    if (open) {
      onSwipeChange(false)
    } else {
      onOpen(workout.id)
    }
  }

  return (
    <div className="workout-card">
      {/* Goo layer: two solid, same-colored shapes whose blurred, contrast-sharpened edges
          fuse into a liquid blob while they're close together and separate cleanly once fully
          open — the actual blending is the SVG filter (id="goo") defined once in Overview.jsx
          and shared by every card. Deliberately NOT clipped (no overflow:hidden) so the blur
          has room to bleed; the crisp text layer below is a separate, clipped layer so the
          blur never touches the text itself. */}
      <div className="workout-card__goo">
        <motion.div className="workout-card__delete-shape" style={{ width: deleteShapeWidth }} />
        <motion.div className="workout-card__surface-shape" style={{ x: dragX }} />
      </div>

      <div className="workout-card__clip">
        <button className="workout-card__delete" onClick={() => onDelete(workout.id)} aria-label="Delete workout">
          <motion.span className="workout-card__delete-label" style={{ opacity: deleteLabelOpacity }}>
            Delete
          </motion.span>
        </button>
        <motion.div
          className="workout-card__surface"
          style={{ x: dragX }}
          drag="x"
          dragConstraints={{ left: -DELETE_WIDTH, right: 0 }}
          dragElastic={0.35}
          dragTransition={{ bounceStiffness: 420, bounceDamping: 26 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleSurfaceClick}
        >
          <span className="text-subheadline workout-card__type">{workout.type}</span>
          <span className="text-body workout-card__date">{formatDate(workout.date)}</span>
        </motion.div>
      </div>
    </div>
  )
}
