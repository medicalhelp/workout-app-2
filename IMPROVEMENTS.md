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
- **Duplicate/repeat a workout directly from a card.** A long-press or swipe action on an
  Overview card to clone that exact past session as today's new entry. Faster than Start
  Workout → pick type → wait for the "last session of this type" prefill when you already know
  exactly which past log you want to repeat — and it's the only way to start from something
  other than the most recent session of a type.
- **Lightweight bodyweight/measurement log.** A separate, minimal freeform log (date + a
  number/note) for tracking bodyweight over time — same "don't force structure" spirit as the
  workout log, but a distinct concern from workout content. Needs its own small data store,
  entry point, and a simple list view; doesn't belong inside `content`.
- **Exercise autosuggest while typing.** Instead of purely free text, surface a select-from-list
  / autocomplete for exercise names as you type in the log textarea, to cut down on repetitive
  retyping ("Preacher Curl", "Bench Press", etc. every session). Source suggestions from the
  user's *own* previously-typed exercise names (parsed out of past `content`), not a fixed
  catalog — keeps the "no forced taxonomy" principle from `workout-app-design.md`'s decisions
  #5/#6 intact, it's just faster typing, not a structured exercise database. The tricky part is
  UI: a real autocomplete dropdown positioned near the cursor inside a plain `<textarea>` is
  more involved than autocomplete on a normal `<input>`.
- **Swipe down to dismiss the keyboard.** From testing: while the log textarea is focused,
  swiping down on the content area should dismiss the keyboard (blur the field) without
  navigating away — matching Apple Notes. Right now there's no such gesture; the only way to
  drop the keyboard is tapping elsewhere or an OS-level gesture.
- **Rethink the Timer's presentation when the keyboard is open.** From testing, exploratory —
  these are open questions, not a decided design: the Timer is currently a fixed bar docked to
  the *bottom* of the screen, which the on-screen keyboard covers or pushes away — right when
  you're typing, which is exactly when the rest timer matters most. Idea: a compact "pill"
  version of the timer, visually similar to the Dynamic Island (rounded pill, dark background)
  — but an in-app UI element styled that way, not the real OS Dynamic Island surface (that's the
  separate native Live Activity idea in Later, below, which needs ActivityKit; this one is a
  normal Framer Motion component, buildable in the current web app). Questions still open:
  - Where does the pill sit — pinned above the keyboard while it's up, or at the top of the
    screen generally?
  - Does it morph/transition between the pill (compact) form and the current full bottom-bar
    form depending on keyboard visibility, similar to the drawer sheet morph?
  - Does tapping the pill expand it to a full view (the current bottom-bar controls), or does it
    stay compact-only while the keyboard's up?
- **Persistent "active workout" indicator on Overview** (Google Maps-style). Google Maps keeps a
  compact "resume navigation" bar visible even after you've backed out of the live turn-by-turn
  view; idea is a similar affordance on Overview so you can jump back into an in-progress
  workout without hunting for its card. Design converged through discussion:
  - **"Active" = the most recently *created* workout**, specifically — not just recently edited
    (which would also catch someone reopening old history to fix a typo) and not inferred from
    Timer state. Simple and deterministic: set the moment `createWorkout` fires, via the Start
    Workout flow only.
  - **Expires 2 hours after creation** (`date`), rather than staying "active" indefinitely.
    Workouts typically run 1–1.5h, so 2h gives buffer for a longer session without the indicator
    lingering for a workout logged this morning and irrelevant by evening. No dismiss (X) button
    needed — expiry handles it, and there's never more than one active workout at a time (a new
    one naturally supersedes whichever was showing).
