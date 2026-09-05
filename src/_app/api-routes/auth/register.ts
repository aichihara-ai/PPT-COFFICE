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

const registerSchema = z.object({
    name: z.string().trim().min(1),
    password: z.string().min(6),
})

export async function POST(request: NextRequest) {
    const parsed = registerSchema.safeParse(await request.json())
    if (!parsed.success) {
        return jsonResponse(400, {
            error: "Name and password (min 6 chars) required",
        })
    }

    const { name, password } = parsed.data

    try {
        const existing = await prisma.user.findUnique({ where: { name } })
        if (existing) {
            return jsonResponse(409, { error: "Name already taken" })
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { name, passwordHash, isAdmin: false },
        })

        const token = await signToken({
            id: user.id,
            name: user.name,
            isAdmin: user.isAdmin,
        })

        const response = emptyTokenAuthResponse(201, {
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
            error: error instanceof Error ? error.message : "Registration failed",
        })
    }
}

export async function GET() {
    return methodNotAllowed()
}
