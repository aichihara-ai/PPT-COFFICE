# Office Hub verification map

This directory is the maintained source for verifying user-facing behavior of Office Hub. Read this index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- App is at `http://127.0.0.1:3000` using the **Next.js production build in demo mode** unless a feature file says API mode.
- Run `.cursor/skills/verify-office-hub/bin/control-office-hub doctor` and require `verdict=healthy` and `identity=office-hub`.
- Demo header shows **Team** / **HR Admin**. There is no login wall.
- Prefer a fresh tab. Do not hijack a teammate's live session on the shared Neon backend.
- Never start a second server on port 3000. Never kill a process you did not launch via `control-office-hub`.

## Driving conventions

- Start from `/` unless the feature lists another entry URL.
- Use sidebar names exactly: `Dashboard`, `Meeting rooms`, `Kitchen snacks`, `Coffee & milk`, `Office lunch`.
- Drive with Chrome DevTools MCP: snapshot, then click/fill by uid from the latest snapshot.
- Restore mutated demo data after the recipe (cancel the verify booking, revert inventory if you flipped it). Keep artifacts.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA/accessibility snapshot and a screenshot with Office Hub identity visible.
- Mutation proof includes a reload or a second route that reads the same record.
- Record the feature ID and entry URL with every artifact under `.cursor/skills/verify-office-hub/artifacts/`.
- If an entry point is blocked, report the attempted control and the unmet precondition. Do not mark it verified via a different path.

## Feature entry contract

Each feature file starts with an H1 and one paragraph, then exactly four H2 sections: `Sub-features`, `How to get to it (user POV)`, `Driving it with Chrome DevTools MCP`, `Gotchas`.

## Features

- [Demo session and dashboard](./demo-session.md) covers landing, role toggle, and dashboard identity.
- [Meeting rooms](./meeting-rooms.md) covers booking and cancelling Maple/Cedar (Big/Small) rooms.
- [Kitchen wishlist](./kitchen-wishlist.md) covers adding a product link to the open wishlist.
- [Coffee and milk](./coffee-milk.md) covers marking stock low and HR restock.
- [Office lunch](./office-lunch.md) covers start → nominate → lock → vote (destructive on a live round; demo only unless isolated).
