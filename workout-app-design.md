# Workout Tracker — Design Spec

Source material: one Apple Notes entry (`resources/IMG_4935.PNG`, "Upper 3 Aug 2026"), interpreted through a 23-question interview with the user across two sessions. This doc captures the decisions made, the reasoning behind them, and the resulting product design. It's meant to be read once and then used as the reference for building v1.

---

## 1. What the Notes system already gets right — don't lose this

Before designing anything new, worth naming what's actually working today, so the app doesn't accidentally regress:

- **Speed.** Logging happens *between sets*, one-handed, mid-workout. Every extra tap is competing with a 60–120 second rest window.
- **One line per exercise, no forced structure.** Supersets, single exercises, drift in exercise selection week to week — freeform text absorbs all of it without friction.
- **Tolerates incompleteness.** The note ends mid-exercise (`Preacher Curl 12x8 /2/ 15x8 /2/`) with no penalty, no "unfinished" state, no cleanup required.
- **No forced taxonomy.** Exercise names are typed, not selected from someone else's database of 500 movements.

The design below tries to keep all four properties while fixing what free text structurally can't do: remember last time, run a timer, or surface progress.

---

## 2. Decisions log

Each entry: the question, what was decided, and why. Recommendations were mine; the user confirmed, corrected, or overrode each one — corrections are called out.

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Where/when do you log? | Mid-workout, one-handed, between sets — worst case, not reflective end-of-day entry | Sets the speed bar the whole app has to clear |
| 2 | Fixed routine or improvised? | **Loose rotation with drift** — same workout "types" recur, exercises inside them vary session to session | Rules out rigid templates; rules in "start from last session, fully editable" |
| 3 | What does `/2/` mean? | A **target** rest time per exercise, currently enforced by manually running the Clock app stopwatch alongside Notes | Rest timer becomes a core feature, not metadata — it's replacing a second app, not adding one |
| 4 | Superset rest — per exercise or per round? | **Per round.** Butterfly → Pull-down → rest → repeat. No rest between the two exercises within a round | Rest timer attaches to the *block* (superset as a unit), not to each exercise inside it |
| 5 | Does exercise naming stay consistent? | No — it varies slightly note to note. User proactively suggested a catalog with alternative names | Confirms need for a personal exercise catalog with alias resolution |
| 6 | Is the app meant to replicate the Notes shorthand? | **No — corrected mid-interview.** Notes is the *basis* (evidence of what data matters and how fast entry must be), not a spec to clone. The app should invent its own best input controls rather than parse `12x7,5 /2/` | Reframed the rest of the interview away from notation-mimicry toward UI/data design |
| 7 | Show last session's numbers while logging? | **Yes**, inline, per set (not just per exercise) | The single biggest thing Notes structurally can't do well — this is the app's actual reason to exist beyond "faster notepad" |
| 8 | When does the rest timer start, and how does it alert? | Auto-start on logging a set (no separate action); **haptic + sound**, both on by default | Removes the Notes+Clock app-switch entirely; loud gym / phone-not-in-hand means one alert channel isn't reliable |
| 9 | Which device? | **iPhone only for v1**, fully offline (gym connectivity is unreliable — visible in the source screenshot) | Watch is a real future idea but a distinct design problem; don't block v1 on it |
| 10 | Anything to reduce re-opening the app? | **Lock screen Live Activity / Dynamic Island** — rest countdown, next set preview, quick log action, no unlock required | User's own request, and a strong fit for iOS's native tools |
| 11 | Workout "type" — fixed list or freeform? | **Personal, growable list** (Upper, Lower, Abs, "Upper + calisthenics," etc.), same mechanic as the exercise catalog | Mirrors the exercise-catalog pattern; "start from last session of this type" needs a type field to key off |
| 12 | History view depth for v1? | **Chronological session list + inline last-time lookup.** Trend charts / PRs / volume pushed to v2 | Session list + last-time comparison alone already beats Notes; charts are valuable but not launch-blocking |
| 13 | Weight mode for bodyweight/calisthenics exercises? | Per-exercise mode: **weighted** (reps + weight) or **bodyweight** (reps only), with optional added-weight toggle for the rare weighted-vest case | Avoids forcing "0kg" entries or hiding a field everywhere |
| 14 | Input control — steppers, keypad, or wheel? | **Numeric keyboard**, not steppers (corrected the initial recommendation) | User's explicit preference; design input flow around fast typing, not incrementing |
| 15 | Duration-based exercises (planks, holds)? | New axis: exercises are **reps-based or duration-based**. Duration exercises get a **live start/stop timer**, not manual number entry | User added this mid-interview; live timer is more accurate than post-hoc estimation and replaces another manual habit |
| 16 | Ending a workout | **No explicit "Finish" action.** A session is "open" until you start a new one or walk away; incomplete sessions are stored exactly as far as they got | Matches the trailing-incomplete Preacher Curl entry in the source note; never nag the user for not closing out |
| 17 | Does the rest alert repeat or escalate if ignored? | **Fires once, distinctly, then goes quiet.** The Live Activity keeps counting visibly as the ambient reminder | A repeating buzz while mid-conversation or adjusting equipment trains the user to ignore it, like repeated phone notifications |
| 18 | Does the target rest time auto-adapt from logged history? | **No — manually set, fixed until deliberately changed.** Defaults to last logged value (or ~2 min) for a brand-new exercise | Auto-adapting targets would make "resting more/less than usual today" meaningless, since "usual" would keep moving |
| 19 | Which target wins when two exercises with different rest habits are grouped into a superset? | **The block uses the higher of the two exercises' individual targets** — not a separately configured number, not an average | User's correction — a simple, automatic reconciliation rule rather than manual entry per pairing |
| 20 | Does resting longer/shorter than target on a given day change the stored target? | **No — one-off, session-only.** Today's actual elapsed rest is recorded against that set as-is; the baseline target only changes via a deliberate edit to the exercise/block settings | Matches the original `/2/` → `/3/` behavior described early on — an in-the-moment note, not a redefinition of the baseline |
| 21 | Does the alert behave differently locked vs. foregrounded vs. backgrounded? | **No special-casing — haptic + sound fire the same way in every context.** The Live Activity is a visual aid for when glanced at, not a separate alert channel | Avoids edge-case logic for something the OS already handles consistently across lock/background/foreground states |
| 22 | Per-side or total weight for unilateral exercises (e.g. "Rowing Single")? | **Per side** (per arm) | Resolves the open question left after the interview recalibrated away from notation semantics |
| 23 | Local-only storage, or backup in v1? | **iCloud backup moves into v1** (backup/restore only — not full multi-device sync, which stays a v2 problem) | Notes already backs up via iCloud today; shipping a v1 that regresses on that would trade convenience for real data-loss risk |

