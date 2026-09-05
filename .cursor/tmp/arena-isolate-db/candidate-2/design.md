# Candidate 2: Local Postgres via Docker + TCP adapter

Whole shape: **Local Postgres.** Isolation is a TCP database the agent can stand up today (`docker compose` on host port `5433`). Runtime selects `@prisma/adapter-pg` for local TCP targets and keeps `PrismaNeon` only for non-forbidden remote Neon URLs (Vercel deploy). A single parse of `DATABASE_URL` into `DatabaseTarget` drives adapter choice and the production-host guard. Callers keep importing `prisma` unchanged.

---

## Usage (caller's view)

### README quickstart (fresh clone)

```bash
# 1. Start throwaway Postgres (matches docker-compose.dev.yml)
docker compose -f docker-compose.dev.yml up -d

# 2. Point local secrets at TCP — not Neon
cp .env.example .env.local
# edit JWT_SECRET, SETUP_SECRET, ADMIN_PASSWORD
# DATABASE_URL=postgresql://office:office@127.0.0.1:5433/office_hub

# 3. Schema + seed
npm run db:migrate
npm run dev
curl -X POST http://localhost:3000/api/setup \
  -H "x-setup-secret: $SETUP_SECRET"

# 4. Work in API mode against localhost only
# NEXT_PUBLIC_USE_API=true
```

One npm alias wraps steps 1–3 for humans who skip reading compose:

```bash
npm run db:local:init   # compose up, wait for pg_isready, migrate deploy
```

### After `vercel env pull`

`vercel env pull` rewrites `.env.local` with production `DATABASE_URL`. The guard fails the next `next dev` or `db:migrate` unless you either reset `DATABASE_URL` to the local TCP string above or set `ALLOW_PRODUCTION_DATABASE=true` (explicit dangerous override).

Optional recovery without hand-editing:

```bash
npm run env:use-local-db   # patches only DATABASE_URL in .env.local
```

### Call site 1 — route handler (unchanged)

```typescript
import { prisma } from "@/shared/db/index.server"

export async function listBookings() {
  return prisma.booking.findMany({ orderBy: { startTime: "asc" } })
}
```

No import path change. No mode flag. No persistence port.

### Call site 2 — auth helper (unchanged)

```typescript
import { prisma } from "@/shared/db/index.server"

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}
```

### Call site 3 — Prisma CLI (unchanged command, shared guard)

```bash
npm run db:migrate   # prisma migrate deploy
```

`prisma.config.ts` loads the same env files and runs the same `assertDevelopmentSafe` before Prisma reads the datasource URL, so migrate cannot silently hit production Neon during local work.

---

## Module map

| Module | Owns | Public? |
| --- | --- | --- |
| `src/shared/db/index.server.ts` | Singleton `prisma` export | yes (`prisma` only) |
| `src/shared/db/target.server.ts` | `DatabaseTarget` parse + dev guard | no |
| `src/shared/db/forbidden-endpoints.ts` | Committed production endpoint ids | no |
| `src/shared/db/create-client.server.ts` | Adapter selection → `PrismaClient` | no |
| `prisma.config.ts` | CLI env load + guard hook | config only |
| `docker-compose.dev.yml` | Local Postgres service | ops |
| `scripts/dev-db.mjs` | `db:local:init` compose/wait/migrate | ops |
| `scripts/env-use-local-db.mjs` | Patch `.env.local` `DATABASE_URL` | ops |
| `.env.example` | Local TCP template URL | docs |
| `package.json` | `@prisma/adapter-pg`, `pg`, npm scripts | deps |

Route handlers, auth, setup — **no edits**. All policy lives behind `createPrismaClient()`.

---

## Data flow

