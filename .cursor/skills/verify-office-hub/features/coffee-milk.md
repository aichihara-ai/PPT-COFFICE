# Coffee and milk

Coffee and milk lets a teammate mark coffee or milk as running low and lets HR mark it restocked.

## Sub-features

- `inventory-open` opens the inventory page.
- `inventory-low` from a team account sets an item to Running low.
- `inventory-restock` from the HR admin account sets it back to Stocked.

## How to get to it (user POV)

- Choose `Coffee & milk` in the sidebar (`/inventory`).

## Driving it with Chrome DevTools MCP

Preconditions:

- Doctor is healthy.
- Signed in. Restock needs the HR admin account.
- Note the starting badge for Coffee (`Stocked` vs `Running low`) so you can restore it.

- **Open inventory.** Click `Coffee & milk`. `h1` contains `Coffee & milk`. Cards for Coffee and Milk are visible.
- **Mark low.** If Coffee shows `Stocked`, click `☕ Running low`. Toast `Team notified — running low`. Badge becomes `Running low`.
- **Second view.** Open Dashboard, then return to `/inventory`. Coffee still `Running low`.
- **Restock.** Sign in as HR admin if the current user is not admin. Click `☕ Restocked`. Toast `Marked as restocked`. Badge `Stocked`.
- **Restore.** Leave Coffee `Stocked` unless the precondition started as low — then put it back.
- **Proof.** Capture low state `artifacts/coffee-milk/low.png` and restocked `artifacts/coffee-milk/ok.png` plus matching `.aria.txt` files.

## Gotchas

- Team cannot restock; the UI shows waiting copy instead of Restocked. Sign in as HR admin for that button.
- Inventory is shared Neon state. Flipping milk as well doubles restore work; prefer coffee only.
- Mutations write Neon and can notify the real team. Restore Coffee after the recipe.
