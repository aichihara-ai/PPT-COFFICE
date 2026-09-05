# Candidate 1: Neon branch isolation

**Whole shape:** keep `PrismaNeon`. Local isolation is a different Neon endpoint in `.env.local`, plus one parse of `DATABASE_URL` that makes the current production endpoint unrepresentable in a local process.

Application callers keep `import { prisma } from "@/shared/db/index.server"`. There is no persistence port, no adapter switch, no client-visible mode flag, and no `if (host.includes("neon"))` outside the parse module.

---

## Usage (caller's view)

Usage is the spec. Types below are derived from these call sites.

### README quickstart (local)

```md
## Local database (Neon branch)

Local `next dev`, `prisma migrate deploy`, and `POST /api/setup` must not
use the production Neon endpoint. Isolation is a Neon *branch* URL, not
Docker and not a second adapter.

1. In the Neon console, open the production project → Branches →
   Create branch (from the production / main branch). Copy the *pooled*
   connection string.

2. Put that string in `.env.local` as `DATABASE_URL` (same file as
   `JWT_SECRET`, `SETUP_SECRET`, `ADMIN_*`). Restart anything already
   running — the Prisma singleton is built once per process.

3. `npm run db:migrate`

4. `npm run dev`

5. First time on this branch (or to re-upsert coffee/milk, HR, lunch pool):

   curl -X POST http://localhost:3000/api/setup \
     -H "x-setup-secret: $SETUP_SECRET"

`POST /api/setup` upserts into whatever `DATABASE_URL` the running server
has, including resetting the HR password to `ADMIN_PASSWORD`. Never point
that at production.

If you run `vercel env pull`, use `npm run env:pull`. That writes
`.env.vercel`, which Next and Prisma do not load. Bare `vercel env pull`
overwrites `.env.local` with production; the next local boot then throws
instead of writing production.
```

The agent cannot mint the branch today (`NEON_API_KEY` / `neonctl` are absent). The human pastes the URL. After that, callers do not mention branches, hosts, or adapters.

### Call site 1 — route handler (unchanged)

```typescript
import { prisma } from "@/shared/db/index.server"

export async function GET() {
    const rows = await prisma.suggestion.findMany()
    return Response.json({ suggestions: rows })
}
```

No target enum, no `getPrisma("local")`, no `isIsolated`. First import of this module is the boundary: a forbidden local URL throws before a query runs.

### Call site 2 — Prisma CLI (`prisma.config.ts`)

```typescript
import { loadEnvConfig } from "@next/env"
import { defineConfig } from "prisma/config"

import { resolveDatabaseTarget } from "./src/shared/db/database-target"

loadEnvConfig(process.cwd())

const target = resolveDatabaseTarget(process.env)

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: target.connectionString,
    },
})
```

`npm run db:migrate` therefore fails on the production endpoint in a local process *before* Prisma opens a connection. The setup route does not grow its own host check; it imports `prisma` and inherits the same throw.

### Call site 3 — construction + tests (the only new callers)

```typescript
// src/shared/db/index.server.ts — private factory, same export
const target = resolveDatabaseTarget(process.env)
const adapter = new PrismaNeon({ connectionString: target.connectionString })
return new PrismaClient({ adapter })

// src/shared/db/database-target.test.ts
resolveDatabaseTarget({
    DATABASE_URL: "postgresql://u:p@ep-other-branch-pooler.neon.tech/neondb",
})
// → { kind: "isolated-neon", endpointId: "ep-other-branch", ... }

resolveDatabaseTarget({
    DATABASE_URL:
        "postgresql://u:p@ep-long-breeze-awuok4go-pooler.c-12.us-east-1.aws.neon.tech/neondb",
})
// → throws BlockedProductionDatabaseError

resolveDatabaseTarget({
    DATABASE_URL: "postgresql://office:office@127.0.0.1:5433/office_hub",
})
// → throws UnsupportedDatabaseTargetError (this shape is Neon-only)
```

---

## Types

The domain is the database target. Parsed once. A local process cannot hold a production target unless the override token is present. Localhost / non-Neon URLs are not a target kind.

