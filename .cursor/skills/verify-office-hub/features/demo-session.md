# Demo session and dashboard

Demo session lets a user open Office Hub without login, see Vancouver office dashboard stats, and switch between Team and HR Admin in the header.

## Sub-features

- `demo-open` loads `/` with the Dashboard heading and sidebar.
- `demo-role-team` shows a Team badge and Team-member copy.
- `demo-role-hr` switches to HR Admin and shows the HR Admin badge.

## How to get to it (user POV)

- Open `http://127.0.0.1:5173/` (redirects into the shell at `/`).
- Choose `Dashboard` in the sidebar if another page is showing.
- Choose `Team` or `HR Admin` in the header (demo mode only).

## Driving it with Chrome DevTools MCP

Preconditions:

- `control-office-hub doctor` reports healthy Office Hub on `http://127.0.0.1:5173`.
- Vite demo mode (header has `Team` and `HR Admin`, no `Sign in` card).

- **Open dashboard.** Navigate to `http://127.0.0.1:5173/`. Run `navigate_page` then `take_snapshot`. An `h1` named `Dashboard` is present. Sidebar includes `Meeting rooms` and `Office lunch`.
- **Team role.** Click `Team`. Snapshot shows a badge `Team` or the demo user name `Team`, not `HR Admin` as the role badge.
- **HR role.** Click `HR Admin`. Snapshot shows badge `HR Admin`. Dashboard lunch detail may mention starting a round.
- **Proof.** Save snapshot to `artifacts/demo-session/dashboard.aria.txt` and screenshot to `artifacts/demo-session/dashboard.png`. Both show `Dashboard` and `Office Hub` chrome.

## Gotchas

- API mode (`vercel dev` with `VITE_USE_API=true`) has no Team/HR toggle; unauthenticated users hit `/login`. Do not use this feature file against API mode.
- Driving an existing Chrome profile shares `office-hub-demo` localStorage with other tabs on 5173.
