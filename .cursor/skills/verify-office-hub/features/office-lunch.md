# Office lunch

Office lunch lets HR start a voting round, teammates pick up to 3 restaurants from the Uber Eats pool on a single screen, and HR close the round to announce exactly one winner. The pool starts empty; anyone can add a store link with an optional title.

## Sub-features

- `lunch-open` opens the lunch page.
- `lunch-pool-empty` shows an empty pool (no Japadog / Mezze / other baked-in seeds).
- `lunch-add-title` adds an Uber Eats link with a title and shows that title in the pool.
- `lunch-add-fallback` adds a link without a title and shows the store-name fallback.
- `lunch-start` starts a voting round (HR).
- `lunch-vote` toggles a vote (team account; hard cap 3).
- `lunch-close` closes the round and announces one winner (HR).

## How to get to it (user POV)

- Choose `Office lunch` in the sidebar (`/lunch`).
- Dashboard also embeds the same panel; prove the dedicated page.

## Driving it with Chrome DevTools MCP

Preconditions:

- Doctor is healthy.
- Signed in. Start/close need the HR admin account. Vote works as any signed-in user.
- If a round is already active, do not click `Start lunch round`. Skip start and report the existing status.
- Do not close a live office round. Skip `lunch-close` unless this database is disposable.

- **Open lunch.** Click `Office lunch`. `h1` is `Office lunch vote`. Description mentions pick up to 3 and one winner.
- **Empty pool.** Confirm `0 spots in pool` (or `Pool is empty`) on this local database, or add a uniquely titled verify link. `Title (optional)` and `Uber Eats link` are visible.
- **Add titled link.** Fill `Title (optional)` with `Guu Garden` and `Uber Eats link` with `https://www.ubereats.com/ca/store/guu-thurlow/verify-office-hub`. Click `Add to pool`. The pool shows **Guu Garden**, not the raw URL.
- **Add untitled link.** Leave title empty. Fill `Uber Eats link` with `https://www.ubereats.com/ca/store/japadog-robson/verify-untitled`. Click `Add to pool`. The pool shows the slug fallback (`Japadog Robson`), not the raw URL.
- **Confirm.** Reload `/lunch`. Both titles remain. Dashboard lunch card shows the same titles.
- **Start.** As HR admin, click `Start lunch round` only if no round is open. Status becomes `Voting open` (no nominate/lock step).
- **Vote.** As a team user, click `Vote` on the titled name (`Guu Garden`). Button becomes `Voted`. Remaining count decreases.
- **Close.** As HR admin, click `Close round & announce winner` only on a disposable database.
- **Proof.** Snapshots of the empty pool and titled list: `artifacts/office-lunch/empty-pool.aria.txt` and `artifacts/office-lunch/titled-pool.aria.txt`, plus screenshots.

## Gotchas

- Up to 3 votes per user in a round. A cap-of-3 proof needs three pool entries and one signed-in user.
- Closing a round is HR-only and is not required for this map; do not close a live office round.
- Adding an Uber Eats store scrapes the menu over the network.
