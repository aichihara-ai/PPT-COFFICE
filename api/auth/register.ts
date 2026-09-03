import type { VercelRequest, VercelResponse } from "@vercel/node"
import bcrypt from "bcryptjs"

import { getSql } from "../_lib/db.js"
import { methodNotAllowed, sendJson, signToken } from "../_lib/auth.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return methodNotAllowed(res)
    }

    const body = req.body as { name?: string; password?: string }
    const name = body.name?.trim()
    const password = body.password

    if (!name || !password || password.length < 6) {
        return sendJson(res, 400, {
            error: "Name and password (min 6 chars) required",
        })
    }

    const sql = getSql()
    const existing = await sql`SELECT id FROM users WHERE name = ${name}`
    if (existing.length > 0) {
        return sendJson(res, 409, { error: "Name already taken" })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const rows = await sql`
        INSERT INTO users (name, password_hash, is_admin)
        VALUES (${name}, ${passwordHash}, FALSE)
        RETURNING id, name, is_admin
    `
    const user = rows[0]
    const token = await signToken({
        id: user.id,
        name: user.name,
        isAdmin: user.is_admin,
    })

    return sendJson(res, 201, {
        token,
        user: {
            id: user.id,
            name: user.name,
            isAdmin: user.is_admin,
        },
    })
}
