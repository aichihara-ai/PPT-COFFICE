import "server-only"

import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"

import { prisma } from "@/shared/db/index.server"
import { jsonResponse, methodNotAllowed } from "@/shared/auth/index.server"

export async function POST(request: NextRequest) {
    const setupSecret = process.env.SETUP_SECRET
    if (!setupSecret || request.headers.get("x-setup-secret") !== setupSecret) {
        return jsonResponse(403, { error: "Invalid setup secret" })
    }

    try {
        const adminName = process.env.ADMIN_NAME ?? "HR Admin"
        const adminPassword = process.env.ADMIN_PASSWORD
        if (!adminPassword) {
            return jsonResponse(500, {
                error: "ADMIN_PASSWORD is not set on this deployment.",
            })
        }
        const passwordHash = await bcrypt.hash(adminPassword, 10)

        await prisma.$transaction([
            prisma.inventory.upsert({
                where: { item: "coffee" },
                create: { item: "coffee", status: "ok" },
                update: {},
            }),
            prisma.inventory.upsert({
                where: { item: "milk" },
                create: { item: "milk", status: "ok" },
                update: {},
            }),
            prisma.user.upsert({
                where: { name: adminName },
                create: {
                    name: adminName,
                    passwordHash,
                    isAdmin: true,
                },
                update: {
                    passwordHash,
                    isAdmin: true,
                },
            }),
        ])

        return jsonResponse(200, {
            ok: true,
            message: "Database seeded",
            adminName,
        })
    } catch (error) {
        console.error(error)
        return jsonResponse(500, {
            error: error instanceof Error ? error.message : "Setup failed",
        })
    }
}

export async function GET() {
    return methodNotAllowed()
}
