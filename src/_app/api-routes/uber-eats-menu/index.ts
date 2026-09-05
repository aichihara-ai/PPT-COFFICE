import "server-only"

import type { NextRequest } from "next/server"

import { normalizeUberEatsUrl } from "@/entities/restaurant"
import { jsonResponse, methodNotAllowed, requireUser } from "@/shared/auth/index.server"
import { extractUberEatsMenu } from "@/shared/lib/index.server"

export async function GET(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const url = normalizeUberEatsUrl(request.nextUrl.searchParams.get("url") ?? "")
    if (!url) {
        return jsonResponse(400, { error: "Valid Uber Eats link required" })
    }

    try {
        return jsonResponse(200, { menu: await extractUberEatsMenu(url) })
    } catch (error) {
        return jsonResponse(502, {
            error: error instanceof Error ? error.message : "Could not load menu",
        })
    }
}

export async function POST() {
    return methodNotAllowed()
}
