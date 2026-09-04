const DATABASE_URL_KEYS = [
    "DATABASE_URL",
    "POSTGRES_URL",
    "DATABASE_URL_UNPOOLED",
    "POSTGRES_URL_NON_POOLING",
] as const

export function getDatabaseUrl() {
    for (const key of DATABASE_URL_KEYS) {
        const value = process.env[key]?.trim()
        if (value) {
            return value
        }
    }

    return undefined
}

export function requireDatabaseUrl() {
    const url = getDatabaseUrl()
    if (!url) {
        throw new Error(
            `Database URL is not set. Add DATABASE_URL (Neon pooled connection string) to this Vercel project for Production, then redeploy. Checked: ${DATABASE_URL_KEYS.join(", ")}`
        )
    }
    return url
}
