import "server-only"

import type { NextRequest } from "next/server"

import { prisma } from "@/shared/db/index.server"
import { jsonResponse, methodNotAllowed, requireAdmin, requireUser } from "@/shared/auth/index.server"

const PICKS_REQUIRED = 3
const DUAL_WINNER_THRESHOLD = 0.4

function normalizeGroupOrderUrl(value: unknown) {
    if (typeof value !== "string") return ""
    const trimmed = value.trim()
    if (!trimmed) return ""

    try {
        const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
        const url = new URL(withProtocol)
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return ""
        }
        return url.toString()
    } catch {
        return ""
    }
}

function parseVotingEndsAt(value: unknown): Date | null {
    if (typeof value !== "string" || !value.trim()) return null
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) return null
    if (parsed.getTime() <= Date.now()) return null
    const maxAheadMs = 24 * 60 * 60 * 1000
    if (parsed.getTime() > Date.now() + maxAheadMs) return null
    return parsed
}

async function getLastClosedRound() {
    return await prisma.lunchRound.findFirst({
        where: { status: "closed" },
        orderBy: { closedAt: "desc" },
        include: {
            winnerRestaurant: { select: { name: true } },
            secondWinnerRestaurant: { select: { name: true } },
        },
    })
}

async function getActiveRound() {
    return await prisma.lunchRound.findFirst({
        where: { status: "nominating" },
        orderBy: { createdAt: "desc" },
        include: {
            createdByUser: { select: { name: true } },
        },
    })
}

async function getParticipation(roundId: number) {
    const users = await prisma.user.findMany({ orderBy: { name: "asc" } })
    const completed = await prisma.lunchNomination.groupBy({
        by: ["userId"],
        where: { roundId },
        having: { userId: { _count: { equals: PICKS_REQUIRED } } },
    })
    return {
        users,
        total: users.length,
        completed: completed.length,
    }
}

async function shouldAutoClose(_roundId: number, votingEndsAt: Date | null) {
    return votingEndsAt != null && new Date() >= votingEndsAt
}

async function finalizeRound(roundId: number) {
    const tally = await prisma.lunchNomination.groupBy({
        by: ["restaurantId"],
        where: { roundId },
        _count: { restaurantId: true },
        _min: { createdAt: true },
        orderBy: [
            { _count: { restaurantId: "desc" } },
            { _min: { createdAt: "asc" } },
        ],
    })

    const totalPicks = tally.reduce((sum, row) => sum + row._count.restaurantId, 0)
    const winnerId = tally[0]?.restaurantId ?? null
    let secondWinnerId: number | null = null

    if (tally.length >= 2 && totalPicks > 0) {
        const secondShare = tally[1]._count.restaurantId / totalPicks
        if (secondShare >= DUAL_WINNER_THRESHOLD) {
            secondWinnerId = tally[1].restaurantId
        }
    }

    await prisma.lunchRound.update({
        where: { id: roundId },
        data: {
            status: "closed",
            winnerRestaurantId: winnerId,
            secondWinnerRestaurantId: secondWinnerId,
            closedAt: new Date(),
        },
    })

    const round = await prisma.lunchRound.findUnique({
        where: { id: roundId },
        include: {
            winnerRestaurant: { select: { name: true } },
            secondWinnerRestaurant: { select: { name: true } },
        },
    })

    return {
        winnerId,
        secondWinnerId,
        winnerName: round?.winnerRestaurant?.name ?? null,
        secondWinnerName: round?.secondWinnerRestaurant?.name ?? null,
    }
}

