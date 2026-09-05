# Synthesis: isolate local DB

## Base

Candidate 2 (local Postgres + TCP adapter). Isolation must complete in this session. Neon auth is absent. Docker Postgres on 5433 already runs.

## Grafts from candidate 1

- `npm run env:pull` writes `.env.vercel`. Next and Prisma do not load that file.
- Process role is `VERCEL === "1"` only. Ignore `NODE_ENV` and pulled `VERCEL_ENV`.
- `resolveDatabaseTarget` throws on a local process + forbidden endpoint. Do not return a `forbidden-neon` kind for callers to re-check.
- Named errors. Never echo the raw URL or password.
- Table tests in `database-target.test.ts`.
- One parse module (`database-target.ts`) without `server-only`, so `prisma.config.ts` can import it.

## Rejections

- Candidate 1 Neon-only shape. Agent cannot mint a branch. Localhost would throw.
- Candidate 2 four-file split (`forbidden-endpoints`, `target.server`, `create-client.server`, `index`). Collapse parse into one module. Keep `index.server.ts` as the singleton.
- Candidate 2 `isDeployedRuntime` via `VERCEL_ENV`. A pulled `.env.local` can impersonate production.
- Persistence port. Callers keep `prisma`.

## Public surface

`export const prisma` plus `resolveDatabaseTarget` for CLI and tests.

## Domain type

```ts
type DatabaseTarget =
  | { kind: "local-tcp"; host: string; port: number; connectionString: string }
  | { kind: "isolated-neon"; host: string; endpointId: string; connectionString: string }
  | { kind: "production-neon"; host: string; endpointId: string; connectionString: string }
```

`production-neon` only after `VERCEL=1` or `ALLOW_PRODUCTION_DATABASE=1`.

## Adapter

- `local-tcp` → `new PrismaPg({ connectionString })`
- neon kinds → `new PrismaNeon({ connectionString })`
