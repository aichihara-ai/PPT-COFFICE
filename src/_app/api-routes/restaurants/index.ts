import "server-only"

import type { NextRequest } from "next/server"
import { z } from "zod"

import {
    normalizeUberEatsUrl,
    resolveRestaurantName,
    RESTAURANT_TITLE_MAX_LENGTH,
} from "@/entities/restaurant"
import { extractUberEatsMenu } from "@/shared/lib/index.server"
import { prisma } from "@/shared/db/index.server"
import {
    jsonResponse,
    requireAdmin,
    requireUser,
} from "@/shared/auth/index.server"

const createSchema = z.object({
    title: z.string().max(RESTAURANT_TITLE_MAX_LENGTH).optional(),
    name: z.string().max(RESTAURANT_TITLE_MAX_LENGTH).optional(),
    notes: z.string().optional(),
    uberEatsUrl: z.string(),
})

const patchSchema = z.object({
    name: z.string().optional(),
    notes: z.string().optional(),
    active: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const rows = await prisma.restaurant.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
    })

    return jsonResponse(200, {
        restaurants: rows.map((row) => ({
            id: row.id,
            name: row.name,
            notes: row.notes,
            uber_eats_url: row.uberEatsUrl,
            menu_preview: row.menuPreview,
            active: row.active,
        })),
    })
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const parsed = createSchema.safeParse(await request.json())
    if (!parsed.success) {
        return jsonResponse(400, { error: "Valid Uber Eats link required" })
    }

    const uberEatsUrl = normalizeUberEatsUrl(parsed.data.uberEatsUrl)
    if (!uberEatsUrl) {
        return jsonResponse(400, { error: "Valid Uber Eats link required" })
    }

    const menuPreview = await extractUberEatsMenu(uberEatsUrl)
    const name = resolveRestaurantName({
        title: parsed.data.title ?? parsed.data.name,
        scrapedName: menuPreview.storeName,
        uberEatsUrl,
    })

    try {
        const created = await prisma.restaurant.create({
            data: {
                name,
                notes: parsed.data.notes?.trim() ?? null,
                uberEatsUrl,
                menuPreview,
            },
        })

        return jsonResponse(201, {
            restaurant: {
                id: created.id,
                name: created.name,
                notes: created.notes,
                uber_eats_url: created.uberEatsUrl,
                menu_preview: created.menuPreview,
                active: created.active,
            },
        })
    } catch {
        return jsonResponse(409, {
            error: "Restaurant or Uber Eats link already in pool",
        })
    }
}

export async function PATCH(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const denied = requireAdmin(auth.user)
    if (denied) return denied

    const id = Number(request.nextUrl.searchParams.get("id"))
    const parsed = patchSchema.safeParse(await request.json())
    if (!id || !parsed.success) {
        return jsonResponse(400, { error: "Valid restaurant id and fields required" })
    }

    try {
        const updated = await prisma.restaurant.update({
            where: { id },
            data: {
                name: parsed.data.name?.trim(),
                notes: parsed.data.notes?.trim(),
                active: parsed.data.active,
            },
        })

        return jsonResponse(200, {
            restaurant: {
                id: updated.id,
                name: updated.name,
                notes: updated.notes,
                active: updated.active,
            },
        })
    } catch {
        return jsonResponse(404, { error: "Restaurant not found" })
    }
}

export async function DELETE(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const denied = requireAdmin(auth.user)
    if (denied) return denied

    const id = Number(request.nextUrl.searchParams.get("id"))
    if (!id) {
        return jsonResponse(400, { error: "Restaurant id required" })
    }

    await prisma.restaurant.update({
        where: { id },
        data: { active: false },
    })

    return jsonResponse(200, { ok: true })
}
