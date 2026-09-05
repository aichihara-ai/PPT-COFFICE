# Kitchen wishlist

Kitchen wishlist lets a user paste a store product URL, optionally add a title, add it to the open list, and see the title (or hostname fallback) on the kitchen page.

## Sub-features

- `kitchen-open` opens Kitchen snacks.
- `kitchen-reject-invalid` keeps `Add link` disabled or shows a validation error for a non-URL.
- `kitchen-add` appends a valid http(s) link to Open wishlist.
- `kitchen-title` shows the optional title when present; rows without a title fall back to hostname/path.

## How to get to it (user POV)

- Choose `Kitchen snacks` in the sidebar (`/kitchen`).
- From Dashboard, use the compact wishlist form if present (still confirm the item on `/kitchen`).

## Driving it with Chrome DevTools MCP

Preconditions:

- Doctor is healthy.
- Demo mode.
- Open wishlist does not already contain `https://example.com/verify-office-hub-snack`.

- **Open kitchen.** Click `Kitchen snacks`. `h1` is `Kitchen wishlist`. Card `Add a product link` is visible. `Title (optional)` is present.
- **Invalid input.** Fill `Product link` with `not-a-url`. Expect helper text `Enter a valid http(s) link.` and `Add link` disabled.
- **Add untitled link.** Fill `Product link` with `https://example.com/verify-office-hub-snack`. Leave title empty. Click `Add link`. Open wishlist shows hostname/path.
- **Add titled link.** Fill `Title (optional)` with `Trail mix` and `Product link` with `https://www.costco.ca/kirkland-signature-trail-mix.product.100.html`. Click `Add link`. Open wishlist shows `Trail mix` as the link text (not only the raw URL).
- **Confirm.** Reload `/kitchen`. Both items remain under `Open wishlist`.
- **Proof.** `artifacts/kitchen-wishlist/list.aria.txt` and `artifacts/kitchen-wishlist/list.png` show the titled item.

## Gotchas

- `Add link` stays disabled until `isValidKitchenUrl` passes; do not treat a click no-op as a hang.
- HR can mark items bought/declined; do not use HR bought on a real shopping list during API-mode verification.
- Dashboard compact form uses the same control ids pattern (`kitchen-link` by default; title is `kitchen-link-title`).
