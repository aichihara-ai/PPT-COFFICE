import type { VercelRequest, VercelResponse } from "@vercel/node"
import { SignJWT, jwtVerify } from "jose"

export type AuthUser = {
    id: number
    name: string
    isAdmin: boolean
}

const TOKEN_COOKIE = "office-hub-token"

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

export function getTokenFromRequest(req: VercelRequest) {
    const auth = req.headers.authorization
    if (auth?.startsWith("Bearer ")) {
        return auth.slice(7)
    }
    const cookie = req.headers.cookie
    if (!cookie) return null
    const match = cookie
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${TOKEN_COOKIE}=`))
    return match ? decodeURIComponent(match.split("=")[1] ?? "") : null
}

export async function requireUser(req: VercelRequest, res: VercelResponse) {
    const token = getTokenFromRequest(req)
    if (!token) {
        res.status(401).json({ error: "Unauthorized" })
        return null
    }
    const user = await verifyToken(token)
    if (!user) {
        res.status(401).json({ error: "Invalid token" })
        return null
    }
    return user
}

export function requireAdmin(user: AuthUser, res: VercelResponse) {
    if (!user.isAdmin) {
        res.status(403).json({ error: "Admin only" })
        return false
    }
    return true
}

export function sendJson(res: VercelResponse, status: number, data: unknown) {
    res.status(status).json(data)
}

export function methodNotAllowed(res: VercelResponse) {
    res.status(405).json({ error: "Method not allowed" })
}
