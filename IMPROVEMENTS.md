# Improvements

Backlog of ideas for this app. Not committed to any order or timeline — just a place to
capture things worth doing later instead of losing them.

## MVP

- **Timer state-change animation.** Start/pause/reset currently swap state with no motion (icon
  swap, digits ticking) — worth a subtle transition on state change rather than an instant jump.
- **Dedicated "Select workout" page instead of the drawer.** Sketch: `resources/reference/
  select-workout-page-sketch.jpg`. Replaces the bottom-sheet approach (the drawer sheet morph,
  shipped) with a full page, navigated to the same way "start workout" is triggered today:
  - **Header** matching WorkoutScreen's detail-page pattern — a back chevron top-left, "Select
    workout" as the title, no separate close button.
  - **One row per workout type** (Upper, Lower, ...): a small minimalistic line-art icon on the
    left distinguishing the type (sketch shows a simple arc for Upper, two bars for Lower — not
    literal, just placeholders for "some small per-type illustration"), the label, and a chevron
    on the right signaling it navigates forward.
  - **A touch of color** — sketch suggests trying the Timer's orange as a background/accent on
    this screen, breaking from the app's otherwise black/white palette.
  - Note: this is a different direction from the drawer sheet morph (a page instead of a sheet)
    — if this ships, the morph work either gets dropped or repurposed as the page-entry
    transition instead.

## Near-term

- **"Last time" comparison while logging.** The original motivation for this app (see
  `workout-app-design.md`) was showing last session's numbers inline per set. The freeform
  text field can't do this on its own — would need at least light structure (or parsing) to
  compare against.
- **Editable workout type list.** "Upper"/"Lower" are hardcoded in `StartWorkoutSheet`. Letting
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
- 2026-09-21 — added dedicated "Select workout" page idea (replacing the drawer) to MVP
  section, with reference sketch in `resources/reference/`.
- 2026-09-21 — shipped page transition animation (Overview ↔ WorkoutScreen), swipe-to-delete
  polish (spring reveal + removal animation with list reflow), and icon button tap feedback
  (Timer controls, back button, drawer close); removed all three from the backlog. Drawer
  sheet morph was already shipped earlier but had been left listed — removed now too. Timer
  state-change animation is the one piece of the original micro-animations idea still open.