- **Undo on delete.** Swipe-to-delete is now spring-loaded and instant (and there's no backup
  unless you've manually exported) — a mis-swipe permanently loses a log. A brief "Deleted —
  Undo" snackbar after delete, matching the removal animation's timing, closes that risk with
  little added complexity.
- **Edit a workout's type after creation.** `type` is fixed at `createWorkout` today — no way to
  fix a mis-tapped "Upper" vs "Lower" without deleting and recreating (and manually copying the
  content over to not lose it). A simple type-switcher control in WorkoutScreen closes the gap.
- **Streak/frequency indicator on Overview.** Something lightweight like "3-day streak" or "last
  workout: 2 days ago" — a motivational nudge derived from existing `date` fields, no new data
  or charts needed. Distinct from (and much smaller than) the fuller "trend charts" idea below
  in Later.

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
- **Exercise bank with aliases, and a per-exercise progression view.** Evolves the "Exercise
  autosuggest" MVP idea above into something bigger: a persistent bank of canonical exercises,
  each holding known alias spellings (`Preacher Curl` / `preacher Curl` / `Preacher biceps
  curl` — all the same exercise, typed differently over time), so history can eventually be
  grouped and browsed per exercise ("show me every Preacher Curl session"). This directly picks
  back up `workout-app-design.md` decision #5, which raised exactly this ("user proactively
  suggested a catalog with alias resolution") before the project deliberately scoped it out of
  v1 — revisit once the lighter autosuggest MVP has been lived with for a while.
  - **Four interaction modes, all coexisting, none forced:**
    1. Write it yourself, fully freeform — exactly like today, zero interaction with the bank.
    2. Start typing and it autosuggests (the MVP idea above, now sourced from the bank's
       canonical names + aliases instead of raw parsed history).
    3. Tap a button to open the bank as a picker and select an exercise, inserting it at the
       cursor.
    4. Tap an exercise name to see its data/progression.
  - **Picking a suggestion (mode 2 or 3) is what links that line to the canonical exercise** —
    the same interaction that reduces typing also builds the alias graph, no separate "manage
    aliases" screen needed. Typing by hand without picking (mode 1) just stays plain unlinked
    text, exactly as it does today — nothing is ever forced or retroactively required, and nothing
    about existing `content` changes shape; the bank is a side index, not a replacement.
  - **Mode 4 — recommendation:** don't try to make words *inside* the freeform textarea
    individually tappable. A plain `<textarea>` can't have clickable spans without replacing it
    with a much heavier rich-text/contenteditable component, which risks the auto-grow,
    autosave, and sticky-back-button behavior already carefully tuned (see the `flex: 1 0 auto`
    note in CLAUDE.md) for comparatively little gain. Instead: a small "info" button in the
    toolbar area above the keyboard — the same real estate the Timer-pill idea above wants, so
    the two will need to be reconciled if both ship — showing data for whichever exercise the
    *cursor* is currently sitting on (same line-detection heuristic as the autosuggest parsing).
    A separate, dedicated "Exercises" list screen (browseable on its own, independent of any
    specific day's log) is probably the more natural *primary* way to look up a full history;
    the info button while typing is a contextual shortcut on top of that, not a replacement.
  - **Parsing exercise names out of freeform lines** (needed for modes 2 and 4's cursor-based
    lookup) has no reliable structure to lean on — the working heuristic discussed is "text
    before the first digit" (`Bench Press 5x5 @80kg` → `Bench Press`), which handles the common
    case but isn't bulletproof (an exercise name containing a number, e.g. "Figure-8 Curl",
    would misfire). Fine to ship as an imperfect heuristic — a parsing miss just means a
    suggestion doesn't show up that session, not corrupted data, since `content` itself is
    untouched either way.
  - **Progression charts** (weight/reps over time, not just "list every session of this
    exercise") is a further step beyond grouping by name — still needs pulling numbers out of
    the freeform text for linked lines. Connects to "Trend charts / PRs / volume-over-time" in
    Later, below.

## Later

- Trend charts / PRs / volume-over-time.
- **Native rest-timer Live Activity on the Lock Screen/Dynamic Island** (ActivityKit) — the
  actual API for a live-ticking timer there; a static WidgetKit timeline widget isn't the right
  tool. Not possible from the web app itself (no web API reaches ActivityKit/WidgetKit) — needs
  a genuinely separate Swift/Xcode codebase, either a full native rewrite or a thin native
  wrapper (e.g. Capacitor, or a bare `WKWebView` shell) around the existing web app plus a
  native Live Activity extension, bridging timer start/stop from the web JS to native code.
  **App Store distribution is not required** for personal use — Xcode can install straight onto
  your own iPhone via your Apple ID with no review/listing. A free Apple ID re-signs every 7
  days (reinstall from Xcode weekly); the $99/year Apple Developer Program gets ~1-year
  certificates and TestFlight (wireless reinstall, no cable). Either way this can't be built or
  tested in this web-only dev environment (no macOS/Xcode here) — someone would need to open
  and build it on an actual Mac.
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
- 2026-09-21 — shipped PWA installability (web manifest, iOS "Add to Home Screen" meta tags,
  192/512px icons generated from the existing favicon). Added three new MVP ideas: duplicate/
  repeat a workout from a card, a lightweight bodyweight log, and exercise autosuggest while
  typing.
- 2026-09-21 — corrected the Later section's Lock Screen widget entry: App Store distribution
  isn't actually required for personal use (Xcode can sideload straight to your own iPhone) —
  it still needs a native Swift/Xcode codebase and ActivityKit specifically, just not a public
  release.
- 2026-09-22 — added two ideas from testing, both MVP: swipe-down-to-dismiss-keyboard
  (Notes-style), and rethinking the Timer's presentation as a Dynamic-Island-styled pill when
  the keyboard covers the current bottom bar (still exploratory — open questions noted inline).
- 2026-09-22 — added a persistent "active workout" indicator idea (Google Maps-style) to MVP —
  exploratory, with open questions on what counts as "active" (no start/finish concept exists
  today) and whether it's dismissible.
- 2026-09-22 — converged the active-workout-indicator design through discussion: "active" means
  most recently *created* (not just edited/reopened), expires 2h after creation, no dismiss
  button needed.
- 2026-09-22 — added three new MVP ideas: undo on delete, editing a workout's type after
  creation, and a lightweight streak/frequency indicator on Overview.
- 2026-09-22 — added exercise bank + aliases + per-exercise progression view to Near-term,
  building on the MVP autosuggest idea: four coexisting interaction modes (freeform, autosuggest,
  select-from-list, tap-to-see-data), picking a suggestion is what links a line to a canonical
  exercise, and an info button above the keyboard (not inline-tappable text) for viewing an
  exercise's data while typing.
