# Meeting rooms

Meeting rooms lets a user pick a date, book Big or Small for a time range, see the booking on the day schedule, and cancel their own booking.

## Sub-features

- `rooms-open` opens the rooms page from the sidebar.
- `rooms-book-dialog` opens the book dialog from `Book a room`.
- `rooms-save` persists a titled booking on the selected date.
- `rooms-cancel` removes that booking from the list.

## How to get to it (user POV)

- Choose `Meeting rooms` in the sidebar (`/rooms`).
- From Dashboard, choose `Book a room` (same dialog; still prove on `/rooms` for this feature).
- Choose `Book` on a room row or drag the timeline (drag is optional; button path is required).

## Driving it with Chrome DevTools MCP

Preconditions:

- Doctor is healthy.
- Demo mode, role `Team`.
- No existing booking titled `verify-office-hub`.

- **Open rooms.** Click sidebar `Meeting rooms`. Snapshot `h1` is `Meeting rooms`. Date field labelled `Date` is present, with `Previous day` / `Next day` controls.
- **Open dialog.** Click `Book a room`. Dialog title `Book a meeting room` appears with Room, Title, Start, End.
- **Set title.** Fill the Title field with `verify-office-hub` (leave default room Big / `🟦 Big` and default times if free).
- **Save.** Click `Book room`. Dialog closes. A toast `Room booked` may appear. The bookings list includes `verify-office-hub`.
- **Confirm persistence.** Reload `http://127.0.0.1:3000/rooms`. The same title is still listed with the chosen times.
- **Cancel.** Click `Cancel` on that row. Toast `Booking cancelled`. The title is gone.
- **Proof.** Before cancel, snapshot `artifacts/meeting-rooms/booked.aria.txt` and screenshot `artifacts/meeting-rooms/booked.png` showing `verify-office-hub`. After cancel, capture `artifacts/meeting-rooms/cancelled.aria.txt`.

## Gotchas

- Overlapping times on the same room fail; pick a free window or another room (`🟩 Small`).
- Room labels in UI are `Big` and `Small` (`room_a` / `room_b` in code). Do not look for "Maple" or "Cedar" in the current UI.
- Dashboard also books rooms; proving only Dashboard does not cover the `/rooms` date picker entry.
- Cancel is shown only for the current user's bookings (or HR). Stay on Team for the booking you created.