```typescript
/** First Neon hostname label, `-pooler` stripped. Example: `ep-long-breeze-awuok4go`. */
export type NeonEndpointId = string

/**
 * Allowed destinations after parse.
 * `blocked` is not a kind — that state throws.
 */
export type DatabaseTarget =
    | {
          readonly kind: "isolated-neon"
          readonly host: string
          readonly endpointId: NeonEndpointId
          readonly connectionString: string
      }
    | {
          readonly kind: "production-neon"
          readonly host: string
          readonly endpointId: NeonEndpointId
          readonly connectionString: string
      }

/** Known production / shared sandbox. Not a secret. Covers pooler and direct hosts. */
export const FORBIDDEN_NEON_ENDPOINT_IDS: readonly NeonEndpointId[] = [
    "ep-long-breeze-awuok4go",
]

/** Local process hit the forbidden endpoint without an explicit override. */
export class BlockedProductionDatabaseError extends Error {}

/** Missing, unparsable, or password-bearing string we refuse to echo. */
export class InvalidDatabaseUrlError extends Error {}

/** Non-Neon host (localhost, Docker TCP, arbitrary RDS). This shape does not represent them. */
export class UnsupportedDatabaseTargetError extends Error {}
```

Private to the same module (not exported — exporting them would leak staging):

```typescript
type ProcessRole =
    | { readonly kind: "vercel-runtime" } // process.env.VERCEL === "1"
    | { readonly kind: "local-process" }

type ProdWriteOverride =
    | { readonly kind: "denied" }
    | { readonly kind: "explicit" } // ALLOW_PRODUCTION_DATABASE === "1" exactly
```

`NODE_ENV=production` is **not** a role. Local `next start` / verify builds stay `local-process`. `VERCEL_ENV` is **not** a role: `vercel env pull` can write it into `.env.local`.

---

## Signatures

```typescript
/**
 * Single env/adapter boundary.
 * Reads DATABASE_URL, VERCEL, ALLOW_PRODUCTION_DATABASE.
 * Throws rather than returning a forbidden target.
 */
export function resolveDatabaseTarget(env: NodeJS.ProcessEnv): DatabaseTarget {
    throw new Error("not implemented")
}

// --- private ---

function parseNeonUrl(raw: string): {
    host: string
    endpointId: NeonEndpointId
    connectionString: string
} {
    throw new Error("not implemented")
    // TODO: URL.parse; never include raw in thrown messages (password).
    // TODO: host must end with `.neon.tech` or throw UnsupportedDatabaseTargetError.
    // TODO: endpointId = first label with trailing `-pooler` stripped.
}

function processRole(env: NodeJS.ProcessEnv): ProcessRole {
    throw new Error("not implemented")
    // TODO: env.VERCEL === "1" → vercel-runtime, else local-process.
}

function prodWriteOverride(env: NodeJS.ProcessEnv): ProdWriteOverride {
    throw new Error("not implemented")
    // TODO: env.ALLOW_PRODUCTION_DATABASE === "1" → explicit, else denied.
}

function createPrismaClient(): PrismaClient {
    throw new Error("not implemented")
    // TODO: resolveDatabaseTarget(process.env) then PrismaNeon + PrismaClient.
    // Same singleton / globalThis HMR cache as today. Do not export this function.
}
```

Callers of `prisma` never see these helpers. `prisma.config.ts` calls only `resolveDatabaseTarget`. Do not add `createPrismaAdapter` — `new PrismaNeon({ connectionString })` inline is not a layer.

---

## Resolve table (invariants encoded here)

| `DATABASE_URL` host | Role | Override | Result |
| --- | --- | --- | --- |
| Forbidden endpoint (`ep-long-breeze-awuok4go`, pooler or direct) | `local-process` | denied | throw `BlockedProductionDatabaseError` |
| Forbidden endpoint | `local-process` | `ALLOW_PRODUCTION_DATABASE=1` | `{ kind: "production-neon" }` |
| Forbidden endpoint | `vercel-runtime` | any | `{ kind: "production-neon" }` |
| Other `*.neon.tech` | any | any | `{ kind: "isolated-neon" }` |
| `127.0.0.1` / `localhost` / non-Neon | any | any | throw `UnsupportedDatabaseTargetError` |
| Missing / invalid URL | any | any | throw `InvalidDatabaseUrlError` |

Missing `DATABASE_URL` stays a construction error, same as today, but typed.

`POST /api/setup` and `prisma migrate deploy` against the current production host are impossible from a local process without the override: both go through this table.

---

## Module map

Keep the parse next to the client. Do not split load / validate / save files.

