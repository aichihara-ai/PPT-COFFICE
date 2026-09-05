import "server-only"

import type { NextRequest } from "next/server"
import { z } from "zod"

import { prisma } from "@/shared/db/index.server"
import {
    jsonResponse,
    methodNotAllowed,
    requireAdmin,
    requireUser,
} from "@/shared/auth/index.server"

const patchSchema = z.object({
    item: z.enum(["coffee", "milk"]),
    status: z.enum(["ok", "low"]),
})

export async function GET(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const rows = await prisma.inventory.findMany({
        include: { updatedByUser: { select: { name: true } } },
        orderBy: { item: "asc" },
    })

    return jsonResponse(200, {
        inventory: rows.map((row) => ({
            item: row.item,
            status: row.status,
            updated_at: row.updatedAt.toISOString(),
            updated_by_name: row.updatedByUser?.name ?? null,
        })),
    })
}

export async function PATCH(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const parsed = patchSchema.safeParse(await request.json())
    if (!parsed.success) {
        return jsonResponse(400, { error: "Valid item required" })
    }

    const { item, status } = parsed.data

    if (status === "ok") {
        const denied = requireAdmin(auth.user)
        if (denied) return denied
    }

    const updated = await prisma.inventory.update({
        where: { item },
        data: {
            status,
            updatedBy: auth.user.id,
            updatedAt: new Date(),
        },
    })

    return jsonResponse(200, {
        item: {
            item: updated.item,
            status: updated.status,
            updated_at: updated.updatedAt.toISOString(),
        },
    })
}

export async function POST() {
    return methodNotAllowed()
}
