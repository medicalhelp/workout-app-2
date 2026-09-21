# workout-app-2

A workout tracker MVP: an overview of past workouts, a freeform Notes-style entry screen per
workout (type + date header, borderless text field), and a built-in stopwatch so you don't have
to switch to the Clock app mid-session. Data is stored locally in the browser (`localStorage`) —
no backend.

See `workout-app-design.md` for the fuller (deferred) v1 design; this app intentionally
implements a smaller slice of it — see `CLAUDE.md` before treating that doc as the current spec.

## Docs

- `CLAUDE.md` — architecture, deploy workflow/gotchas, and Figma design-source details for
  anyone (human or AI) picking this project up.
- `IMPROVEMENTS.md` — backlog of deferred/future ideas.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Deploys are manual (no GitHub auto-deploy is wired up — see `CLAUDE.md` for why):

```bash
vercel --prod
```

Live at `https://workout-app-2-khaki.vercel.app`.