---

## 3. Resolved contradictions and explicit assumptions

A few answers only make sense read together, or needed a decision the interview didn't reach verbatim. Flagging these clearly rather than burying them in the data model:

- **Rest timer counts up, not down.** Q3 described a *stopwatch* behavior — observing how long rest actually took, and noting it only when it deviated from the usual. Q8 described an auto-starting alert. Reconciled as: **the timer starts counting up from zero the instant a set is logged**, with the exercise's usual rest time marked as a target. Haptic + sound fire when the count crosses that target (so the "time to go back" cue still exists), but the timer keeps running — the value actually stored is the **elapsed time at the moment the next set is logged**, not the target. This preserves the "am I resting my usual amount, or longer/shorter today" signal, which a pure countdown would have silently deleted.
- **Rest belongs to the gap between sets, not to a set itself.** In the source note, `/2/` sits *between* two set entries. Modeled as: each set stores `restBeforeThisSet`, written retroactively when *that* set is logged (= time elapsed since the previous set in the same block was logged). The exercise/block also stores a `targetRestSeconds` default, editable per instance when a session runs long or short.
- **Rest reminder is a single, non-escalating nudge, not a nag.** Haptic + sound fire once when elapsed crosses the block's target, identically whether the phone is locked, backgrounded, or in front of the user. The Live Activity's live-counting display is the ambient/ongoing reminder; the alert is just the one-time "it's now" cue, not a repeated push to hurry up.
- **Targets are fixed and manual, not auto-learned.** An exercise's target rest defaults to the last logged value (or ~2 min if brand new) but only changes when the user deliberately edits it — never silently averaged from recent history. When exercises with different targets are grouped into a superset, the block adopts the **higher** of the two, automatically, with no separate manual entry per pairing. A day where actual rest ran long or short doesn't touch the stored target — that's just what got logged for that one set.
- **Auto-start applies to the last exercise in a block's round, not every exercise.** Q8 ("timer starts on log") and Q4 ("no rest between paired exercises in a superset") only both hold if auto-start fires after the *final* exercise in a round — e.g., after Pull-down, not after Butterfly. Firing it after every logged set would insert a rest timer inside the superset that the user explicitly said doesn't exist.
- **Prefill, not placeholder.** The numeric keyboard field is pre-filled with an actual editable value (not greyed-out placeholder text) and select-all-on-focus, so repeating the same weight — the dominant case in the source note (`12x7 / 12x7 / 12x7`) — takes zero or one keystroke rather than requiring the full number to be retyped every time. Prefill source, in priority order: (1) the same exercise's previous set logged *earlier in today's session*, (2) the same set position from the last session of this workout type.
- **Exercise catalog with aliases is v1, not a later nice-to-have.** It's load-bearing for "show last time's numbers" (Decision #7) — without alias resolution, naming drift (Decision #5) silently fragments an exercise's history and last-time lookups return nothing or the wrong thing.
- **Decimal input accepts comma.** Source note uses European decimal commas (`6,25`, `7,5`, `42,5`) in 0.25 kg increments. Input and history display should match this convention rather than forcing a period.

