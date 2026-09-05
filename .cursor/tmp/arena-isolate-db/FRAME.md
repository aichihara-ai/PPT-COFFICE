# Arena frame: isolate local Office Hub from production Neon

## Artifact

One candidate design package per runner:

- `design.md` (usage first, then type sketch, signatures, module map, mermaid)
- `rationale.md` shaped exactly like `skills/architect/references/rationale-template.md`

Do not edit application source. Write only under your assigned output directory.

## Grounding

Read these, do not re-explore from scratch:

- `/Users/andrewichihara/Developer/PPTVCOFFICE/.cursor/tmp/how-db-connection.md`
- `/Users/andrewichihara/Developer/PPTVCOFFICE/src/shared/db/index.server.ts`
- `/Users/andrewichihara/Developer/PPTVCOFFICE/prisma.config.ts`

## Observed facts (2026-09-05)

- Local `.env.local` `DATABASE_URL` host is `ep-long-breeze-awuok4go-pooler.c-12.us-east-1.aws.neon.tech` (production / shared Neon). Do not print the full URL or password.
- Prisma runtime is `PrismaNeon` only. No `@prisma/adapter-pg` yet.
- No `NEON_API_KEY`. `neonctl` is not logged in. Creating a Neon branch from this agent is blocked.
- Docker Desktop is running. A throwaway container `office-hub-dev-pg` already listens on host port `5433` (`office` / `office` / `office_hub`). That container is ops, not a locked design.
- Seed is `POST /api/setup`, not `prisma db seed`.
- Main checkout has unrelated dirty kitchen/auth WIP. Durable code belongs on a stacked branch from `feat/always-use-api` at `.worktrees/always-use-api`.
- `.env.local` is gitignored and the worktree file is a symlink to the main checkout file. One writer only.

## Whole-shape alternatives (pick one, go deep)

1. **Neon branch.** Keep `PrismaNeon`. Isolation is a different Neon endpoint in `.env.local` plus a structural prod-host guard. Docs tell the human how to mint the branch. Agent cannot mint it today.
2. **Local Postgres.** `docker-compose` + `@prisma/adapter-pg` + prod-host guard. Isolation is a TCP host the agent can stand up now.

Pick exactly one whole shape. Do not hedge with a dual-adapter "works either way" megadesign unless that dual parse is the load-bearing domain type and the public surface stays one function.

## Rubric (candidates do not grade themselves)

1. Local `next dev` cannot write to the known production Neon host unless an explicit dangerous override is set.
2. A future `vercel env pull` cannot silently re-arm production as the local database.
3. Fresh-clone setup is one obvious path (compose up + migrate + setup, or paste a Neon branch URL + migrate + setup).
4. Public surface stays small. Callers keep importing `prisma`. No new persistence port, no client-visible mode flag.
5. Invalid connection targets are unrepresentable or fail at the env/adapter boundary, not deep in route handlers.
6. Diff stays small. No kitchen-wishlist or demo-mode leftover work.

## Named data shape

The domain is the database target. Encode it as a discriminated structure parsed once from `DATABASE_URL` at the Prisma construction boundary. Do not scatter `if (host.includes("neon"))` across files.

## Invariants

- Never migrate or `POST /api/setup` against the current production host.
- Do not delete production data.
- Do not put secrets in committed files. Host allowlists / forbidden endpoint ids are fine.