```mermaid
flowchart TD
  Env[".env.local DATABASE_URL"] --> Parse["parseDatabaseTarget()"]
  Parse --> Target{"DatabaseTarget.kind"}
  Target -->|"local-tcp"| Guard["assertDevelopmentSafe()"]
  Target -->|"neon-serverless"| Guard
  Target -->|"forbidden-neon"| Guard
  Guard -->|"dev + forbidden<br/>no ALLOW_PRODUCTION_DATABASE"| Fail["throw with local reset instructions"]
  Guard -->|"ok"| Adapter{"select adapter"}
  Adapter -->|"local-tcp"| Pg["PrismaPg + pg.Pool"]
  Adapter -->|"neon-serverless"| Neon["PrismaNeon"]
  Pg --> Client["PrismaClient"]
  Neon --> Client
  Client --> Export["export const prisma"]
  Export --> Routes["api-routes / auth / setup"]
  PrismaCfg["prisma.config.ts"] --> Parse
```

---

## Type sketch

```typescript
// src/shared/db/forbidden-endpoints.ts
/** Neon compute endpoint ids (host prefix), not secrets. Extend when prod host rotates. */
export const FORBIDDEN_NEON_ENDPOINT_IDS = [
  "ep-long-breeze-awuok4go",
] as const

export type ForbiddenNeonEndpointId = (typeof FORBIDDEN_NEON_ENDPOINT_IDS)[number]
```

```typescript
// src/shared/db/target.server.ts
import "server-only"

import type { ForbiddenNeonEndpointId } from "./forbidden-endpoints"

/** Parsed once at Prisma construction / CLI load. No stringly host checks elsewhere. */
export type DatabaseTarget =
  | {
      kind: "local-tcp"
      connectionString: string
      host: string
      port: number
      database: string
    }
  | {
      kind: "neon-serverless"
      connectionString: string
      host: string
      endpointId: string
    }
  | {
      kind: "forbidden-neon"
      connectionString: string
      host: string
      endpointId: ForbiddenNeonEndpointId
    }

export type DevelopmentSafetyPolicy = {
  /** true on Vercel production/preview runtime, false for local next dev + Prisma CLI on laptop */
  isDeployedRuntime: boolean
  /** explicit escape hatch; never set in committed files */
  allowProductionDatabase: boolean
}

export function readDatabaseUrlFromEnv(): string {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }
  return connectionString
}

/** Classify host: localhost / loopback / docker-bridge → local-tcp; *.neon.tech → neon or forbidden. */
export function parseDatabaseTarget(connectionString: string): DatabaseTarget {
  // TODO: normalize postgresql:// and postgres:// via URL + searchParams (schema, sslmode)
  // TODO: extract Neon endpoint id as first label of host (before .c-NN or -pooler)
  // TODO: match endpoint id against FORBIDDEN_NEON_ENDPOINT_IDS
  throw new Error("not implemented")
}

export function assertDevelopmentSafe(
  target: DatabaseTarget,
  policy: DevelopmentSafetyPolicy,
): void {
  if (target.kind !== "forbidden-neon") return
  if (policy.isDeployedRuntime) return
  if (policy.allowProductionDatabase) return
  throw new Error("not implemented") // message names npm run env:use-local-db + ALLOW_PRODUCTION_DATABASE
}

export function resolveDevelopmentSafetyPolicy(): DevelopmentSafetyPolicy {
  return {
    isDeployedRuntime:
      process.env.VERCEL === "1" &&
      (process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview"),
    allowProductionDatabase: process.env.ALLOW_PRODUCTION_DATABASE === "true",
  }
}
```

```typescript
// src/shared/db/create-client.server.ts
import "server-only"

import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

import { PrismaClient } from "../../../generated/prisma/client"

import {
  assertDevelopmentSafe,
  parseDatabaseTarget,
  readDatabaseUrlFromEnv,
  resolveDevelopmentSafetyPolicy,
  type DatabaseTarget,
} from "./target.server"

function createAdapter(target: DatabaseTarget) {
  switch (target.kind) {
    case "local-tcp": {
      const pool = new Pool({ connectionString: target.connectionString })
      return new PrismaPg(pool)
    }
    case "neon-serverless":
    case "forbidden-neon": {
      // forbidden-neon only reachable after assertDevelopmentSafe passes (override or deployed)
      return new PrismaNeon({ connectionString: target.connectionString })
    }
    default: {
      const _exhaustive: never = target
      return _exhaustive
    }
  }
}

export function createPrismaClient(): PrismaClient {
  const connectionString = readDatabaseUrlFromEnv()
  const target = parseDatabaseTarget(connectionString)
  const policy = resolveDevelopmentSafetyPolicy()

  assertDevelopmentSafe(target, policy)

  const adapter = createAdapter(target)
  return new PrismaClient({ adapter })
}
```