---

## 4. Data model

```
WorkoutType
  - name (user-created, e.g. "Upper", "Abs", "Upper + Calisthenics")

WorkoutSession
  - type: WorkoutType
  - date (auto-filled, editable)
  - blocks: [Block] (ordered)
  - no "completed" flag — a session is just data, however far it got

Block
  - one of:
      - single exercise
      - superset: 2+ exercises trained back-to-back as one round
  - targetRestSeconds: max(each constituent exercise's targetRestSeconds), editable per instance

Exercise (personal catalog)
  - canonicalName
  - aliases: [string]           // resolves naming drift to one history
  - weightMode: none | weighted | perSide | weighted+addedWeight
  - trackingMode: reps | duration
  - targetRestSeconds: fixed, manually set; defaults to last logged value (or ~2 min if new); never auto-adapted

Set
  - exercise: Exercise
  - reps OR durationSeconds (per trackingMode)
  - weight (per weightMode; kg, comma-decimal input)
  - restBeforeThisSet: actual seconds elapsed since previous set in this block was logged
  - loggedAt: timestamp
```

---

## 5. Core interaction flow

**Starting a workout**
1. Pick a `WorkoutType` from the personal list (or create a new one on the spot).
2. Date auto-fills to today.
3. App loads the most recent session of that type as a starting point — same exercises, same blocks/supersets, fully editable (add, remove, reorder) to absorb the week's drift.

**Logging a set**
1. For the current exercise, the last session's numbers for this exact set position are shown inline, right next to today's input.
2. Reps/weight fields are pre-filled with the best available guess (today's earlier set, else last session), select-all-on-focus, numeric keyboard.
3. Duration-based exercises (planks, holds) show a start/stop timer instead of a number field; stopping the timer logs the elapsed duration.
4. Tap to save the set.

**Rest**
1. Saving the *last* exercise in a block's round auto-starts the rest timer — counting up from zero, with the block's target rest marked (= the higher of its exercises' individual targets).
2. A Live Activity appears on the lock screen / Dynamic Island: live elapsed time, target, next set's exercise + prefilled numbers, and a quick "log set" action reachable without unlocking the phone. This running display is the ongoing/ambient reminder.
3. Haptic + sound fire **once** when elapsed crosses the target — same behavior whether the phone is locked, backgrounded, or in the user's hand — then go quiet; no repeat or escalation.
4. Logging the next set stops the countable rest and stores the actual elapsed value against that new set. Resting longer or shorter than target that day doesn't change the stored target — it's just what got logged for that set.

**Ending**
- No explicit "finish" step. The session simply stops accumulating sets when the user stops logging. It appears in history exactly as far as it got — including mid-exercise, matching how the source Notes entries already behave.

**Reviewing later**
- Chronological list of past sessions, filterable/groupable by `WorkoutType`.
- Tapping into a session shows the full block/set breakdown as logged.

---

## 6. Scope

**v1 (must-have — this is what has to beat Notes + Clock app)**
- Offline-first, iPhone only
- Personal, growable `WorkoutType` list and `Exercise` catalog with alias resolution
- Session started from "last session of this type," fully editable per instance
- Superset/block grouping
- Reps- and duration-based exercises; weighted and bodyweight modes
- Numeric-keyboard entry, prefilled, comma-decimal support
- Count-up rest timer, auto-start on last-exercise-in-round, single non-escalating haptic + sound alert at target, actual-elapsed stored per set
- Lock screen Live Activity / Dynamic Island for rest + next set + quick log
- Inline last-time comparison per set during logging
- Chronological session history
- iCloud backup/restore (single-device protection against data loss — not multi-device sync)

**v2 / later (deliberately deferred, not forgotten)**
- Apple Watch companion (glanceable timer, wrist logging)
- Trend charts, personal records, volume-over-time
- Proactive fuzzy "did you mean [existing exercise]?" duplicate detection (v1 ships with manual alias creation only)
- Multi-device iCloud sync (v1 covers backup/restore only, not real-time sync across devices)
- Data export

---

## 7. Open questions before build

None remaining — the two questions flagged after the first interview (per-side vs. total weight; backup strategy) were resolved in the follow-up session: unilateral exercises log **per-side** weight, and **iCloud backup** is in v1.
