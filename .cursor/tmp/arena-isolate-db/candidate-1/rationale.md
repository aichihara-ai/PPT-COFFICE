# Rationale — Neon branch isolation

## Problem

Local Office Hub already talks to Postgres through one wire: `DATABASE_URL` → `PrismaNeon` in `src/shared/db/index.server.ts`, with the same Next env cascade feeding `prisma.config.ts`. That wire currently points at the production Neon endpoint (`ep-long-breeze-awuok4go`), so `next dev`, `db:migrate`, and `POST /api/setup` are production writes. Isolation cannot be a second persistence port or a client mode flag — callers must keep importing `prisma`, and `isApiMode` does not choose a database. The agent cannot mint a Neon branch (`NEON_API_KEY` / `neonctl` absent). `vercel env pull` rewrites the gitignored `.env.local` (a symlink shared with the worktree). Docker Postgres exists as throwaway ops but the runtime adapter is Neon-only. The non-obvious part is encoding “this process may not use that endpoint” as a parsed target at the construction boundary, without scattering host checks or adding an adapter choice.

## Usage (caller's view)

The human creates a Neon branch in the console, pastes the pooled URL into `.env.local` as `DATABASE_URL`, then `npm run db:migrate`, `npm run dev`, and optionally `POST /api/setup`. Pulls go to `.env.vercel` via `npm run env:pull` so Next never loads them.

Route handlers stay `import { prisma } from "@/shared/db/index.server"` and call `prisma.*`. They do not receive a target or mode.

`prisma.config.ts` is the second caller: `resolveDatabaseTarget(process.env)` then `defineConfig({ datasource: { url: target.connectionString } })`. Migrate fails on the production endpoint locally before a connection opens.

Tests and the private `createPrismaClient` are the only other callers of `resolveDatabaseTarget`. A production host in a local process throws `BlockedProductionDatabaseError`; `postgresql://…@127.0.0.1` throws `UnsupportedDatabaseTargetError`.

## Shape

Data structure first: `DatabaseTarget` is `isolated-neon | production-neon`. Blocked is not a variant — `resolveDatabaseTarget` throws, so a local process cannot hold the production endpoint without `ALLOW_PRODUCTION_DATABASE=1`. Host classification uses a committed Neon endpoint id (`ep-long-breeze-awuok4go`), not `host.includes("neon")` and not an exact pooler hostname, so unpooled and pooler forms stay one invariant (`encode-lessons-in-structure`, `single source of truth`).

Process role is `VERCEL === "1"` versus everything else. `NODE_ENV` and `VERCEL_ENV` are ignored so local `next start` stays guarded and a pulled `VERCEL_ENV=production` cannot impersonate the platform (`boundary-discipline`). Validation lives only in `resolveDatabaseTarget`. `index.server.ts` and `prisma.config.ts` both call it; setup and routes do not grow a second check (`short call chains`).

Adapter stays `PrismaNeon` inline. No `createPrismaAdapter` pass-through. Non-Neon URLs are unrepresentable in this shape — the discarded alternative is Local Postgres, not a second kind on the same union (`interface depth`: one function, Neon-only policy hidden behind it).

Pull hardening is a file Next does not load (`.env.vercel`), plus the throw as backstop. That is ops convention plus the type guard; it is not a second database profile.

Deliberately not done: `@prisma/adapter-pg`, compose, neonctl automation, reading `POSTGRES_*`, host checks in `/api/setup`, isolating Vercel preview from production.

**Interface depth.** Callers keep one import. The parse hides endpoint grammar, the forbidden id, role, override, and Neon-only refusal. What remains exposed is “paste a Neon branch URL” — that is the product. A richer public surface (`DatabaseMode`, dual adapter, `getDb("local")`) would teach callers the implementation.

## Synthesis decision

Filled by arena.

## Tradeoffs accepted

- We accept a human-minted Neon branch (agent cannot create it today) in exchange for keeping `PrismaNeon` and a one-file parse instead of an adapter + compose stack.
- We accept that Vercel preview may still share the production endpoint in exchange for not inventing a deploy-time branching policy this change does not own.
- We accept `ALLOW_PRODUCTION_DATABASE=1` as an escape hatch in exchange for not making emergency prod inspection a type you can construct by accident.
- We accept documenting `npm run env:pull` → `.env.vercel` rather than fighting Next’s `.env.development.local` override order, in exchange for a pull target that cannot win the cascade if someone forgets `NODE_ENV`.
- We accept throwing on localhost URLs in exchange for not representing a TCP adapter we are not adding (`PrismaNeon ≠ local Postgres`).
- We accept one writer on the symlinked `.env.local` in exchange for not copying secrets into the worktree.

## Alternatives considered

- **Local Postgres (`docker-compose` + `@prisma/adapter-pg`).** Isolation the agent can stand up now, and a container already listens on 5433. Lost: it forces a second adapter onto the construction boundary and a compose path into fresh-clone. The public surface stays `prisma` either way, but callers and docs must then learn “Neon on Vercel, TCP locally.” That leaks adapter choice. This shape hides more by refusing TCP as a target. (Dual-adapter “works either way” is the same alternative unless the union’s only job is parse-then-one-factory; FRAME forbids hedging that into a megadesign.)
- **Env-only cutover, no parse/guard.** Smallest diff: paste a branch URL and stop. Lost: `vercel env pull` silently re-arms production as the local database (rubric 2). The complexity it “hides” is none; every caller still depends on human memory.
- **Host check inside `POST /api/setup` and a migrate wrapper.** Looks like safety at the operations people fear. Lost: temporal decomposition and leakage — migrate, setup, and `next dev` would each re-encode the same forbidden id. Invalid targets would fail deep in handlers, not at the env/adapter boundary.
- **`.env.development.local` wins over pulled `.env.local`.** Uses Next’s lookup order as the shield. Lost: Prisma CLI’s `loadEnvConfig` depends on `NODE_ENV`; a migrate without `NODE_ENV=development` reads production again. The unused `.env.vercel` file is a shallower convention with a harder failure mode (file is not loaded at all).

## Open questions and risks

- Should `verify-office-hub` require an isolated branch URL, or keep the current “shared Neon, do not parallelize” warning until the human pastes one?
- If the production Neon project is replaced, who updates `FORBIDDEN_NEON_ENDPOINT_IDS` — and should a second id (unpooled / next gen) be added now?
- Is it acceptable that Vercel preview keeps writing the production endpoint, so “local is isolated” does not mean “non-prod is isolated”?
- Should `ALLOW_PRODUCTION_DATABASE` be rejected when present in a file that also contains a pulled production URL, so a careless pull + leftover override cannot combine?
- Fresh empty Neon (not a branch) still needs the `0_init` / `migrate resolve` dance — do we document that as unsupported, or as a footnote under the one branch path?

## Next implementation step

Add `src/shared/db/database-target.ts` with the types, forbidden endpoint id, `resolveDatabaseTarget`, and a table test; wire it into `createPrismaClient` and `prisma.config.ts` on a stacked branch from `feat/always-use-api`.
