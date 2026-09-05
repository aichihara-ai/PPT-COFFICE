# Cross-judge verdict

## Scores

### Candidate 1 — Neon branch isolation: 10/12

1. **2/2 — Local production-write guard.** The known endpoint id is rejected for every non-Vercel process unless `ALLOW_PRODUCTION_DATABASE === "1"`.
2. **2/2 — Pull hardening.** The supported pull command writes `.env.vercel`, which neither Next nor Prisma loads, and a bare pull is backed by the endpoint guard.
3. **0/2 — Fresh-clone completion today.** The path is clear for a human, but the agent cannot mint or obtain the required Neon branch URL with the available credentials.
4. **2/2 — Small public surface.** Application callers retain the single `prisma` export; the target resolver is confined to construction and Prisma CLI configuration.
5. **2/2 — Boundary failure.** URL classification and rejection occur before adapter construction and are reused by `prisma.config.ts`; routes remain unchanged.
6. **2/2 — Small diff.** One target module, its test, two wiring points, and limited docs/scripts preserve the existing adapter and avoid operational machinery.

### Candidate 2 — Local Postgres: 9/12

1. **2/2 — Local production-write guard.** The known endpoint is classified and rejected before client construction unless the dangerous override is explicitly true.
2. **2/2 — Pull hardening.** A pulled production URL causes a loud boundary failure and the design provides an explicit local reset path.
3. **2/2 — Fresh-clone completion today.** Docker, migration, development startup, and setup are an obvious path requiring no Neon credentials.
4. **2/2 — Small public surface.** The adapter fork stays internal and callers continue importing `prisma`, with no persistence port or client mode flag.
5. **1/2 — Boundary intent with a CLI defect.** Classification is correctly centralized, but importing a module marked `server-only` from `prisma.config.ts` is unsafe outside Next and can make the CLI fail for the wrong reason.
6. **0/2 — Diff is not small.** Two dependencies, compose, two scripts, four database modules, package changes, and docs are substantially broader than necessary; the env-patching script especially duplicates a one-line setup action.

## Recommended base

**Candidate 2.** Its local-Postgres whole shape uniquely satisfies the decisive “agent can complete today” requirement. Use it as the architectural base, then collapse its module/script footprint and fix the Prisma CLI import boundary before implementation. Candidate 1 scores higher on elegance but cannot produce a writable isolated database in the stated environment.

## Five graft/reject notes

1. **Graft from candidate 1:** add `npm run env:pull` targeting `.env.vercel`; retain the structural guard as the backstop for bare pulls.
2. **Graft from candidate 1:** put target parsing, forbidden endpoint ids, policy, and typed errors in one CLI-safe `database-target.ts`; do not mark that shared module `server-only`.
3. **Keep from candidate 2:** local Postgres plus internal `PrismaPg`/`PrismaNeon` selection, because this is the only self-service fresh-clone path today.
4. **Reject from candidate 2:** omit `scripts/env-use-local-db.mjs`; the committed `.env.example` local URL and safe pull destination are enough, and removing it shrinks mutation risk and diff size.
5. **Reject candidate 1 as the base:** a human-pasted Neon branch URL is an unresolved external prerequisite, so its otherwise cleaner design fails the explicit completion constraint.
