# Rationale: Session state machine + single HTTP transport

## Problem

Office Hub currently runs two persistence backends behind one client helper: local `npm run dev` defaults to an in-browser demo store (`localStorage`, `demoApiFetch`) unless `NEXT_PUBLIC_USE_API=true`, while preview/production already hit `/api/*` with Prisma and Neon. The user wants local development to use the local Next.js API and the Neon database already configured in `.env.local`, with no demo path. The non-obvious part is not wiring Neon — that already works server-side — but eliminating the accidental dual-mode shape (`isApiMode`, demo auth bypass, demo-only UI) without leaving hidden branches that will regress. Call sites in auth, layout, login, and the API client still branch on mode; those branches must disappear from the public surface, not merely default differently.

## Usage (caller's view)

Local README:

1. Fill `.env.local` with `DATABASE_URL`, `JWT_SECRET`, `SETUP_SECRET`, `ADMIN_PASSWORD`.
2. Seed once: `curl -X POST localhost:3000/api/setup -H "x-setup-secret: …"`.
3. `npm run dev`, sign in at `/login`.

Data hooks keep calling one function:

```typescript
officeHubFetch<{ bookings: Booking[] }>("/api/bookings")
```

Auth consumers use `useAuth()` for `user`, `isLoading`, `login`, `logout` — no mode flag.

Protected routes wrap content in `<SessionGate>` which redirects unauthenticated users to login.

The type sketch in design.md is derived from this usage: one transport, one session lifecycle, no caller-side mode switches.

## Shape

**Organizing structure:** authenticated session state machine on the client, single HTTP transport module, server env guard at the API boundary.

Load-bearing decisions:

1. **Delete demo backend entirely** (`demo-store.ts`, all imports). The domain has one persistence kind: API. Per *single source of truth*, we do not keep a dormant demo implementation "for tests."

2. **`SessionPhase` discriminated union** (`unknown | guest | signed-in`) replaces `isApiMode` + parallel demo user state in `AuthProvider`. Mode was really "are we authenticated against the server?" — that is session phase, not an env flag. Invariants live in the union; callers derive `user | null` via `sessionUser()`.

3. **`officeHubFetch` always uses `credentials: "include"`** toward same-origin `/api/*`. No branch, no injectable backend interface on the public surface. Per *boundary-discipline*, HTTP details stay inside this module; hooks receive typed domain results.

4. **`requireServerEnv()` on the server** fails fast when `DATABASE_URL` or auth secrets are missing, so local misconfiguration surfaces as a clear error on first API hit rather than a silent demo fallback or cryptic Prisma failure.

5. **Remove demo-only UX**: "Continue in demo mode", Team/HR role switch in sidebar, `setAdminMode`. Admin vs team is whatever `user.isAdmin` returns from Neon after real login.

Interface depth: callers see three auth fields (`user`, `isLoading`, actions) and one fetch function. Complexity hidden inside: cookie session bootstrap, 401 → guest transition, React Query cache sync, env validation, existing JWT + Prisma auth on server. Public surface is smaller than today (no `isApiMode`, no `setAdminMode`).

## Synthesis decision

*(Arena runner candidate — not synthesized yet.)*

This candidate is the base shape for runner 2: session state machine + delete demo + server env guard. If selected, graft env-guard placement from any candidate that centralizes it in middleware, and keep the explicit `SessionPhase` types over a boolean "isAuthenticated" if another candidate proposes that simplification.

## Tradeoffs accepted

- We accept **mandatory Neon + seed + login for local dev** in exchange for **identical behavior across local, preview, and production** — no special-case local persistence.
- We accept **one extra client state (`unknown` during bootstrap)** in exchange for **correct redirect/spinner behavior** without reintroducing a mode flag.
- We accept **deleting demo mode outright** in exchange for **no dual-maintenance path**; offline UI work requires DB or future explicit test doubles, not a hidden localStorage backend.
- We accept **server env fail-fast (500 on misconfig)** in exchange for **clear operator signal** instead of silently broken auth.
- We accept **keeping existing route handlers unchanged** in exchange for **minimal server diff**; the migration is mostly client + config deletion.

## Alternatives considered

1. **Flip default only — keep `isApiMode` and demo-store, set local to API via env/docs.** Rejected: leaves the accidental dual-backend shape intact; every new feature continues to ask "demo or API?"; demo UI remains one flag away from regressing. Exposes mode coordination to all callers; hides nothing behind a smaller interface.

2. **Persistence adapter interface (`PersistenceClient` with `HttpClient` + delete `LocalDemoClient` later).** Rejected: one implementation remains after migration; the interface would be a pass-through abstraction with no second backend to swap. Adds leakage of transport types unless carefully bounded; callers would still need to know which adapter is active unless we delete demo anyway.

3. **Next.js middleware env gate + unchanged AuthProvider with `useSession(false)` always.** Rejected: solves server misconfig early but leaves client dual-path auth state (`demoUser` vs session query) and `isApiMode` on the context. Temporal split between middleware (server) and auth provider (client) without removing the root boolean.

4. **MSW/fixture layer for local dev without Neon.** Rejected: user explicitly wants the configured Neon in `.env.local`, not simulated API responses. Would reintroduce a second persistence story under a different name.

This was not "the only possible shape" — but among viable options, the session state machine best matches the real domain question (authenticated or not) while minimizing public API size after demo deletion.

## Open questions and risks

- Should `verify-office-hub` run `/api/setup` automatically in CI, or assume a pre-seeded sandbox? Affects flake rate if Neon is shared and mutated concurrently.
- Is shared Neon across developers acceptable for local dev, or will someone ask for Docker Postgres later? (Out of scope for this change but affects onboarding docs.)
- Global rename `apiFetch` → `officeHubFetch`: do it in one pass or keep alias temporarily to shrink diff?
- After demo deletion, is there any workflow that relied on instant admin/team toggle for kitchen/HR screens that now requires two real accounts in Neon?

## Next implementation step

Delete `src/shared/lib/demo-store.ts`, remove `isApiMode` from `app-config.ts` and all call sites, and rewrite `AuthProvider` around `SessionPhase` with `SessionGate` replacing mode checks in `ProtectedLayout`.
