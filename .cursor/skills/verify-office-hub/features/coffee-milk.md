# Coffee and milk

Coffee and milk lets a teammate mark coffee or milk as running low and lets HR mark it restocked.

## Sub-features

- `inventory-open` opens the inventory page.
- `inventory-low` from Team sets an item to Running low.
- `inventory-restock` from HR Admin sets it back to Stocked.

## How to get to it (user POV)

- Choose `Coffee & milk` in the sidebar (`/inventory`).

## Driving it with Chrome DevTools MCP

Preconditions:

- Doctor is healthy.
- Demo mode.
- Note the starting badge for Coffee (`Stocked` vs `Running low`) so you can restore it.

- **Open inventory.** Click `Coffee & milk`. `h1` contains `Coffee & milk`. Cards for Coffee and Milk are visible.
- **Mark low.** On Team, if Coffee shows `Stocked`, click `☕ Running low`. Toast `Team notified — running low`. Badge becomes `Running low`.
- **Second view.** Open Dashboard, then return to `/inventory`. Coffee still `Running low`.
- **Restock.** Click header `HR Admin`. Click `☕ Restocked`. Toast `Marked as restocked`. Badge `Stocked`.
- **Restore.** Leave Coffee `Stocked` unless the precondition started as low — then put it back.
- **Proof.** Capture low state `artifacts/coffee-milk/low.png` and restocked `artifacts/coffee-milk/ok.png` plus matching `.aria.txt` files.

## Gotchas

- Team cannot restock; the UI shows waiting copy instead of Restocked. Switch to HR Admin for that button.
- Inventory is global demo state. Flipping milk as well doubles restore work; prefer coffee only.
- In API mode this writes Neon and notifies the real team. Skip mutations unless using a disposable database.
