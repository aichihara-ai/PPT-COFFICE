# Rationale

## Problem

Office Hub already has a working persistence path: Next.js `/api/*` → Prisma → the Neon `DATABASE_URL` sitting in `.env.local`. Local `npm run dev` does not use it. A build-time boolean (`isApiMode` / `NEXT_PUBLIC_USE_API`) plus an in-browser `demo-store` (`localStorage` key `office-hub-demo`) short-circuit the client, skip login, and expose a Team/HR impersonation switch. The user wants local work on the real API and that Neon, with no demo mode. The non-obvious part is not “how to connect Prisma” — that is already done — it is how to collapse the accidental dual-backend shape without replacing the boolean with a new public mode type, a persistence port, or a client session ADT that restates React Query. Callers that still branch (`apiFetch`, `AuthProvider`, login, `ProtectedLayout`, sidebar, verify skill) must lose the branch, not learn a new one. Unrelated dirty files stay out. Phase A also constrains us: `DATABASE_URL` cannot be a client mode signal; `VITE_USE_API` is dead; `verify-office-hub` builds with `npm start` (`NODE_ENV=production` on HTTP); API mode is a shared Neon sandbox, not an isolated local database.

## Usage (caller's view)

Local README: fill server env (already in `.env.local`), `npm run dev`, optionally `POST /api/setup` on an empty DB, then sign in. No persistence flag.

Feature hooks keep calling `apiFetch("/api/...")` with no mode check — `useSuggestions` / `useBookings` already look like this.

Auth consumers read `user` / `isLoading` / `login` / `logout` from `useAuth`. They never see `isApiMode` or `setAdminMode`. HR is the seeded admin account; Team is a registered user.

`ProtectedLayout` always waits for the session query, then redirects anonymous users to `/login?from=`. The `if (!isApiMode) return children` bypass is gone.

Login is Sign in / Register only.

The type sketch is derived from these sites: `apiFetch<T>`, `AuthContextValue` without mode fields, `useSession()` with no `skip`, and `CookieSecurity` computed from the request protocol so `npm start` on `http://127.0.0.1:3000` still sets a cookie.

## Shape

**Single typed persistence.** The domain type is a unit: `{ kind: "api" }`. It is an invariant in the design, not a runtime export. A one-variant union is encoded by deleting the other variant (`demo-store`, `isApiMode`, `NEXT_PUBLIC_USE_API`). Per *single source of truth* and *subtract-before-you-add*, we do not keep a dormant second backend and we do not invent a port with one implementation.

**Auth is the existing cookie session.** `office-hub-token` + `requireUser` + `GET /api/auth/me` already exist. The client session machine is React Query’s `useSession` (pending / data / error). `user | null` plus `isLoading` is the public surface. 401/403 from `/me` become `null` (anonymous); 5xx stay errors so an outage is not a login wall. Per *encode-lessons-in-structure*, “not logged in” is `user === null`, not `!isApiMode`. Per *boundary-discipline*, JWT and Prisma stay behind the server auth module; the client parses `{ user }` into `entities/user`.

**Cookie `Secure` is request-derived.** `secure: NODE_ENV === "production"` breaks local `next start` on HTTP — the path `verify-office-hub` actually launches. `cookieSecurityFromRequest` uses `request.nextUrl.protocol === "https:"`. That is the one new type, owned next to `setAuthCookie`, because demo used to hide this failure. Per *validate at the boundary*.

**Interface depth.** Callers keep two things they already know (`apiFetch`, `useAuth`). We hide demo deletion, cookie policy, and 401 mapping. We do **not** add `SessionPhase`, `SessionGate`, `officeHubFetch`, or `requireServerEnv()`. Those enlarge the public surface after the problem (two backends) has been deleted. A `SessionGate` that only reads `useAuth` and redirects is a pass-through of `ProtectedLayout`. A session enum that mirrors query status is temporal decomposition. An env aggregator that rethrows `DATABASE_URL` / `JWT_SECRET` checks already in Prisma and `getSecret()` is a pass-through.

**Idempotency.** Login twice overwrites the cookie. Logout twice clears an already-empty cookie. `/api/setup` is upsert. `useSession` has no skip flag, so it cannot be “forgotten on” in one tree and “left off” in another.

**Shared Neon is accepted.** Local, preview, and verify mutate the same database when they share `DATABASE_URL`. We do not add a local Postgres or auto-seed on boot (boot-seed would upsert the shared sandbox every start).

