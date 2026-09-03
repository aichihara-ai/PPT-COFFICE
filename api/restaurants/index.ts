import type { VercelRequest, VercelResponse } from "@vercel/node"

import { getSql } from "../_lib/db.js"
import {
    methodNotAllowed,
    requireAdmin,
    requireUser,
    sendJson,
} from "../_lib/auth.js"
import { extractUberEatsMenu, normalizeUberEatsUrl } from "../_lib/uberEatsMenu.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await requireUser(req, res)
    if (!user) return

    const sql = getSql()

    if (req.method === "GET") {
        const rows = await sql`
            SELECT id, name, notes, uber_eats_url, menu_preview, active
            FROM restaurants
            WHERE active = TRUE
            ORDER BY name
        `
        return sendJson(res, 200, { restaurants: rows })
    }

    if (req.method === "POST") {
        const body = req.body as { name?: string; notes?: string; uberEatsUrl?: string }
        const uberEatsUrl = normalizeUberEatsUrl(body.uberEatsUrl ?? "")

        if (!uberEatsUrl) {
            return sendJson(res, 400, { error: "Valid Uber Eats link required" })
        }

        const menuPreview = await extractUberEatsMenu(uberEatsUrl)
        const name = menuPreview.storeName?.trim() || body.name?.trim()

        if (!name) {
            return sendJson(res, 400, { error: "Could not read restaurant name from link" })
        }

        try {
            const rows = await sql`
                INSERT INTO restaurants (name, notes, uber_eats_url, menu_preview)
                VALUES (
                    ${name},
                    ${body.notes?.trim() ?? null},
                    ${uberEatsUrl},
                    ${JSON.stringify(menuPreview)}::jsonb
                )
                RETURNING id, name, notes, uber_eats_url, menu_preview, active
            `
            return sendJson(res, 201, { restaurant: rows[0] })
        } catch {
            return sendJson(res, 409, { error: "Restaurant or Uber Eats link already in pool" })
        }
    }

    if (req.method === "PATCH") {
        if (!requireAdmin(user, res)) return

        const id = Number(req.query.id)
        const body = req.body as { name?: string; notes?: string; active?: boolean }
        if (!id) {
            return sendJson(res, 400, { error: "Restaurant id required" })
        }

        const rows = await sql`
            UPDATE restaurants
            SET
                name = COALESCE(${body.name?.trim() ?? null}, name),
                notes = COALESCE(${body.notes?.trim() ?? null}, notes),
                active = COALESCE(${body.active ?? null}, active)
            WHERE id = ${id}
            RETURNING id, name, notes, active
        `

        if (!rows[0]) {
            return sendJson(res, 404, { error: "Restaurant not found" })
        }

        return sendJson(res, 200, { restaurant: rows[0] })
    }

    if (req.method === "DELETE") {
        if (!requireAdmin(user, res)) return

        const id = Number(req.query.id)
        if (!id) {
            return sendJson(res, 400, { error: "Restaurant id required" })
        }

        await sql`UPDATE restaurants SET active = FALSE WHERE id = ${id}`
        return sendJson(res, 200, { ok: true })
    }

    return methodNotAllowed(res)
}