```typescript
// src/shared/db/index.server.ts
import "server-only"

import { createPrismaClient } from "./create-client.server"

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

```typescript
// prisma.config.ts
import { loadEnvConfig } from "@next/env"
import { defineConfig } from "prisma/config"

import {
  assertDevelopmentSafe,
  parseDatabaseTarget,
  readDatabaseUrlFromEnv,
  resolveDevelopmentSafetyPolicy,
} from "./src/shared/db/target.server"

loadEnvConfig(process.cwd())

const target = parseDatabaseTarget(readDatabaseUrlFromEnv())
assertDevelopmentSafe(target, resolveDevelopmentSafetyPolicy())

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
```

```yaml
# docker-compose.dev.yml
services:
  postgres:
    image: postgres:16-alpine
    container_name: office-hub-dev-pg
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: office
      POSTGRES_PASSWORD: office
      POSTGRES_DB: office_hub
    volumes:
      - office-hub-dev-pg-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U office -d office_hub"]
      interval: 2s
      timeout: 5s
      retries: 15

volumes:
  office-hub-dev-pg-data:
```

```javascript
// scripts/dev-db.mjs — invoked by npm run db:local:init
export async function main() {
  // TODO: docker compose -f docker-compose.dev.yml up -d
  // TODO: loop pg_isready against 127.0.0.1:5433
  // TODO: spawn npm run db:migrate (inherit env)
  throw new Error("not implemented")
}
```

```javascript
// scripts/env-use-local-db.mjs — invoked by npm run env:use-local-db
const LOCAL_DATABASE_URL =
  "postgresql://office:office@127.0.0.1:5433/office_hub"

export async function main() {
  // TODO: read .env.local, replace or append DATABASE_URL= line only
  // TODO: do not touch POSTGRES_* / PGHOST* (document they are inert to app)
  throw new Error("not implemented")
}
```

### `package.json` script additions (sketch)

```json
{
  "scripts": {
    "db:local:init": "node scripts/dev-db.mjs",
    "env:use-local-db": "node scripts/env-use-local-db.mjs"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7.x",
    "pg": "^8.x"
  }
}
```

### `.env.example` addition (sketch)

```bash
# Local dev (docker compose -f docker-compose.dev.yml up -d)
DATABASE_URL=postgresql://office:office@127.0.0.1:5433/office_hub

# Dangerous: allow known production Neon host during local next dev / migrate
# ALLOW_PRODUCTION_DATABASE=true
```

---

## Invariants encoded

| Invariant | Where |
| --- | --- |
| Production Neon endpoint unwritable from laptop dev | `forbidden-neon` + `assertDevelopmentSafe` |
| Parse URL once; no scattered host checks | `parseDatabaseTarget` only |
| Callers unchanged | `index.server.ts` exports `prisma` only |
| CLI and runtime share guard | `prisma.config.ts` imports `target.server.ts` |
| Invalid prod target fails at boundary | throw before `PrismaClient` construction |
| Deployed Vercel still uses Neon serverless | `isDeployedRuntime` bypasses dev guard |
| Idempotent local bring-up | compose + `migrate deploy` + setup upsert |

## Deliberately out of scope

- Reading Vercel `POSTGRES_*` / `PGHOST*` in application code (remain inert; docs warn humans).
- Neon branch minting (`neonctl`, `NEON_API_KEY`) — different whole shape.
- Auto-seeding on boot (would hide forgotten `POST /api/setup`).
- Client-visible database mode or persistence port abstraction.
- Replacing existing `office-hub-dev-pg` container if already running on `5433` (compose is idempotent).
