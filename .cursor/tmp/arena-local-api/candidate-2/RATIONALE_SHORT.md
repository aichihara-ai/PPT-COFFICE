# Candidate 2 — short rationale

**Shape picked:** Session state machine (`unknown → guest | signed-in`) + single `officeHubFetch` transport + server `requireServerEnv()` guard. Demo store and `isApiMode` are deleted, not defaulted differently.

**Why:** Local dev should behave like preview/production — same `/api/*`, same Neon, same cookie auth. The old `isApiMode` boolean was a proxy for "do we have a real session?" That belongs in `SessionPhase`, not env config.

**Rejected — flip flag, keep demo code:** Still two backends; callers keep branching; demo UI lingers one env mistake away.

**Rejected — `PersistenceClient` adapter:** One implementation left after migration; interface adds surface without hiding complexity.

**Rejected — middleware-only env gate:** Fixes server boot signal but leaves dual-path `AuthProvider` and demo state.

**Rejected — MSW/local fixtures:** User wants real Neon from `.env.local`, not simulated responses.

**Tradeoff:** Local work requires seeded DB + login; no offline demo. Public auth API shrinks (no `isApiMode`, no `setAdminMode`).

**Next step:** Delete `demo-store.ts`, implement `SessionPhase` in `AuthProvider`, replace `ProtectedLayout` mode checks with `SessionGate`.