async function buildRoundPayload(roundId: number, userId: number) {
    const round = await prisma.lunchRound.findUnique({
        where: { id: roundId },
        include: { createdByUser: { select: { name: true } } },
    })

    if (!round) return null

    const nominations = await prisma.lunchNomination.findMany({
        where: { roundId },
        include: {
            user: { select: { name: true } },
            restaurant: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
    })

    const nominationCounts = await prisma.lunchNomination.groupBy({
        by: ["restaurantId"],
        where: { roundId },
        _count: { restaurantId: true },
        _min: { createdAt: true },
        orderBy: [
            { _count: { restaurantId: "desc" } },
            { _min: { createdAt: "asc" } },
        ],
    })

    const restaurantNames = await prisma.restaurant.findMany({
        where: { id: { in: nominationCounts.map((n) => n.restaurantId) } },
        select: { id: true, name: true },
    })

    const myPicks = nominations
        .filter((n) => n.userId === userId)
        .map((n) => n.restaurantId)

    const participation = await getParticipation(roundId)

    return {
        round: {
            id: round.id,
            status: round.status,
            created_by: round.createdBy,
            created_by_name: round.createdByUser.name,
            voting_ends_at: round.votingEndsAt?.toISOString() ?? null,
            created_at: round.createdAt.toISOString(),
            closed_at: round.closedAt?.toISOString() ?? null,
        },
        nominationCounts: nominationCounts.map((nc) => ({
            restaurant_id: nc.restaurantId,
            restaurant_name: restaurantNames.find((r) => r.id === nc.restaurantId)?.name ?? "",
            count: nc._count.restaurantId,
        })),
        users: participation.users.map((u) => ({ id: u.id, name: u.name })),
        myPicks,
        pickCount: myPicks.length,
        isComplete: myPicks.length === PICKS_REQUIRED,
        participation: {
            completed: participation.completed,
            total: participation.total,
        },
    }
}

export async function GET(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const user = auth.user

    let round = await getActiveRound()

    if (round) {
        if (await shouldAutoClose(round.id, round.votingEndsAt)) {
            await finalizeRound(round.id)
            round = null
        }
    }

    if (!round) {
        const lastClosed = await getLastClosedRound()
        return jsonResponse(200, {
            round: null,
            lastClosed: lastClosed
                ? {
                      id: lastClosed.id,
                      winner_name: lastClosed.winnerRestaurant?.name ?? null,
                      second_winner_name: lastClosed.secondWinnerRestaurant?.name ?? null,
                      group_order_url: lastClosed.groupOrderUrl ?? null,
                  }
                : null,
        })
    }

    const payload = await buildRoundPayload(round.id, user.id)
    return jsonResponse(200, payload)
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const user = auth.user
    const body = await request.json()

    const action = body.action

    if (action === "setGroupOrderLink") {
        if (!(await requireAdmin(user))) {
            return jsonResponse(403, { error: "Admin required" })
        }

        const groupOrderUrl = normalizeGroupOrderUrl(body.groupOrderUrl)
        if (!groupOrderUrl) {
            return jsonResponse(400, { error: "Valid group order link required" })
        }

        const lastClosed = await getLastClosedRound()
        if (!lastClosed) {
            return jsonResponse(404, { error: "No finalized lunch round yet" })
        }

        await prisma.lunchRound.update({
            where: { id: lastClosed.id },
            data: { groupOrderUrl },
        })

        return jsonResponse(200, { ok: true, groupOrderUrl })
    }

    if (action === "start") {
        if (!(await requireAdmin(user))) {
            return jsonResponse(403, { error: "Admin required" })
        }

        const existing = await getActiveRound()
        if (existing) {
            return jsonResponse(409, { error: "A lunch round is already active" })
        }

        const poolCount = await prisma.restaurant.count({ where: { active: true } })
        if (poolCount < PICKS_REQUIRED) {
            return jsonResponse(400, {
                error: `Need at least ${PICKS_REQUIRED} restaurants in the pool to start`,
            })
        }

        const votingEndsAt = parseVotingEndsAt(body.votingEndsAt)
        if (!votingEndsAt) {
            return jsonResponse(400, { error: "Valid votingEndsAt required" })
        }

        const round = await prisma.lunchRound.create({
            data: {
                status: "nominating",
                createdBy: user.id,
                votingEndsAt,
            },
        })

        return jsonResponse(201, { round })
    }

    const round = await getActiveRound()
    if (!round) {
        return jsonResponse(404, { error: "No active lunch round" })
    }

    const roundId = round.id

    if (action === "pick" || action === "nominate") {
        const restaurantId = Number(body.restaurantId)
        if (!restaurantId) {
            return jsonResponse(400, { error: "Restaurant required" })
        }

        const existingPick = await prisma.lunchNomination.findUnique({
            where: {
                roundId_userId_restaurantId: {
                    roundId,
                    userId: user.id,
                    restaurantId,
                },
            },
        })

        if (existingPick) {
            await prisma.lunchNomination.delete({ where: { id: existingPick.id } })
            return jsonResponse(200, { ok: true, picked: false })
        }

        const pickCount = await prisma.lunchNomination.count({
            where: { roundId, userId: user.id },
        })
        if (pickCount >= PICKS_REQUIRED) {
            return jsonResponse(400, {
                error: `You already picked ${PICKS_REQUIRED} — unpick one to swap`,
            })
        }

        const restaurant = await prisma.restaurant.findFirst({
            where: { id: restaurantId, active: true },
        })
        if (!restaurant) {
            return jsonResponse(400, { error: "Restaurant not in pool" })
        }

        await prisma.lunchNomination.create({
            data: {
                roundId,
                userId: user.id,
                restaurantId,
            },
        })

        const updatedRound = await getActiveRound()
        if (updatedRound && (await shouldAutoClose(roundId, updatedRound.votingEndsAt))) {
            await finalizeRound(roundId)
        }

        return jsonResponse(200, { ok: true, picked: true })
    }

    if (action === "close") {
        if (!(await requireAdmin(user))) {
            return jsonResponse(403, { error: "Admin required" })
        }

        const result = await finalizeRound(roundId)
        return jsonResponse(200, { ok: true, ...result })
    }

    return jsonResponse(400, { error: "Unknown action" })
}

export { methodNotAllowed as OPTIONS }
