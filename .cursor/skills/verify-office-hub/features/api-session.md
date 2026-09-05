# API session and dashboard

API session requires sign-in before any protected route. After login, the user sees the Vancouver office dashboard. Sign out is in the sidebar footer account dropdown.

## Sub-features

- `api-login` loads `/login`, accepts credentials, and lands on the dashboard.
- `api-dashboard` shows the Dashboard heading and sidebar after auth.
- `api-sign-out` clears the session and returns to the login card.

## How to get to it (user POV)

- Open `http://127.0.0.1:3000/` (redirects to `/login` when signed out).
- Enter `Name` and `Password`, then click `Sign in` (or `Register` for a new account).
- Choose `Dashboard` in the sidebar if another page is showing.
- Open the sidebar footer account dropdown, then click `Sign out`.

## Driving it with Chrome DevTools MCP

Preconditions:

- `control-office-hub doctor` reports healthy Office Hub on `http://127.0.0.1:3000`.
- Valid credentials exist (admin from `/api/setup`, or a registered test user).

- **Login wall.** Navigate to `http://127.0.0.1:3000/`. Run `navigate_page` then `take_snapshot`. Card title `Office Hub` with `Name` and `Password` fields is present. No sidebar yet.
- **Sign in.** Fill credentials and click `Sign in`. Snapshot shows `h1` named `Dashboard`. Sidebar includes `Meeting rooms` and `Office lunch`. The sidebar footer shows the signed-in name.
- **Sign out.** Open the sidebar footer account dropdown and click `Sign out`. Snapshot returns to the login card.
- **Proof.** Save snapshot to `artifacts/api-session/dashboard.aria.txt` and screenshot to `artifacts/api-session/dashboard.png`. Both show `Dashboard` and Office Hub chrome after login.

## Gotchas

- HR-only actions require signing in as the admin account (`ADMIN_NAME` / `ADMIN_PASSWORD` from setup).
- Driving an existing Chrome profile shares cookies with other tabs on port 3000; prefer an isolated context.
- Do not call `/api/setup` during verification on a shared database.
