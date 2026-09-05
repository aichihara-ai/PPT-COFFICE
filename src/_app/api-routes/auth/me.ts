import "server-only"

import type { NextRequest } from "next/server"

import {
    jsonResponse,
    methodNotAllowed,
    requireUser,
} from "@/shared/auth/index.server"

export async function GET(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    return jsonResponse(200, { user: auth.user })
}

export async function POST() {
    return methodNotAllowed()
}