## Synthesis decision

Not applicable — this is one arena candidate, not the synthesized package.

## Tradeoffs accepted

- We accept a login wall and a seeded Neon account for local `npm run dev` in exchange for one persistence path and no in-browser store to keep in sync with `/api/*`.
- We accept shared-Neon side effects from local and `verify-office-hub` mutations in exchange for not standing up a second database or a demo double. Verify already documents this for API mode.
- We accept that Team/HR can no longer be flipped in the header in exchange for `user.isAdmin` meaning a real Neon role. Two browser profiles, two accounts.
- We accept leaving `AuthProvider` as a thin context around React Query in exchange for not introducing a new session ADT. The thinness is leftover API-path code, not a new wrapper.
- We accept `npm start` on HTTP setting a non-Secure cookie in exchange for verify and local production builds actually staying signed in. Vercel HTTPS still gets `Secure`.
- We accept not rewriting `.env.local` in this change (secrets file). Leftover `NEXT_PUBLIC_USE_API=false` / `VITE_USE_API=false` become unused until a human deletes them.
- We accept not adding Next.js middleware, so the first paint of a protected page can still flash through client redirect. That cost is current API-mode behavior; duplicating JWT checks on the edge is worse.

## Alternatives considered

- **Flip the default only** — keep `isApiMode` and `demo-store`, set `NEXT_PUBLIC_USE_API=true` (or invert the boolean) in docs/env. Rejected: the accidental dual-backend shape stays; every new feature still asks “demo or API?”; demo UI remains one forgotten flag away. Callers keep coordinating mode. Interface gets no smaller. Hides nothing.

- **Persistence port with two adapters** (`ApiStore` | `DemoStore` behind `OfficeHubStore`). Rejected: the domain has one kind. A port whose second impl we refuse to ship is a pass-through around `apiFetch`. Exposes storage strategy to composition roots; hides less than deleting the second impl. Interface larger than the chosen shape.

- **Client session state machine + SessionGate + renamed fetch + boot-env guard** (`unknown | guest | signed-in`, `officeHubFetch`, `requireServerEnv()`). Rejected as *this* candidate’s shape: it solves “mode leaking into auth” by adding types that restate React Query status and env throws that already exist. `SessionGate` is a pass-through of `ProtectedLayout`. `officeHubFetch` is a rename, not a deeper module. Public surface grows after the second backend dies. (Another candidate may still pick this; we judge it worse on interface depth.)

- **Next.js middleware as the session owner.** Rejected: JWT verify would live on the edge and again in `requireUser` (leakage). Page gate plus API gate already exist. Middleware does not delete demo by itself; it adds a third checker. Callers would still need `user` in the client for `isAdmin` UI.

- **Keep demo-store as a test double / offline escape, compile-stripped from prod.** Rejected: no unit test imports it; verify is supposed to drive the real UI. A second backend “for tests” is the hedge the task forbids. Callers or test helpers would relearn the demo contract.

- **Key client mode off `DATABASE_URL`.** Rejected in Phase A: the var is server-only. The client cannot see it. That is why the boolean existed; deleting the boolean is the fix, not finding a new client-visible signal.

This was the only viable *subtractive* shape once “one persistence kind” and “do not keep both backends” are taken as hard constraints. The alternatives above are real other shapes, not flavors of the same deletion.

## Open questions and risks

- When `.env.local` `DATABASE_URL` is the same Neon as preview/production, should verify recipes require a dedicated sandbox URL, or is the existing “do not parallelize, restore via UI” warning enough?
- After `next start` on HTTP, are we comfortable with a non-Secure cookie on loopback only, or should verify move to HTTPS locally?
- Should leftover `NEXT_PUBLIC_USE_API` / `VITE_USE_API` in the human’s `.env.local` be called out in README as “safe to delete,” or ignored silently?
- Is flashing a loading state on every protected navigation acceptable, or do we later want a server-rendered session (still without middleware duplicating JWT)?
- Who owns restoring verify mutations on shared Neon when a recipe is abandoned mid-flight?

## Next implementation step

Delete `src/shared/lib/demo-store.ts` and every `isApiMode` / `setAdminMode` / demo import, then make `apiFetch` network-only and pass `cookieSecurityFromRequest` into `setAuthCookie` / `clearAuthCookie` so local `next start` can sign in.
