# Rationale: Local Postgres via Docker + TCP adapter

## Problem

Local `npm run dev` and Prisma CLI both read the same `DATABASE_URL` from `.env.local`, which today resolves to a shared production Neon host (`ep-long-breeze-awuok4go-…neon.tech`). Any migrate, API handler, or `POST /api/setup` therefore mutates production. The repo has no `@prisma/adapter-pg`, so pointing `DATABASE_URL` at localhost would not work without code changes. The agent cannot mint a Neon branch (`NEON_API_KEY` absent, `neonctl` logged out), but Docker Desktop is running and a throwaway Postgres already listens on host port `5433`. Constraints from Phase A: callers must keep importing `prisma` from `src/shared/db/index.server.ts`; seed stays `POST /api/setup`; `prisma.config.ts` must stay aligned with Next env loading; no secrets in committed files; diff must not touch unrelated kitchen/auth WIP.

## Usage (caller's view)

Fresh clone:

```bash
docker compose -f docker-compose.dev.yml up -d
cp .env.example .env.local   # set secrets; DATABASE_URL uses 127.0.0.1:5433
npm run db:local:init        # optional wrapper: up + wait + migrate
npm run dev
curl -X POST http://localhost:3000/api/setup -H "x-setup-secret: …"
```

Route code stays:

```typescript
import { prisma } from "@/shared/db/index.server"
await prisma.booking.findMany()
```

After `vercel env pull`, either `npm run env:use-local-db` or manual reset of `DATABASE_URL`; otherwise startup throws with instructions unless `ALLOW_PRODUCTION_DATABASE=true`.

## Shape

**Whole shape: Local Postgres.** `docker-compose.dev.yml` provides isolation the agent can stand up immediately. `parseDatabaseTarget()` classifies `DATABASE_URL` into a discriminated `DatabaseTarget` (`local-tcp` | `neon-serverless` | `forbidden-neon`). Adapter selection is internal: `PrismaPg` for local TCP, `PrismaNeon` for allowed remote Neon (Vercel deploy). Committed `FORBIDDEN_NEON_ENDPOINT_IDS` identifies the known production endpoint without storing passwords. `assertDevelopmentSafe()` runs at the Prisma boundary for both Next (`createPrismaClient`) and CLI (`prisma.config.ts` import side-effect), per boundary-discipline — business routes never see host policy.

**Interface depth.** Public surface remains one export: `prisma`. All complexity (URL parse, forbidden-endpoint policy, adapter fork, pool lifecycle) hides inside `src/shared/db/create-client.server.ts` and `target.server.ts`. Callers do not learn TCP vs serverless, do not pass mode flags, and do not coordinate multiple methods. The dual adapter is not a second public API; it is an implementation consequence of the load-bearing `DatabaseTarget` type, which keeps the parse in one place instead of scattering `host.includes("neon")` (per encode-lessons-in-structure).

**Single source of truth.** Endpoint ids live in `forbidden-endpoints.ts` only. Classification and guard run once per process start (Prisma singleton + CLI load). `env:use-local-db` patches one key — it does not try to sync nine Vercel alias vars the app never reads.

## Synthesis decision

filled by arena

## Tradeoffs accepted

- We accept adding `@prisma/adapter-pg` and `pg` plus a compose file in exchange for agent-controllable isolation today without Neon API access.
- We accept an internal dual-adapter switch in exchange for keeping Vercel production on `PrismaNeon` while local dev uses TCP — deploy behavior stays env-only.
- We accept a committed forbidden-endpoint allowlist (host prefix, not secret) in exchange for failing fast before any query; list must be updated if production compute id rotates.
- We accept that `vercel env pull` still overwrites `.env.local` in exchange for a loud startup failure plus `env:use-local-db` rather than silently re-arming prod — we do not auto-rewrite pulled env without an explicit npm script.
- We accept Docker as a local prerequisite in exchange for zero cloud provisioning during development.

## Alternatives considered

- **Neon branch (env-only, keep PrismaNeon only).** Rejected because the agent cannot mint a branch today; the human must paste a new URL, and until they do local dev keeps hitting production. Interface depth is similar (still just `prisma`), but operability for this session is worse — no self-service isolation.
- **Guard-only on current Neon URL (no local Postgres, no adapter-pg).** Rejected as shallow: it stops accidental prod writes but offers no writable local target, so development stalls unless the human procures a Neon branch out-of-band. Exposes policy failure to callers without providing a replacement database.
- **Persistence port / `DatabaseClient` interface with injectable adapters.** Rejected as information leakage and pass-through: every route would import a new abstraction mirroring Prisma with no hidden capability. Violates the FRAME rubric to keep `prisma` as the only import.

## Open questions and risks

- Should `parseDatabaseTarget` treat `host.docker.internal` or custom compose service names as `local-tcp`, or only loopback / `127.0.0.1` / `localhost`?
- When production Neon rotates to a new endpoint id, is updating `FORBIDDEN_NEON_ENDPOINT_IDS` acceptable operational overhead, or should we match on a Vercel project slug if one becomes available in env?
- Does `prisma.config.ts` importing `target.server.ts` (marked `server-only`) cause Prisma CLI friction, and if so should guard logic move to a tiny `target.ts` shared module without the directive?
- Existing `office-hub-dev-pg` on port `5433` may predate compose naming — should `db:local:init` detect port conflict and print reuse instructions instead of failing?

## Next implementation step

Add `forbidden-endpoints.ts`, `target.server.ts`, and `create-client.server.ts`; wire `index.server.ts` and `prisma.config.ts` to the guard; add `docker-compose.dev.yml`, dependencies, and `db:local:init` script on a branch from `feat/always-use-api`.
