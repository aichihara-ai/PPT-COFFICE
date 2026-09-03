import type { VercelRequest, VercelResponse } from "@vercel/node"

import { getSql } from "../_lib/db.js"
import { methodNotAllowed, requireAdmin, requireUser, sendJson } from "../_lib/auth.js"

const STATUSES = ["ok", "low"] as const

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await requireUser(req, res)
    if (!user) return

    const sql = getSql()

    if (req.method === "GET") {
        const rows = await sql`
            SELECT i.item, i.status, i.updated_at, u.name AS updated_by_name
            FROM inventory i
            LEFT JOIN users u ON u.id = i.updated_by
            ORDER BY i.item
        `
        return sendJson(res, 200, { inventory: rows })
    }

    if (req.method === "PATCH") {
        const body = req.body as { item?: string; status?: string }
        const item = body.item
        const status = body.status

        if (!item || !status || !["coffee", "milk"].includes(item)) {
            return sendJson(res, 400, { error: "Valid item required" })
        }

        if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
            return sendJson(res, 400, { error: "Valid status required" })
        }

        if (status === "ok" && !requireAdmin(user, res)) return

        const rows = await sql`
            UPDATE inventory
            SET status = ${status}, updated_by = ${user.id}, updated_at = NOW()
            WHERE item = ${item}
            RETURNING item, status, updated_at
        `

        return sendJson(res, 200, { item: rows[0] })
    }

    return methodNotAllowed(res)
}
