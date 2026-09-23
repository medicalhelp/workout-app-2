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

// The label and the title also share a layoutId (separate from the box's), so the text
// itself moves and resizes from the bar's 24px label position into the header's 18px title
// position instead of two texts fading past each other in place. Blur+opacity (rather than a
// flat crossfade) disguises that the actual words differ and can't morph glyph-by-glyph —
// mirrors SwiftUI's matchedGeometryEffect paired with a blurReplace-style content dissolve.
const TITLE_ENTER_TRANSITION = { duration: 0.18, delay: 0.14 }
const TITLE_EXIT_TRANSITION = { duration: 0.08 }

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
              {/* No group fade on the header itself — the title now animates independently
                  (layoutId + blur/opacity, timed against the box morph) and would otherwise
                  have its opacity compounded by a parent that's also fading. */}
              <div className="drawer__header">
                <motion.span
                  layoutId="sheet-title"
                  className="text-subheadline drawer__title"
                  // DEBUG (temporary): fade/blur commented out so both texts stay fully
                  // visible throughout the morph, to check the layoutId position/size overlap
                  // directly. Restore the opacity/filter animate+exit below once confirmed.
                  // initial={{ opacity: 0, filter: 'blur(6px)' }}
                  // animate={{
                  //   opacity: 1,
                  //   filter: 'blur(0px)',
                  //   transition: { opacity: TITLE_ENTER_TRANSITION, filter: TITLE_ENTER_TRANSITION },
                  // }}
                  // exit={{
                  //   opacity: 0,
                  //   filter: 'blur(6px)',
                  //   transition: { opacity: TITLE_EXIT_TRANSITION, filter: TITLE_EXIT_TRANSITION },
                  // }}
                  transition={{ layout: SHEET_TRANSITION }}
                >
                  Select workout
                </motion.span>
                {/* DEBUG (temporary): static red overlay at the label's natural 24px size,
                    centered on the same spot as the title above. No animation, no
                    AnimatePresence/unmount tied to it — stays on screen as long as the sheet
                    is open so both texts can be compared side by side without racing the
                    transition. Delete this span once the comparison is done. */}
                <span
                  className="text-headline"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'red',
                    pointerEvents: 'none',
                  }}
                >
                  Start Workout
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
            {/* Shares layoutId="sheet-title" with the header's title — position/size morph
                between the two, same "wait for the box, then reveal / vanish fast" pacing as
                before, just scoped to text instead of the whole box. */}
            <motion.span
              layoutId="sheet-title"
              style={{ color: 'red' }} // DEBUG (temporary): mark this one to tell it apart
              // DEBUG (temporary): fade/blur commented out, see matching note in the title
              // above. Restore once the position/size overlap is confirmed.
              // initial={{ opacity: 0, filter: 'blur(6px)' }}
              // animate={{
              //   opacity: 1,
              //   filter: 'blur(0px)',
              //   transition: { opacity: TITLE_ENTER_TRANSITION, filter: TITLE_ENTER_TRANSITION },
              // }}
              // exit={{
              //   opacity: 0,
              //   filter: 'blur(6px)',
              //   transition: { opacity: TITLE_EXIT_TRANSITION, filter: TITLE_EXIT_TRANSITION },
              // }}
              transition={{ layout: SHEET_TRANSITION }}
            >
              Start Workout
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
