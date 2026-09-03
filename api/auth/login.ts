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

    if (!name || !password) {
        return sendJson(res, 400, { error: "Name and password required" })
    }

    const sql = getSql()
    const rows = await sql`
        SELECT id, name, password_hash, is_admin
        FROM users
        WHERE name = ${name}
        LIMIT 1
    `

    const user = rows[0]
    if (!user) {
        return sendJson(res, 401, { error: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
        return sendJson(res, 401, { error: "Invalid credentials" })
    }

    const token = await signToken({
        id: user.id,
        name: user.name,
        isAdmin: user.is_admin,
    })

    return sendJson(res, 200, {
        token,
        user: {
            id: user.id,
            name: user.name,
            isAdmin: user.is_admin,
        },
    })
}
