# workout-app-2

A workout tracker MVP: an overview of past workouts, a freeform Notes-style entry screen per
workout (type + date header, borderless text field), and a built-in stopwatch so you don't have
to switch to the Clock app mid-session. Data is stored locally in the browser (`localStorage`) —
no backend.

See `workout-app-design.md` for the fuller (deferred) v1 design; this app intentionally
implements a smaller slice of it.

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

Connect this repository to Vercel (Vite is auto-detected) and deploy — no extra configuration
needed, since the app has a single route and no server-side code.
