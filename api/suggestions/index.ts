import type { VercelRequest, VercelResponse } from "@vercel/node"

import { getSql } from "../_lib/db.js"
import {
    methodNotAllowed,
    requireAdmin,
    requireUser,
    sendJson,
} from "../_lib/auth.js"

function normalizeUrl(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return ""

    try {
        const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
        const url = new URL(withProtocol)
        if (url.protocol !== "http:" && url.protocol !== "https:") return ""
        return url.toString()
    } catch {
        return ""
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await requireUser(req, res)
    if (!user) return

    const sql = getSql()

    if (req.method === "GET") {
        const rows = await sql`
            SELECT s.id, s.text, s.status, s.created_at, u.name AS user_name
            FROM suggestions s
            JOIN users u ON u.id = s.user_id
            ORDER BY s.created_at DESC
        `
        return sendJson(res, 200, { suggestions: rows })
    }

    if (req.method === "POST") {
        const body = req.body as { text?: string }
        const text = normalizeUrl(body.text ?? "")
        if (!text) {
            return sendJson(res, 400, { error: "Valid product link required (http or https)" })
        }

        const rows = await sql`
            INSERT INTO suggestions (user_id, text)
            VALUES (${user.id}, ${text})
            RETURNING id, text, status, created_at
        `
        return sendJson(res, 201, { suggestion: rows[0] })
    }

    if (req.method === "PATCH") {
        if (!requireAdmin(user, res)) return

        const id = Number(req.query.id)
        const body = req.body as { status?: string }
        const status = body.status

        if (!id || !status || !["bought", "declined", "open"].includes(status)) {
            return sendJson(res, 400, { error: "Valid id and status required" })
        }

        const rows = await sql`
            UPDATE suggestions SET status = ${status}
            WHERE id = ${id}
            RETURNING id, text, status
        `

        if (!rows[0]) {
            return sendJson(res, 404, { error: "Suggestion not found" })
        }

        return sendJson(res, 200, { suggestion: rows[0] })
    }

    return methodNotAllowed(res)
}
