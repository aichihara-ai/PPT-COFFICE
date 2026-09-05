# Synthesis: always API

Base is candidate 2. Candidate 1 dropped out with empty output.

Grafts from laziness:
- Keep the name `apiFetch`. Do not rename to `officeHubFetch`.
- Keep gate logic in `ProtectedLayout`. Do not add `SessionGate`.
- Do not add `SessionPhase` or `requireServerEnv` files. Prisma and JWT already fail when env is missing. Encode the session machine in `AuthProvider` by always calling `useSession(false)` and dropping demo state.
- Delete demo and `isApiMode` as candidate 2 specified.

## Base

One persistence. The browser always calls `/api/*`. Neon behind Prisma is the only store. Auth is cookie session only.

Domain shape is a session state machine, not a mode boolean.

```
type Session =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "authenticated"; user: User }
```

`AuthContext` exposes `user`, `isLoading`, `login`, `register`, `logout`. No `isApiMode`. No `setAdminMode`.

`apiFetch` always `fetch`es with `credentials: "include"`. Delete `demo-store.ts` and every caller.

## Rejected

- Keep demo behind `NEXT_PUBLIC_USE_API=false`. Same dual path the user wants gone. Callers still branch.
- Auto-detect `DATABASE_URL`. That env is server-only. The client would still need a public flag.
- Flip `.env.local` only. Fixes this machine, leaves the default and the dead adapter.

## Docs and verify

README and `.env.example` drop the demo default. `verify-office-hub` drives API mode: login wall, no Team/HR toggle, mutations hit Neon. Restore verify bookings by title. Do not wipe the database.

## .env.local

Set `NEXT_PUBLIC_USE_API=true` so an old build that still reads the flag stays on API. After the flag is deleted the key is unused leftover. Safe to leave or delete.

## Worktree

Implement in `/Users/andrewichihara/Developer/PPTVCOFFICE/.worktrees/always-use-api` on `feat/always-use-api`. Leave the main checkout dirty files alone.
