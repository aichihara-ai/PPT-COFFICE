import "server-only"

import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { prisma } from "@/shared/db/index.server"

export type AuthUser = {
    id: number
    name: string
    isAdmin: boolean
}

export const TOKEN_COOKIE = "office-hub-token"

function getSecret() {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error("JWT_SECRET is not set")
    }
    return new TextEncoder().encode(secret)
}

export async function signToken(user: AuthUser) {
    return new SignJWT({
        name: user.name,
        isAdmin: user.isAdmin,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(String(user.id))
        .setIssuedAt()
        .setExpirationTime("365d")
        .sign(getSecret())
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret())
        const id = Number(payload.sub)
        if (!id || !payload.name) return null
        return {
            id,
            name: String(payload.name),
            isAdmin: Boolean(payload.isAdmin),
        }
    } catch {
        return null
    }
}

export function getTokenFromRequest(request: NextRequest) {
    return request.cookies.get(TOKEN_COOKIE)?.value ?? null
}

export async function getTokenFromCookies() {
    const cookieStore = await cookies()
    return cookieStore.get(TOKEN_COOKIE)?.value ?? null
}

export async function requireUser(request: NextRequest) {
    const token = getTokenFromRequest(request)
    if (!token) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    }
    const claims = await verifyToken(token)
    if (!claims) {
        return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) }
    }
    const currentUser = await prisma.user.findUnique({
        where: { id: claims.id },
        select: { id: true, name: true, isAdmin: true },
    })
    if (!currentUser) {
        return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) }
    }
    return { user: currentUser }
}

export function requireAdmin(user: AuthUser) {
    if (!user.isAdmin) {
        return NextResponse.json({ error: "Admin only" }, { status: 403 })
    }
    return null
}

export function jsonResponse(status: number, data: unknown) {
    return NextResponse.json(data, { status })
}

export function methodNotAllowed() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export function setAuthCookie(response: NextResponse, token: string) {
    response.cookies.set(TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
    })
    return response
}

export function clearAuthCookie(response: NextResponse) {
    response.cookies.set(TOKEN_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    })
    return response
}

export function emptyTokenAuthResponse(status: number, body: Record<string, unknown>) {
    const response = NextResponse.json({ ...body, token: "" }, { status })
    return response
}
