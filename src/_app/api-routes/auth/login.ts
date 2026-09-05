import "server-only"

import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"
import { z } from "zod"

import { prisma } from "@/shared/db/index.server"
import {
    emptyTokenAuthResponse,
    jsonResponse,
    methodNotAllowed,
    setAuthCookie,
    signToken,
} from "@/shared/auth/index.server"

const credentialsSchema = z.object({
    name: z.string().trim().min(1),
    password: z.string().min(1),
})

export async function POST(request: NextRequest) {
    const parsed = credentialsSchema.safeParse(await request.json())
    if (!parsed.success) {
        return jsonResponse(400, { error: "Name and password required" })
    }

    const { name, password } = parsed.data

    try {
        const user = await prisma.user.findUnique({ where: { name } })
        if (!user) {
            return jsonResponse(401, { error: "Invalid credentials" })
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
            return jsonResponse(401, { error: "Invalid credentials" })
        }

        const token = await signToken({
            id: user.id,
            name: user.name,
            isAdmin: user.isAdmin,
        })

        const response = emptyTokenAuthResponse(200, {
            user: {
                id: user.id,
                name: user.name,
                isAdmin: user.isAdmin,
            },
        })
        return setAuthCookie(response, token)
    } catch (error) {
        console.error(error)
        return jsonResponse(500, {
            error: error instanceof Error ? error.message : "Login failed",
        })
    }
}

export async function GET() {
    return methodNotAllowed()
}
