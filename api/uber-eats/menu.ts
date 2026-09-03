import type { VercelRequest, VercelResponse } from "@vercel/node"

import { methodNotAllowed, requireUser, sendJson } from "../_lib/auth.js"
import { extractUberEatsMenu, normalizeUberEatsUrl } from "../_lib/uberEatsMenu.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await requireUser(req, res)
    if (!user) return

    if (req.method !== "GET") {
        return methodNotAllowed(res)
    }

    const rawUrl = String(req.query.url ?? "")
    const normalized = normalizeUberEatsUrl(rawUrl)
    if (!normalized) {
        return sendJson(res, 400, { error: "Valid Uber Eats link required" })
    }

    const menu = await extractUberEatsMenu(normalized)
    return sendJson(res, 200, { menu })
}
