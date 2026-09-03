import type { VercelRequest, VercelResponse } from "@vercel/node"

import { methodNotAllowed, requireUser, sendJson } from "../_lib/auth.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "GET") {
        return methodNotAllowed(res)
    }

    const user = await requireUser(req, res)
    if (!user) return

    return sendJson(res, 200, { user })
}
