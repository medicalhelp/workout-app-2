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
const TAP_TRANSITION = { type: 'spring', stiffness: 700, damping: 30 }

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
                <motion.button
                  className="drawer__close"
                  onClick={onClose}
                  whileTap={{ scale: 0.88 }}
                  transition={{ scale: TAP_TRANSITION }}
                  aria-label="Close"
                >
                  <CloseIcon />
                </motion.button>
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
          // No opacity animation on the box itself — it must stay fully opaque throughout,
          // matching .drawer's own box (which has none either). The shared layoutId hands the
          // box off to whichever element just mounted almost instantly, so if this box's
          // opacity were delayed/faded like the label used to be, the box briefly goes
          // invisible right as it becomes the only thing occupying that screen region — the
          // page's white background shows through underneath. Confirmed with a pixel sample
          // mid-close: the box read as (253,253,253), i.e. pure white, not a color mismatch.
          <motion.button
            key="bar"
            layoutId="start-sheet"
            className="text-headline start-bar"
            onClick={onOpen}
            transition={{ layout: SHEET_TRANSITION }}
          >
            {/* Only the label fades — same "wait for the box, then reveal on open / vanish
                fast on close" pacing as before, just scoped to text instead of the whole box. */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15, delay: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
            >
              Start Workout
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
