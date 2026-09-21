import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import './StartWorkoutSheet.scss'

const WORKOUT_TYPES = ['Upper', 'Lower']

// Exact asset from Figma (node 193:1743, Group 2134355740).
function CloseIcon() {
  return (
    <svg viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="16" fill="white" fillOpacity="0.1" />
      <path
        d="M10.4 24L9 22.6L14.6 17L9 11.4L10.4 10L16 15.6L21.6 10L23 11.4L17.4 17L23 22.6L21.6 24L16 18.4L10.4 24Z"
        fill="white"
        fillOpacity="0.45"
      />
    </svg>
  )
}

// A deterministic tween (not a spring) so its duration is known exactly — AnimatePresence
// must wait at least this long before unmounting the exiting branch, or the shape morph
// gets cut off mid-animation (that abrupt cut is what reads as a flicker/jump on close).
const SHEET_TRANSITION = { duration: 0.32, ease: [0.32, 0.72, 0, 1] }

// The "Start Workout" bar and the type-picker sheet share layoutId="start-sheet", so
// Framer Motion FLIP-animates one shape morphing into the other instead of treating them
// as an independent slide-up. Content (label vs. header+options) is staggered to fade in
// only once the shape has mostly resized, so it doesn't visibly stretch mid-morph.
export default function StartWorkoutSheet({ open, onOpen, onClose, onSelect }) {
  return (
    <MotionConfig transition={SHEET_TRANSITION}>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="overlay"
            className="drawer-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId="start-sheet"
              className="drawer"
              onClick={(e) => e.stopPropagation()}
              transition={SHEET_TRANSITION}
            >
              <motion.div
                className="drawer__header"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.15, delay: 0.12 } }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
              >
                <span className="text-subheadline drawer__title">Select workout</span>
                <button className="drawer__close" onClick={onClose} aria-label="Close">
                  <CloseIcon />
                </button>
              </motion.div>
              <motion.div
                className="drawer__options"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.15, delay: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.08 } }}
              >
                {WORKOUT_TYPES.map((type) => (
                  <button key={type} className="drawer__option text-headline" onClick={() => onSelect(type)}>
                    {type}
                  </button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            key="bar"
            layoutId="start-sheet"
            className="text-headline start-bar"
            onClick={onOpen}
            initial={{ opacity: 0 }}
            // The box's shape handoff happens almost immediately on both open and close
            // (layoutId ownership passes to whichever element just mounted), so the label
            // must match pace: a delayed reveal while opening (wait for the box to shrink
            // to bar size), but an immediate fade on close, or it lingers over the sheet
            // that's already taken its place.
            animate={{ opacity: 1, transition: { opacity: { duration: 0.15, delay: 0.15 } } }}
            exit={{ opacity: 0, transition: { opacity: { duration: 0.08 } } }}
            transition={{ layout: SHEET_TRANSITION }}
          >
            Start Workout
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
