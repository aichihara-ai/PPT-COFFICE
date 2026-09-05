# Office lunch

Office lunch lets HR start a voting round, teammates pick up to 3 restaurants from the Uber Eats pool on a single screen, and HR close the round to announce exactly one winner.

## Sub-features

- `lunch-open` opens the lunch page.
- `lunch-start` starts a voting round (HR).
- `lunch-vote` toggles a vote (Team; hard cap 3).
- `lunch-close` closes the round and announces one winner (HR).

## How to get to it (user POV)

- Choose `Office lunch` in the sidebar (`/lunch`).
- Dashboard also embeds the same panel; prove the dedicated page.

## Driving it with Chrome DevTools MCP

Preconditions:

- Doctor is healthy.
- **Demo mode only** unless the database is disposable. An in-progress real round must not be closed or overwritten.
- If a round is already active, do not click `Start lunch round`. Skip start and report the existing status, or use a fresh demo `localStorage`.

- **Open lunch.** Click `Office lunch`. `h1` is `Office lunch vote`. Description mentions pick up to 3 and one winner.
- **Start.** Switch to `HR Admin`. Click `Start lunch round`. Status becomes `Voting open` (no nominate/lock step).
- **Vote.** Switch to `Team`. Click `Vote` on up to 3 names (for example `Japadog`, then two more). Buttons become `Voted`. Remaining count decreases. A fourth `Vote` is disabled.
- **Unvote.** Click `Voted` on one pick to free a slot, then vote another.
- **Close.** Switch to `HR Admin`. Click `Close round & announce winner`. Winner is a single restaurant (ties: earliest first vote, then lower restaurant id).
- **Proof.** Snapshots at voting: `artifacts/office-lunch/voting.aria.txt` plus screenshots.

## Gotchas

- Up to 3 votes per user in a round. Demo is a single user.
- Closing a round (`onClose`) is HR-only and is not required for this map; do not close a production round.
- Adding an Uber Eats store hits network/menu scraping; skip unless the change under test is that form.