| Path | Owns |
| --- | --- |
| `src/shared/db/database-target.ts` | `DatabaseTarget`, forbidden endpoint ids, `resolveDatabaseTarget`, the three errors |
| `src/shared/db/database-target.test.ts` | Table above (host, role, override) |
| `src/shared/db/index.server.ts` | `server-only` singleton; `export const prisma` only |
| `prisma.config.ts` | `loadEnvConfig` + `resolveDatabaseTarget` + datasource URL |
| `package.json` | `"env:pull": "vercel env pull .env.vercel"`; add the new test file to `"test"` |
| `.env.example` | Comment: branch URL, not production; point at `npm run env:pull` |
| `README.md` | The quickstart above |
| `docs/next-prisma-fsd.md` | One paragraph: isolation is a Neon branch + this parse, not a mode flag |

Do not touch kitchen, auth WIP, demo flags, `app/api/*/route.ts` wrappers, or setup handler bodies. Durable fill-in belongs on a stacked branch from `feat/always-use-api`.

`.env.local` stays gitignored. The worktree file is a symlink to the main checkout file — one writer. No secrets in committed files. The endpoint id list is fine to commit.

---

## Data flow

```mermaid
flowchart TD
  Env["process.env DATABASE_URL"] --> Resolve["resolveDatabaseTarget"]
  Vercel["VERCEL === 1 ?"] --> Resolve
  Override["ALLOW_PRODUCTION_DATABASE === 1 ?"] --> Resolve
  Resolve --> Parsed{"Target kind"}
  Parsed -->|"isolated-neon"| Adapter["PrismaNeon"]
  Parsed -->|"production-neon<br/>Vercel or explicit override"| Adapter
  Resolve -->|"local + forbidden endpoint"| Block["BlockedProductionDatabaseError"]
  Resolve -->|"localhost / non-Neon"| Unsup["UnsupportedDatabaseTargetError"]
  Adapter --> Singleton["export const prisma"]
  Singleton --> Routes["api-routes and auth<br/>import prisma"]
  Resolve --> Cfg["prisma.config.ts"]
  Cfg --> Migrate["npm run db:migrate"]
  Pull["npm run env:pull"] --> Unused[".env.vercel<br/>not on Next cascade"]
  BarePull["bare vercel env pull"] --> LocalEnv[".env.local overwritten"]
  LocalEnv --> Resolve
```

```mermaid
flowchart LR
  subgraph Public["Public surface"]
    Prisma["prisma"]
    ResolveFn["resolveDatabaseTarget<br/>CLI / tests only"]
  end
  subgraph Hidden["Hidden in database-target"]
    Ids["FORBIDDEN_NEON_ENDPOINT_IDS"]
    Role["ProcessRole from VERCEL"]
    Token["override token"]
    Parse["Neon URL / endpoint id"]
  end
  ResolveFn --> Ids & Role & Token & Parse
  Prisma --> ResolveFn
```

---

## What this system does not do

- Does not add `@prisma/adapter-pg` or `docker-compose`. The existing `office-hub-dev-pg` container is ops, not a target kind.
- Does not mint Neon branches (`neonctl` / `NEON_API_KEY` are blocked).
- Does not read `POSTGRES_*`, `PG*`, `DATABASE_URL_UNPOOLED`, or `VERCEL_OIDC_TOKEN`. Wrong-key copies still fail if they land in `DATABASE_URL` and host the forbidden endpoint.
- Does not put a host check in `setup/index.ts` or route handlers.
- Does not treat `NEXT_PUBLIC_USE_API=false` as isolation (demo / CLI still hit `DATABASE_URL` if those paths exist).
- Does not isolate Vercel preview from production Neon. `VERCEL=1` may still use the production endpoint. That is a different problem.
- Does not log or throw the raw connection string.
- Does not delete production data.

---

## Interface depth

Application public surface is unchanged: one `prisma` export. CLI adds one function.

Hidden behind that: Neon hostname grammar, the committed production endpoint id, Vercel-vs-local role, the dangerous override, adapter construction, and the refusal to represent Docker TCP.

Exposed on purpose: you must paste a Neon branch URL. That is the isolation product, not an implementation detail.

---

## Ops notes that are not types

- Changing `.env.local` without restarting leaves `globalThis.prisma` on the old target.
- A branch copied from production already has schema and `_prisma_migrations`. `db:migrate` should be a no-op if current; `0_init` + `migrate resolve` is the empty-database path, not the branch path.
- Never set `ALLOW_PRODUCTION_DATABASE` on the Vercel project. If it is pulled into `.env.local`, a local process would be allowed to write production.
