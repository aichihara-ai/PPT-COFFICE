import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
    BlockedProductionDatabaseError,
    InvalidDatabaseUrlError,
    UnsupportedDatabaseTargetError,
    resolveDatabaseTarget,
} from "./database-target.ts"

const FORBIDDEN_POOLER =
    "postgresql://u:secret@ep-long-breeze-awuok4go-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require"
const FORBIDDEN_DIRECT =
    "postgresql://u:secret@ep-long-breeze-awuok4go.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require"
const ISOLATED_NEON =
    "postgresql://u:secret@ep-other-branch-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require"
const LOCAL_TCP = "postgresql://office:office@127.0.0.1:5433/office_hub"

describe("resolveDatabaseTarget", () => {
    const cases = [
        {
            name: "forbidden pooler host on local process throws",
            env: { DATABASE_URL: FORBIDDEN_POOLER },
            expect: "blocked" as const,
        },
        {
            name: "forbidden direct host on local process throws",
            env: { DATABASE_URL: FORBIDDEN_DIRECT },
            expect: "blocked" as const,
        },
        {
            name: "forbidden host with ALLOW_PRODUCTION_DATABASE=1 returns production-neon",
            env: { DATABASE_URL: FORBIDDEN_POOLER, ALLOW_PRODUCTION_DATABASE: "1" },
            expect: { kind: "production-neon", endpointId: "ep-long-breeze-awuok4go" },
        },
        {
            name: "forbidden host on Vercel runtime returns production-neon",
            env: { DATABASE_URL: FORBIDDEN_POOLER, VERCEL: "1" },
            expect: { kind: "production-neon", endpointId: "ep-long-breeze-awuok4go" },
        },
        {
            name: "other neon host returns isolated-neon",
            env: { DATABASE_URL: ISOLATED_NEON },
            expect: { kind: "isolated-neon", endpointId: "ep-other-branch" },
        },
        {
            name: "other neon host on Vercel stays isolated-neon",
            env: { DATABASE_URL: ISOLATED_NEON, VERCEL: "1" },
            expect: { kind: "isolated-neon", endpointId: "ep-other-branch" },
        },
        {
            name: "127.0.0.1 returns local-tcp with port from URL",
            env: { DATABASE_URL: LOCAL_TCP },
            expect: { kind: "local-tcp", host: "127.0.0.1", port: 5433 },
        },
        {
            name: "localhost defaults port 5432",
            env: { DATABASE_URL: "postgresql://office:office@localhost/office_hub" },
            expect: { kind: "local-tcp", host: "localhost", port: 5432 },
        },
        {
            name: "missing DATABASE_URL throws InvalidDatabaseUrlError",
            env: {},
            expect: "invalid" as const,
        },
        {
            name: "non-neon remote host throws UnsupportedDatabaseTargetError",
            env: { DATABASE_URL: "postgresql://u:secret@db.example.com/app" },
            expect: "unsupported" as const,
        },
    ] as const

    for (const testCase of cases) {
        it(testCase.name, () => {
            if (testCase.expect === "blocked") {
                assert.throws(() => resolveDatabaseTarget(testCase.env), BlockedProductionDatabaseError)
                return
            }
            if (testCase.expect === "invalid") {
                assert.throws(() => resolveDatabaseTarget(testCase.env), InvalidDatabaseUrlError)
                return
            }
            if (testCase.expect === "unsupported") {
                assert.throws(() => resolveDatabaseTarget(testCase.env), UnsupportedDatabaseTargetError)
                return
            }

            const target = resolveDatabaseTarget(testCase.env)
            assert.equal(target.kind, testCase.expect.kind)
            if ("endpointId" in testCase.expect) {
                assert.equal(target.endpointId, testCase.expect.endpointId)
            }
            if ("host" in testCase.expect) {
                assert.equal(target.host, testCase.expect.host)
            }
            if ("port" in testCase.expect) {
                assert.equal(target.port, testCase.expect.port)
            }
        })
    }

    it("never echoes the raw connection string in BlockedProductionDatabaseError", () => {
        try {
            resolveDatabaseTarget({ DATABASE_URL: FORBIDDEN_POOLER })
            assert.fail("expected throw")
        } catch (error) {
            assert.ok(error instanceof BlockedProductionDatabaseError)
            assert.ok(!error.message.includes("secret"))
            assert.ok(!error.message.includes(FORBIDDEN_POOLER))
        }
    })

    it("ignores VERCEL_ENV and NODE_ENV so a pulled file cannot impersonate Vercel", () => {
        assert.throws(
            () =>
                resolveDatabaseTarget({
                    DATABASE_URL: FORBIDDEN_POOLER,
                    VERCEL_ENV: "production",
                    NODE_ENV: "production",
                }),
            BlockedProductionDatabaseError,
        )
    })

    it("does not treat ALLOW_PRODUCTION_DATABASE=true as the override", () => {
        assert.throws(
            () =>
                resolveDatabaseTarget({
                    DATABASE_URL: FORBIDDEN_POOLER,
                    ALLOW_PRODUCTION_DATABASE: "true",
                }),
            BlockedProductionDatabaseError,
        )
    })
})
