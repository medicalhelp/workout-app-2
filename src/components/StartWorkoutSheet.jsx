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

// TEMP DEBUG: a single always-mounted, always-opaque text pair ("Start Workout" red /
// "Select workout" white) stacked in the same CSS grid cell so they share one center point
// by construction, instead of relying on two elements happening to be positioned the same.
// Only this wrapper's `bottom`/`fontSize` animate, driven directly off `open` — no layoutId
// on the text. (A layoutId handoff unmounts the exiting element once AnimatePresence's exit
// timing elapses, which is why the previous approach couldn't keep both texts visible at
// once — see git history on this file.) Coordinates were measured from the real
// .start-bar / .drawer__title boxes at a 390x844 viewport with no safe-area inset; this will
// need to become measurement-based (refs + getBoundingClientRect) if the sheet's content
// ever becomes dynamic instead of the current fixed Upper/Lower options.
const TEXT_PAIR_BOTTOM = { closed: 44, open: 252 }
const TEXT_PAIR_SIZE = { closed: 24, open: 18 }

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
              <div className="drawer__header">
                {/* Kept mounted (so the header retains its natural height) but invisible —
                    the always-on text pair below renders the visible "Select workout" text now. */}
                <span className="text-subheadline drawer__title" style={{ opacity: 0 }}>
                  Select workout
                </span>
                <motion.button
                  className="drawer__close"
                  onClick={onClose}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15, delay: 0.12 } }}
                  exit={{ opacity: 0, transition: { duration: 0.08 } }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ scale: TAP_TRANSITION }}
                  aria-label="Close"
                >
                  <CloseIcon />
                </motion.button>
              </div>
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
            {/* Kept mounted (for .start-bar's own layout) but invisible — see note on
                drawer__title above. */}
            <span style={{ opacity: 0 }}>Start Workout</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* TEMP DEBUG: the always-visible synchronized text pair. Both texts stay fully opaque
          and perfectly overlapping (same grid cell) at all times; this wrapper's position and
          font-size are the only things that animate, moving/resizing both texts together as
          one unit between the bar's spot/size and the title's spot/size. */}
      <motion.div
        style={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'grid',
          justifyItems: 'center',
          zIndex: 20,
          pointerEvents: 'none',
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}
        // Explicit `initial` (rather than leaving it to default) so mount reads from these
        // values instead of the browser's unset-fontSize default (16px) — without it, the
        // very first render briefly animates in from 16px, an unwanted flash on page load.
        initial={{ bottom: TEXT_PAIR_BOTTOM.closed, fontSize: TEXT_PAIR_SIZE.closed }}
        animate={{
          bottom: open ? TEXT_PAIR_BOTTOM.open : TEXT_PAIR_BOTTOM.closed,
          fontSize: open ? TEXT_PAIR_SIZE.open : TEXT_PAIR_SIZE.closed,
        }}
        transition={SHEET_TRANSITION}
      >
        <span style={{ gridArea: '1 / 1', color: 'red' }}>Start Workout</span>
        <span style={{ gridArea: '1 / 1', color: 'white' }}>Select workout</span>
      </motion.div>
    </MotionConfig>
  )
}
