# PLAN.md

## What this is

A lightweight schedule viewer for the Premier League, for football fans who want a quick, no-friction way to check upcoming fixtures without opening a bulky sports app. The core interaction is: pick your favourite team(s) once, then land on a filtered view of just their matches (date, opponent, home/away, kickoff time) every time you open it. It should work equally well as a phone home-screen shortcut or a desktop browser tab — no login, no ads, no noise.

## Core features (first prototype)

1. **Full fixture list** — browsable list of Premier League matches (date, time, home team, away team), grouped by matchweek/date.
2. **Team picker** — a grid of all 20 PL teams (crest/colour + name) the user can tap to mark as favourites.
3. **Favourites filter** — a toggle ("My Teams" vs "All Fixtures") that filters the schedule down to matches involving any favourited team.
4. **Persistence** — favourite selections are saved in `localStorage` so they survive a page reload/app restart with no account/login needed.
5. **Responsive layout** — single layout that adapts from mobile-width (single column, sticky filter bar) to desktop-width (wider list, side-by-side team grid) using CSS only.

## Tech stack

**Plain HTML + CSS + vanilla JS, single-page, no build step.** Reasons:
- The idea is fundamentally a data-display + filter UI — no server-side logic, auth, or real-time data needed for a prototype.
- A static fixture dataset (JSON) is enough to prove the concept; no backend/API integration required yet.
- No framework/build tooling means it can be opened directly in a browser (`index.html`) or trivially wrapped later (PWA manifest, Capacitor, Electron) once the concept is validated — avoids premature architecture decisions.
- `localStorage` covers the only persistence need (favourite teams) without a database.

## File/folder structure

```
.
├── PLAN.md
├── README.md
├── .gitignore
├── index.html        # app shell/markup
├── style.css          # responsive styling
├── app.js             # rendering, filtering, favourites logic
└── data/
    └── fixtures.js     # static list of teams + sample fixtures (JS module, no fetch/CORS issues)
```

## Out of scope for this pass

- Live/real fixture data from an external API (using a small hand-authored sample season instead).
- Score results, league table, or match stats.
- Push notifications / kickoff reminders.
- User accounts, cross-device sync of favourites.
- Native app packaging (iOS/Android/Electron builds) — this is a responsive web prototype only.
- Timezone conversion (times shown as listed, UK kickoff times).
