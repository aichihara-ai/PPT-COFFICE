export type DatabaseTarget =
    | {
          readonly kind: "local-tcp"
          readonly host: string
          readonly port: number
          readonly connectionString: string
      }
    | {
          readonly kind: "isolated-neon"
          readonly host: string
          readonly endpointId: string
          readonly connectionString: string
      }
    | {
          readonly kind: "production-neon"
          readonly host: string
          readonly endpointId: string
          readonly connectionString: string
      }

const FORBIDDEN_NEON_ENDPOINT_IDS = new Set(["ep-long-breeze-awuok4go"])

const LOCAL_TCP_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"])

export class BlockedProductionDatabaseError extends Error {
    constructor() {
        super(
            "DATABASE_URL points at the production Neon endpoint. Use the local Docker Postgres URL from .env.example, or set ALLOW_PRODUCTION_DATABASE=1 to override.",
        )
        this.name = "BlockedProductionDatabaseError"
    }
}

export class InvalidDatabaseUrlError extends Error {
    constructor(reason: string) {
        super(reason)
        this.name = "InvalidDatabaseUrlError"
    }
}

export class UnsupportedDatabaseTargetError extends Error {
    constructor(host: string) {
        super(`Unsupported database host "${host}". Use local TCP (127.0.0.1) or a Neon host (*.neon.tech).`)
        this.name = "UnsupportedDatabaseTargetError"
    }
}

function processRole(env: NodeJS.ProcessEnv): "vercel-runtime" | "local-process" {
    return env.VERCEL === "1" ? "vercel-runtime" : "local-process"
}

function prodWriteOverride(env: NodeJS.ProcessEnv): boolean {
    return env.ALLOW_PRODUCTION_DATABASE === "1"
}

function neonEndpointId(hostname: string): string {
    const firstLabel = hostname.split(".")[0] ?? hostname
    return firstLabel.endsWith("-pooler") ? firstLabel.slice(0, -"-pooler".length) : firstLabel
}

function parseConnectionUrl(raw: string): URL {
    let parsed: URL
    try {
        parsed = new URL(raw)
    } catch {
        throw new InvalidDatabaseUrlError("DATABASE_URL is not a valid URL")
    }

    if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
        throw new InvalidDatabaseUrlError("DATABASE_URL must use the postgresql or postgres scheme")
    }

    if (!parsed.hostname) {
        throw new InvalidDatabaseUrlError("DATABASE_URL is missing a hostname")
    }

    return parsed
}

function resolveNeonTarget(
    connectionString: string,
    hostname: string,
    env: NodeJS.ProcessEnv,
): DatabaseTarget {
    if (!hostname.endsWith(".neon.tech")) {
        throw new UnsupportedDatabaseTargetError(hostname)
    }

    const endpointId = neonEndpointId(hostname)
    const host = hostname
    const role = processRole(env)
    const override = prodWriteOverride(env)
    const forbidden = FORBIDDEN_NEON_ENDPOINT_IDS.has(endpointId)

    if (forbidden) {
        if (role === "local-process" && !override) {
            throw new BlockedProductionDatabaseError()
        }
        return { kind: "production-neon", host, endpointId, connectionString }
    }

    return { kind: "isolated-neon", host, endpointId, connectionString }
}

export function resolveDatabaseTarget(env: NodeJS.ProcessEnv): DatabaseTarget {
    const connectionString = env.DATABASE_URL
    if (!connectionString) {
        throw new InvalidDatabaseUrlError("DATABASE_URL is not set")
    }

    const parsed = parseConnectionUrl(connectionString)
    const hostname = parsed.hostname.toLowerCase()

    if (LOCAL_TCP_HOSTS.has(hostname)) {
        const port = parsed.port ? Number.parseInt(parsed.port, 10) : 5432
        if (!Number.isFinite(port) || port <= 0) {
            throw new InvalidDatabaseUrlError("DATABASE_URL has an invalid port")
        }
        return { kind: "local-tcp", host: hostname, port, connectionString }
    }

    return resolveNeonTarget(connectionString, hostname, env)
}
