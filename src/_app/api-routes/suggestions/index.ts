import "server-only"

import type { NextRequest } from "next/server"
import { z } from "zod"

import {
    normalizeSuggestionTitle,
    normalizeSuggestionUrl,
} from "@/entities/suggestion"
import { prisma } from "@/shared/db/index.server"
import {
    jsonResponse,
    methodNotAllowed,
    requireAdmin,
    requireUser,
} from "@/shared/auth/index.server"

const createSchema = z.object({
    text: z.string(),
    title: z.string().optional(),
})

const patchSchema = z.object({
    status: z.enum(["open", "bought", "declined"]),
})

export async function GET(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const rows = await prisma.suggestion.findMany({
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
    })

    return jsonResponse(200, {
        suggestions: rows.map((row) => ({
            id: row.id,
            text: row.text,
            title: row.title,
            status: row.status,
            created_at: row.createdAt.toISOString(),
            user_name: row.user.name,
        })),
    })
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const parsed = createSchema.safeParse(await request.json())
    if (!parsed.success) {
        return jsonResponse(400, {
            error: "Valid product link required (http or https)",
        })
    }

    const text = normalizeSuggestionUrl(parsed.data.text)
    if (!text) {
        return jsonResponse(400, {
            error: "Valid product link required (http or https)",
        })
    }

    const title = normalizeSuggestionTitle(parsed.data.title)

    const created = await prisma.suggestion.create({
        data: { userId: auth.user.id, text, title },
    })

    return jsonResponse(201, {
        suggestion: {
            id: created.id,
            text: created.text,
            title: created.title,
            status: created.status,
            created_at: created.createdAt.toISOString(),
        },
    })
}

export async function PATCH(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const denied = requireAdmin(auth.user)
    if (denied) return denied

    const id = Number(request.nextUrl.searchParams.get("id"))
    const parsed = patchSchema.safeParse(await request.json())
    if (!id || !parsed.success) {
        return jsonResponse(400, { error: "Valid id and status required" })
    }

    try {
        const updated = await prisma.suggestion.update({
            where: { id },
            data: { status: parsed.data.status },
        })

        return jsonResponse(200, {
            suggestion: {
                id: updated.id,
                text: updated.text,
                title: updated.title,
                status: updated.status,
            },
        })
    } catch {
        return jsonResponse(404, { error: "Suggestion not found" })
    }
}

export async function DELETE() {
    return methodNotAllowed()
}
