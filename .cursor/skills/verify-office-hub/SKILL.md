---
name: verify-office-hub
description: Drive the Office Hub web app (Vite + React office tools) the way a Vancouver teammate would — dashboard, meeting rooms, kitchen wishlist, coffee/milk, lunch votes. Use when proving a UI or API change works in the running app, not only in unit tests.
---

# Verify Office Hub

Office Hub is the Vancouver internal office web app in this repo (`office-hub`). The primary user surface is the **browser UI**. There is no first-party CLI. Serverless routes live under `/api/*` and are a secondary surface (curl) when `vercel dev` or a deployed backend is in play.

Default verification uses **Vite demo mode** (`npm run dev` on port **5173**). Demo mode does **not** hit Neon. State lives in the browser `localStorage` key `office-hub-demo`. Protected routes skip login in demo mode. The header shows **Team** / **HR Admin** role toggles instead of **Sign out**.

`npx vercel dev` / `npm run dev:full` (typically port **3000**) is API mode: JWT login, shared Neon Postgres. Do not treat that as an isolated sandbox. Never start a second API-mode instance against the same `DATABASE_URL` to "parallelize" verification.

## Launch

From repo root:

```bash
.cursor/skills/verify-office-hub/bin/control-office-hub launch
```

Ready when `curl -fsS http://127.0.0.1:5173/` HTML contains `Office Hub — Vancouver` (document title in `index.html`). Vite uses `strictPort: true`, so a second server on 5173 will fail; the helper refuses to start if 5173 is already taken.

Teardown (only the PID this helper started):

```bash
.cursor/skills/verify-office-hub/bin/control-office-hub cleanup
```

If doctor reports `owner=foreign-or-preexisting`, do **not** run cleanup expecting to free the port. Leave that process alone.

Demo isolation: Vite cannot bind 5173 twice. Two Chrome profiles on the same origin still share `localStorage` unless you use a separate browser user-data-dir. Prefer a dedicated DevTools/MCP page and restore demo state after mutations (see Cleanup). Do not drive the user's already-open Office Hub tab if it might be a live work session; launch/doctor first and prefer a fresh tab at `http://127.0.0.1:5173/`.

## Doctor

```bash
.cursor/skills/verify-office-hub/bin/control-office-hub doctor
```

Require `verdict=healthy`, `identity=office-hub`, `url=http://127.0.0.1:5173`. Run this first whenever the page looks wrong, the port might be stale, or launch just finished.

In API mode (only if the task explicitly needs Neon): `GET /api/auth/me` with `Authorization: Bearer <token>` must 200. Unauthenticated `GET /api/bookings` must 401. Do not use `/api/setup` during verification.

## Drive

Harness: **Chrome DevTools MCP** (`user-chrome-devtools` or equivalent): `list_pages`, `navigate_page`, `take_snapshot`, `click` / `fill` / `fill_form` by latest snapshot uid, `take_screenshot`.

Stable handles (prefer these over coordinates):

| User control | Handle |
| --- | --- |
| App identity | Page title `Office Hub — Vancouver`; login card title `Office Hub` |
| Nav | Sidebar items named `Dashboard`, `Meeting rooms`, `Kitchen snacks`, `Coffee & milk`, `Office lunch` (routes `/`, `/rooms`, `/kitchen`, `/inventory`, `/lunch`) |
| Demo role | Buttons `Team` and `HR Admin` in the header (demo only) |
| Sign in | Textboxes labelled `Name`, `Password`; buttons `Sign in`, `Register` (API mode only) |
| Rooms | Buttons `Book a room`, `Book`; dialog title `Book a meeting room`; button `Book room`; list action `Cancel` |
| Kitchen | Textbox `Product link`; button `Add link`; heading `Kitchen wishlist` |
| Inventory | Page title starts with `Coffee & milk`; buttons `☕ Running low`, `🥛 Running low`; HR `☕ Restocked` / `🥛 Restocked`; badges `Stocked` / `Running low` |
| Lunch | Button `Start lunch round`; `Nominate` / `Nominated`; `Lock top 3 → start voting`; `Vote` / `Voted` |

Do not prove behavior by writing `localStorage` or calling `demoApiFetch` from the console. Exercise the UI (or the real `/api/*` the UI uses).

Read `features/README.md` and the matching feature file before driving. Start from `/` unless the feature says otherwise.

## Evidence

Write proof under `.cursor/skills/verify-office-hub/artifacts/<feature-id>/`. Do not put secrets in artifacts. Chrome DevTools MCP `filePath` may refuse `.cursor/` and `/tmp`; persist snapshots by writing files with the editor, and keep screenshots from `take_screenshot` in that same artifacts folder when the tool allows. Prefer `new_page` with `isolatedContext=office-hub-verify` so demo `localStorage` is not shared with the user's main profile.

Proof standards:

- Walk the real user path (sidebar + labelled buttons). Do not stub React state.
- Capture **action + result**: snapshot or screenshot before the mutation is not enough; include after-state.
- Mutations need a second view (reload or another route that reads the same data). Demo data is in `localStorage`; a reload of `/rooms` that still shows the booking is persistence proof.
- Record feature ID and URL in a `proof.txt` next to screenshots.
- UI proof: accessibility snapshot (`take_snapshot` saved to `*.aria.txt`) plus screenshot (`take_screenshot` saved to `*.png`) with Office Hub chrome visible (sidebar or `h1`).
- API-mode extra: request method/path, status, and a redacted body. Never paste JWT or `.env.local` values.

## Cleanup

```bash
.cursor/skills/verify-office-hub/bin/control-office-hub cleanup
```

Kills only the PID in `.cursor/skills/verify-office-hub/.run/vite.pid`. Never `pkill -f vite` / `pkill node`.

Fixture rollback (demo): cancel bookings titled `verify-office-hub`; do not wipe the whole `office-hub-demo` key unless this run created the browser profile. Leave `artifacts/` in place.

## Helpers

Script is executable:

```bash
.cursor/skills/verify-office-hub/bin/control-office-hub launch
.cursor/skills/verify-office-hub/bin/control-office-hub doctor
.cursor/skills/verify-office-hub/bin/control-office-hub cleanup
```
