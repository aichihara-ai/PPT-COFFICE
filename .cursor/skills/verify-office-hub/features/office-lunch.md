# Office lunch

Office lunch lets HR start a nomination round, teammates nominate one restaurant from the Uber Eats pool, HR lock the top 3, and each person vote once.

## Sub-features

- `lunch-open` opens the lunch page.
- `lunch-start` starts a round (HR).
- `lunch-nominate` nominates one pool restaurant (Team).
- `lunch-lock` locks top 3 (HR).
- `lunch-vote` casts one vote (Team).

## How to get to it (user POV)

- Choose `Office lunch` in the sidebar (`/lunch`).
- Dashboard also embeds the same panel; prove the dedicated page.

## Driving it with Chrome DevTools MCP

Preconditions:

- Doctor is healthy.
- **Demo mode only** unless the database is disposable. An in-progress real round must not be closed or overwritten.
- If a round is already active, do not click `Start lunch round`. Skip start and report the existing status, or use a fresh demo `localStorage`.

- **Open lunch.** Click `Office lunch`. `h1` is `Office lunch vote`.
- **Start.** Switch to `HR Admin`. Click `Start lunch round`. Heading/status becomes nominating (`Step 1 · Nominate`).
- **Nominate.** Switch to `Team`. Click `Nominate` on one seeded name (for example `Japadog`). Button becomes `Nominated`.
- **Lock.** Switch to `HR Admin`. Click `Lock top 3 → start voting`. Status becomes voting (`Step 2 · Vote`).
- **Vote.** Switch to `Team`. Click `Vote` on one finalist. Button becomes `Voted`.
- **Proof.** Snapshots at nominating and voting: `artifacts/office-lunch/nominating.aria.txt` and `artifacts/office-lunch/voting.aria.txt`, plus screenshots.

## Gotchas

- One nomination and one vote per user in a round. Demo is a single user; you cannot prove two voters without API users.
- Locking with no nominations may fail; nominate first.
- Closing a round (`onClose`) is HR-only and is not required for this map; do not close a production round.
- Adding an Uber Eats store hits network/menu scraping; skip unless the change under test is that form.
