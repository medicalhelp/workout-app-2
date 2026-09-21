# Improvements

Backlog of ideas for this app. Not committed to any order or timeline — just a place to
capture things worth doing later instead of losing them.

## MVP

- **Page transition animation.** Overview → WorkoutScreen (and back) currently switches
  instantly via App.jsx's view-swap state. Notes animates this as a slide (push in from the
  right on open, slide back out on close) — worth adding since it's cheap (CSS transition on
  mount/unmount) and makes the navigation feel native rather than a hard cut.
- **General micro-animations.** A few more spots feel like hard cuts today and would benefit
  from the same native-feeling polish as the page transition above:
  - **Timer.** Start/pause/reset currently swap state with no motion (icon swap, digits
    ticking) — worth a subtle transition on state change rather than an instant jump.
  - **Icon button tap feedback.** Buttons (Timer controls, back button, etc.) have no pressed
    state — a quick spring scale-down on tap would make taps feel acknowledged.
  - **Drawer sheet morph.** TypePickerDrawer currently just slides up as its own independent
    sheet. Morphing it out of the "start workout" button (shared-element-style, the button
    growing into the sheet) rather than sliding in from off-screen would tie the interaction
    to its origin the way iOS sheets often do.

## Near-term

- **"Last time" comparison while logging.** The original motivation for this app (see
  `workout-app-design.md`) was showing last session's numbers inline per set. The freeform
  text field can't do this on its own — would need at least light structure (or parsing) to
  compare against.
- **Editable workout type list.** "Upper"/"Lower" are hardcoded in `TypePickerDrawer`. Letting
  the list grow (like the exercise catalog idea in the design doc) removes that ceiling.
- **Rest timer tied to sets.** Right now the Timer is a manual stopwatch. Auto-starting it on
  a new line/set would remove the last bit of manual fiddling.
- **Backup/export.** Data lives only in `localStorage` on one device/browser. Even a simple
  "export JSON" button is cheap insurance against a cleared cache wiping everything.
- **Delete button in the detail view.** Swipe-to-delete only exists on Overview cards today —
  deleting a workout while it's open (WorkoutScreen) currently requires going back first.

## Later

- Trend charts / PRs / volume-over-time.
- Native iOS app with a real Lock Screen widget (WidgetKit/ActivityKit) — not possible from a
  web app; would need a native wrapper (e.g. Capacitor + a Swift widget extension) and App
  Store distribution.
- Multi-device sync (iCloud or similar) — `localStorage` is single-device only.

## Log

- 2026-09-20 — file created.
- 2026-09-21 — added general micro-animations idea (timer, icon button tap spring, drawer
  sheet morph) to MVP section.
