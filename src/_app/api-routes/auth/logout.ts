import "server-only"

import { jsonResponse, methodNotAllowed, clearAuthCookie } from "@/shared/auth/index.server"

export async function POST() {
    const response = jsonResponse(200, { ok: true })
    return clearAuthCookie(response)
}

export async function GET() {
    return methodNotAllowed()
}
