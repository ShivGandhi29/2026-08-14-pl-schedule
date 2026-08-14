# PL schedule

A simple Premier League fixtures viewer where you pick your favourite team(s) and get a schedule filtered down to just their matches — built as a responsive web app so it works equally well on mobile (add to home screen) and desktop (browser tab). No login, no backend — your favourites are remembered locally on your device.

See [PLAN.md](./PLAN.md) for the full reasoning behind the feature set, tech stack, and what's deliberately left out of this first prototype.

## What's here

- `index.html` — app shell (fixtures list view + team picker view)
- `style.css` — responsive, mobile-first styling
- `app.js` — rendering, favouriting, and filtering logic
- `data/fixtures.js` — the 20 Premier League clubs plus a generated full-season sample schedule (placeholder dates/times, not real broadcast fixtures)

## How to run it

No build step or dependencies — it's a static site.

**Easiest:** open `index.html` directly in a browser.

**Or serve it locally** (recommended, avoids any local-file browser quirks):

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Using it

1. Open the **My Teams** tab and tap the clubs you support to favourite them (tap again to remove).
2. Switch to the **Fixtures** tab and use the **My Teams** filter chip to see only matches involving your favourited clubs, or **All Fixtures** to see the whole schedule grouped by matchweek.
3. Your favourites are saved in the browser's `localStorage`, so they'll still be there next time you open the app on the same device/browser.
