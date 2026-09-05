# Candidate 1 — short rationale

**Shape:** Single typed persistence (unit type `{ kind: "api" }`, not exported). Delete demo-store, `isApiMode`, and `NEXT_PUBLIC_USE_API`. Auth stays the existing cookie + `useAuth` (`user | null`, `isLoading`). React Query is the session machine. New contract: cookie `Secure` from request HTTPS, so `npm start` on HTTP still works.

**Rejected:** Flip-the-flag-and-keep-demo (dual backend remains). Persistence port with one impl (pass-through). Client `SessionPhase` / `SessionGate` / `officeHubFetch` / `requireServerEnv()` (new surface that restates query status and existing env throws). Middleware as a third JWT gate. Demo-as-test-double. Client mode from `DATABASE_URL`.

**Why:** The domain is one store. Callers already speak `apiFetch` and `user`. The bug is a second path and a boolean, not a missing ADT. Subtract the path; fix the cookie so local production builds can actually authenticate.

**Tradeoff:** Local and verify require real login against shared Neon. No offline demo, no Team/HR impersonation switch.

**Next:** Delete `demo-store.ts` and mode branches; network-only `apiFetch`; request-derived cookie security.
