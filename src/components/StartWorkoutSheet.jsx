import { useLayoutEffect, useRef, useState } from 'react'
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

const TEXT_PAIR_SIZE = { closed: 24, open: 18 }

// The dissolve: both texts crossfade+blur across the full span of the position/size move,
// starting and ending together with it — no separate exit/enter pacing, just the outgoing
// text going from fully shown to fully hidden while the incoming text does the exact reverse,
// in lockstep, the whole way through. Reuses SHEET_TRANSITION directly so this is guaranteed
// to start/end exactly when the box morph and the position/size move do. Blur (rather than a
// flat crossfade) sells the illusion of one text morphing into the other despite the words
// actually being completely different, glyph for glyph.

// A single always-mounted text pair ("Start Workout" / "Select workout") stacked in the same
// CSS grid cell so they share one center point by construction, instead of relying on two
// elements happening to be positioned the same. The wrapper's `top`/`fontSize` animate,
// driven directly off `open` — no layoutId on the text, since a layoutId handoff unmounts the
// exiting element once AnimatePresence's exit timing elapses, which doesn't allow a clean
// crossfade between two texts that stay in lockstep position/size-wise throughout.
//
// The vertical target is measured live off the real elements (the bar and the close button)
// via refs rather than hardcoded — a hardcoded pixel value taken from a desktop-browser
// measurement doesn't hold on a real device (safe-area insets, Safari's dynamic toolbar,
// system font metrics all shift it), and "centered with the icon button" is what's actually
// wanted for the open state, not wherever the old title text happened to sit.
export default function StartWorkoutSheet({ open, onOpen, onClose, onSelect }) {
  const barRef = useRef(null)
  const closeButtonRef = useRef(null)
  const [closedCenterY, setClosedCenterY] = useState(null)
  const [openCenterY, setOpenCenterY] = useState(null)

  useLayoutEffect(() => {
    if (!open && barRef.current) {
      const rect = barRef.current.getBoundingClientRect()
      setClosedCenterY(rect.top + rect.height / 2)
    }
  }, [open])

  useLayoutEffect(() => {
    if (open && closeButtonRef.current) {
      const rect = closeButtonRef.current.getBoundingClientRect()
      setOpenCenterY(rect.top + rect.height / 2)
    }
  }, [open])

  const centerY = open ? openCenterY : closedCenterY

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
                  ref={closeButtonRef}
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
            ref={barRef}
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

      {/* The synchronized text pair. Position and font-size move together as one unit between
          the bar's center and the close button's center (`top` + translate(-50%, -50%) rather
          than `bottom`, so the animated value always means "vertical center" regardless of how
          the text's own line-height changes between the two font sizes); each text's own
          opacity/blur crossfades independently, below.

          Gated on `centerY != null`: nothing has been measured yet for one frame on first
          mount (before the layout effect above runs), so this doesn't render at all until a
          real position is known — otherwise it'd mount at the browser's unset-style defaults
          (top: auto, 16px font) and visibly animate in from there, same class of flash as the
          earlier fontSize-from-16px bug this file used to have. */}
      {centerY != null && (
        <motion.div
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'grid',
            justifyItems: 'center',
            zIndex: 20,
            pointerEvents: 'none',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            color: 'white',
          }}
          // The very first mount always happens while closed (the drawer starts closed), so
          // `initial` matches that state exactly — no animation on the reveal itself, only on
          // later open/close changes to `animate`.
          initial={{ top: centerY, fontSize: TEXT_PAIR_SIZE.closed }}
          animate={{
            top: centerY,
            fontSize: open ? TEXT_PAIR_SIZE.open : TEXT_PAIR_SIZE.closed,
          }}
          transition={SHEET_TRANSITION}
        >
          <motion.span
            style={{ gridArea: '1 / 1' }}
            initial={{ opacity: 1, filter: 'blur(0px)' }}
            animate={{ opacity: open ? 0 : 1, filter: open ? 'blur(6px)' : 'blur(0px)' }}
            transition={SHEET_TRANSITION}
          >
            Start Workout
          </motion.span>
          <motion.span
            style={{ gridArea: '1 / 1' }}
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: open ? 1 : 0, filter: open ? 'blur(0px)' : 'blur(6px)' }}
            transition={SHEET_TRANSITION}
          >
            Select workout
          </motion.span>
        </motion.div>
      )}
    </MotionConfig>
  )
}
