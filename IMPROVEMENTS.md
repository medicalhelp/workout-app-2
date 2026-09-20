# Improvements

Backlog of ideas for this app. Not committed to any order or timeline — just a place to
capture things worth doing later instead of losing them.

## MVP

- **Page transition animation.** Overview → WorkoutScreen (and back) currently switches
  instantly via App.jsx's view-swap state. Notes animates this as a slide (push in from the
  right on open, slide back out on close) — worth adding since it's cheap (CSS transition on
  mount/unmount) and makes the navigation feel native rather than a hard cut.

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
