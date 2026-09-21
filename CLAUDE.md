# CLAUDE.md

Context for AI agents working in this repo. See `README.md` for user-facing run/build/deploy
instructions — this file covers things you'd otherwise have to rediscover from the code or chat
history.

## What this actually is

A deliberately small MVP: an overview of past workouts, a bottom sheet to pick a workout type,
and a Notes-style freeform text screen per workout with a built-in stopwatch. No structured
exercise data, no backend — everything lives in one `localStorage` JSON blob.

**`workout-app-design.md` is NOT the spec for what's built here.** It's the original, much
fuller v1 concept (structured exercise catalog, per-set rest timers, iCloud sync, etc.) from an
earlier design pass. The team deliberately scoped down to this MVP instead of building that. Treat
`workout-app-design.md` as historical/aspirational context, not a checklist — don't "complete" it
unless explicitly asked to.

`IMPROVEMENTS.md` is the actual backlog for this MVP. Check it before assuming a feature is
missing by accident vs. deferred on purpose.

## Architecture

- React (plain JavaScript, no TypeScript) + Vite. No router — `App.jsx` swaps between the
  Overview and WorkoutScreen views via component state (`activeWorkout`).
- All data persistence is in `src/data/workoutStore.js`: a single `localStorage` key
  (`workout-tracker-data`) holding `{ workouts: [...] }`. Each workout is
  `{ id, type, date, content, updatedAt }` — `content` is the raw freeform text, not parsed.
- Starting a new workout of a given type (`createWorkout`) prefills `content` from the most
  recently updated workout of that same type, so you edit forward from last time.
- Autosave: `WorkoutScreen` persists every 15s while dirty, and immediately on back navigation
  (the sticky back button). Nothing is saved on every keystroke.
- SCSS design system lives in `src/styles/`: `_colors.scss`, `_typography.scss`, `_layout.scss`
  (shared cross-component dimensions like `$bottom-bar-height`). Components each own a scoped
  `.scss` file (e.g. `Timer.jsx` + `Timer.scss`).

### Known-deliberate quirk: `WorkoutScreen__content { flex: 1 0 auto }`

Not `flex: 1` (which is `flex-basis: 0%`). The textarea's height is driven by a JS effect that
sets `el.style.height` to match `scrollHeight` (auto-grow). With `flex-basis: 0%`, the flex
algorithm ignores that JS-set height and the textarea scrolls *internally* instead of the page
scrolling — which silently breaks the sticky back button's scroll-occlusion effect. `flex: 1 0
auto` lets it still fill available space for short logs but never shrinks below its real content
height. If you touch this file, keep that in mind before "simplifying" it back to `flex: 1`.

## Design source of truth

Colors, typography, and spacing were pulled **exactly** from Figma (not approximated) via the
Figma MCP design-to-code workflow — see commit "Match exact Figma design tokens across all three
screens" for the full mapping.

- File: `https://www.figma.com/design/KiuILdT7PgHMUNifM8xdkb/Workout-App`
- Typography reference frame: node `193:1775` ("Typography styles") — Headline H1 (24/700),
  Headline H2 (18/700), Text (16/400), Timer (42/400).
- Screens implemented: Start/Overview (`193:1731`), Select workout sheet (`193:1736`), Workout
  Log (`193:1747`).

If asked to make further visual changes and a Figma link is available, prefer re-fetching exact
values via `get_design_context` over eyeballing a screenshot — this codebase's styling is meant
to track Figma literally, not approximately.

## Deploy workflow

This repo's GitHub remote (`medicalhelp/workout-app-2`) and the local machine's default `gh`
account (`ingka-johannes-zimmer`) are different accounts. Pushing will 403 unless you switch
first:

```bash
gh auth switch --hostname github.com --user medicalhelp
git push origin main
```

Vercel is **not** connected to GitHub for auto-deploy-on-push (cross-account issue, same as
above) — every deploy is manual:

```bash
vercel --prod
```

The Vercel project is `jozi96-gmailcoms-projects/workout-app-2`, live at
`https://workout-app-2-khaki.vercel.app`. `.vercel/` is gitignored, so a fresh clone needs
`vercel link` before deploying — make sure it links to the *existing* project above rather than
creating a new one.

`git push` and `vercel --prod` are both auto-mode-classifier-blocked for direct agent execution
in this environment; ask the user to run `git push` themselves if you hit that, then proceed with
the Vercel deploy yourself.
