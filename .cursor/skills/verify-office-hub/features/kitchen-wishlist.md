# Kitchen wishlist

Kitchen wishlist lets a user paste a store product URL, add it to the open list, and see it counted on the kitchen page.

## Sub-features

- `kitchen-open` opens Kitchen snacks.
- `kitchen-reject-invalid` keeps `Add link` disabled or shows a validation error for a non-URL.
- `kitchen-add` appends a valid http(s) link to Open wishlist.

## How to get to it (user POV)

- Choose `Kitchen snacks` in the sidebar (`/kitchen`).
- From Dashboard, use the compact wishlist form if present (still confirm the item on `/kitchen`).

## Driving it with Chrome DevTools MCP

Preconditions:

- Doctor is healthy.
- Demo mode.
- Open wishlist does not already contain `https://example.com/verify-office-hub-snack`.

- **Open kitchen.** Click `Kitchen snacks`. `h1` is `Kitchen wishlist`. Card `Add a product link` is visible.
- **Invalid input.** Fill `Product link` with `not-a-url`. Expect helper text `Enter a valid http(s) link.` and `Add link` disabled.
- **Add link.** Fill `Product link` with `https://example.com/verify-office-hub-snack`. Click `Add link`. Toast `Link added to wishlist`. Open wishlist lists the URL (possibly normalized).
- **Confirm.** Reload `/kitchen`. The link remains under `Open wishlist`.
- **Proof.** `artifacts/kitchen-wishlist/list.aria.txt` and `artifacts/kitchen-wishlist/list.png` show the example URL.

## Gotchas

- `Add link` stays disabled until `isValidKitchenUrl` passes; do not treat a click no-op as a hang.
- HR can mark items bought/declined; do not use HR bought on a real shopping list during API-mode verification.
- Dashboard compact form uses the same control ids pattern (`kitchen-link` by default).
