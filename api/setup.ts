import { readFileSync } from "node:fs"
import { join } from "node:path"

import type { VercelRequest, VercelResponse } from "@vercel/node"
import { Pool } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

import { methodNotAllowed, sendJson } from "./_lib/auth.js"
import { getDatabaseUrl } from "./_lib/databaseUrl.js"

function stripLineComments(sql: string) {
    return sql
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim()
}

function splitSql(content: string) {
    return content
        .split(";")
        .map((statement) => stripLineComments(statement))
        .filter((statement) => statement.length > 0)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return methodNotAllowed(res)
    }

    const setupSecret = process.env.SETUP_SECRET
    if (!setupSecret || req.headers["x-setup-secret"] !== setupSecret) {
        return sendJson(res, 403, { error: "Invalid setup secret" })
    }

    const databaseUrl = getDatabaseUrl()
    if (!databaseUrl) {
        return sendJson(res, 500, {
            error: "DATABASE_URL is not set on this deployment. Add Neon connection string as DATABASE_URL on the ppt-coffice project (Production), then redeploy.",
        })
    }

    const pool = new Pool({ connectionString: databaseUrl })

    try {
        const schema = readFileSync(join(process.cwd(), "db/schema.sql"), "utf8")
        const seed = readFileSync(join(process.cwd(), "db/seed.sql"), "utf8")

        for (const statement of splitSql(schema)) {
            await pool.query(statement)
        }
        for (const statement of splitSql(seed)) {
            await pool.query(statement)
        }

        const adminName = process.env.ADMIN_NAME ?? "HR Admin"
        const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme"
        const passwordHash = await bcrypt.hash(adminPassword, 10)

        await pool.query(
            `INSERT INTO users (name, password_hash, is_admin)
             VALUES ($1, $2, TRUE)
             ON CONFLICT (name) DO UPDATE SET password_hash = $2, is_admin = TRUE`,
            [adminName, passwordHash]
        )

        return sendJson(res, 200, {
            ok: true,
            message: "Database initialized",
            adminName,
        })
    } catch (error) {
        console.error(error)
        return sendJson(res, 500, {
            error: error instanceof Error ? error.message : "Setup failed",
        })
    } finally {
        await pool.end()
    }
}
