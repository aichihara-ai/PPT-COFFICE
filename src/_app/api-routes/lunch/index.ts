import "server-only"

import type { NextRequest } from "next/server"
import { z } from "zod"

import { MAX_LUNCH_VOTES, pickLunchWinner } from "@/entities/lunch-round"
import { prisma } from "@/shared/db/index.server"
import {
    jsonResponse,
    requireAdmin,
    requireUser,
} from "@/shared/auth/index.server"

const actionSchema = z.object({
    action: z.enum(["start", "nominate", "lock", "vote", "close"]),
    restaurantId: z.number().optional(),
})

async function getActiveRound() {
    return prisma.lunchRound.findFirst({
        where: { status: { in: ["nominating", "voting"] } },
        orderBy: { createdAt: "desc" },
        include: { createdByUser: { select: { name: true } } },
    })
}

export async function GET(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const round = await getActiveRound()

    if (!round) {
        const lastClosed = await prisma.lunchRound.findFirst({
            where: { status: "closed" },
            orderBy: { closedAt: "desc" },
            include: {
                winnerRestaurant: { select: { name: true } },
            },
        })

        return jsonResponse(200, {
            round: null,
            lastClosed: lastClosed
                ? {
                      id: lastClosed.id,
                      status: lastClosed.status,
                      closed_at: lastClosed.closedAt?.toISOString() ?? null,
                      winner_restaurant_id: lastClosed.winnerRestaurantId,
                      winner_name: lastClosed.winnerRestaurant?.name ?? null,
                  }
                : null,
            nominations: [],
            nominationCounts: [],
            candidates: [],
            votes: [],
            voteCounts: [],
            users: [],
            myNomination: null,
            myVote: null,
            myVotes: [],
        })
    }

    const nominations = await prisma.lunchNomination.findMany({
        where: { roundId: round.id },
        include: {
            user: { select: { name: true } },
            restaurant: { select: { name: true } },
        },
        orderBy: { createdAt: "asc" },
    })

    const nominationCounts = await prisma.lunchNomination.groupBy({
        by: ["restaurantId"],
        where: { roundId: round.id },
        _count: { restaurantId: true },
        _min: { createdAt: true },
        orderBy: [{ _count: { restaurantId: "desc" } }],
    })

    const nominationCountRows = await Promise.all(
        nominationCounts.map(async (row) => {
            const restaurant = await prisma.restaurant.findUnique({
                where: { id: row.restaurantId },
                select: { name: true },
            })
            return {
                restaurant_id: row.restaurantId,
                restaurant_name: restaurant?.name ?? "",
                count: row._count.restaurantId,
                first_nominated_at: row._min.createdAt?.toISOString(),
            }
        })
    )

    nominationCountRows.sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count
        return (a.first_nominated_at ?? "").localeCompare(b.first_nominated_at ?? "")
    })

    const candidates = await prisma.lunchCandidate.findMany({
        where: { roundId: round.id },
        include: { restaurant: { select: { name: true } } },
        orderBy: [{ nominationCount: "desc" }, { restaurant: { name: "asc" } }],
    })

    const votes = await prisma.lunchVote.findMany({
        where: { roundId: round.id },
        include: {
            user: { select: { name: true } },
            restaurant: { select: { name: true } },
        },
    })

    const voteCounts = await prisma.lunchVote.groupBy({
        by: ["restaurantId"],
        where: { roundId: round.id },
        _count: { restaurantId: true },
    })

    const voteCountRows = await Promise.all(
        voteCounts.map(async (row) => {
            const restaurant = await prisma.restaurant.findUnique({
                where: { id: row.restaurantId },
                select: { name: true },
            })
            return {
                restaurant_id: row.restaurantId,
                restaurant_name: restaurant?.name ?? "",
                count: row._count.restaurantId,
            }
        })
    )

    voteCountRows.sort((a, b) =>
        b.count !== a.count
            ? b.count - a.count
            : a.restaurant_name.localeCompare(b.restaurant_name)
    )

    const users = await prisma.user.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
    })

    const myNomination = nominations.find((n) => n.userId === auth.user.id)
    const myVotes = votes
        .filter((v) => v.userId === auth.user.id)
        .map((v) => ({ restaurant_id: v.restaurantId }))
    const myVote = myVotes[0] ?? null

    return jsonResponse(200, {
        round: {
            id: round.id,
            status: round.status,
            created_at: round.createdAt.toISOString(),
            created_by: round.createdBy,
            created_by_name: round.createdByUser.name,
            winner_restaurant_id: round.winnerRestaurantId,
            closed_at: round.closedAt?.toISOString() ?? null,
            voting_ends_at: round.votingEndsAt?.toISOString() ?? null,
        },
        lastClosed: null,
        nominations: nominations.map((n) => ({
            user_id: n.userId,
            restaurant_id: n.restaurantId,
            created_at: n.createdAt.toISOString(),
            user_name: n.user.name,
            restaurant_name: n.restaurant.name,
        })),
        nominationCounts: nominationCountRows,
        candidates: candidates.map((c) => ({
            restaurant_id: c.restaurantId,
            restaurant_name: c.restaurant.name,
            nomination_count: c.nominationCount,
        })),
        votes: votes.map((v) => ({
            user_id: v.userId,
            restaurant_id: v.restaurantId,
            created_at: v.createdAt.toISOString(),
            user_name: v.user.name,
            restaurant_name: v.restaurant.name,
        })),
        voteCounts: voteCountRows,
        users,
        myNomination: myNomination
            ? { restaurant_id: myNomination.restaurantId }
            : null,
        myVote,
        myVotes,
    })
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const parsed = actionSchema.safeParse(await request.json())
    if (!parsed.success) {
        return jsonResponse(400, { error: "Unknown action" })
    }

    const { action, restaurantId } = parsed.data

    if (action === "start") {
        const denied = requireAdmin(auth.user)
        if (denied) return denied

        const existing = await getActiveRound()
        if (existing) {
            return jsonResponse(409, { error: "A lunch round is already active" })
        }

        const created = await prisma.lunchRound.create({
            data: {
                status: "voting",
                createdBy: auth.user.id,
                votingEndsAt: new Date(Date.now() + 15 * 60 * 1000),
            },
        })

        return jsonResponse(201, {
            round: {
                id: created.id,
                status: created.status,
                created_at: created.createdAt.toISOString(),
            },
        })
    }

    const round = await getActiveRound()
    if (!round) {
        return jsonResponse(404, { error: "No active lunch round" })
    }

    if (action === "nominate") {
        if (round.status !== "nominating") {
            return jsonResponse(400, { error: "Nomination phase is closed" })
        }

        if (!restaurantId) {
            return jsonResponse(400, { error: "Restaurant required" })
        }

        await prisma.lunchNomination.upsert({
            where: {
                roundId_userId: {
                    roundId: round.id,
                    userId: auth.user.id,
                },
            },
            create: {
                roundId: round.id,
                userId: auth.user.id,
                restaurantId,
            },
            update: {
                restaurantId,
                createdAt: new Date(),
            },
        })

        return jsonResponse(200, { ok: true })
    }

    if (action === "lock") {
        if (!auth.user.isAdmin && round.createdBy !== auth.user.id) {
            return jsonResponse(403, {
                error: "Only admin or round starter can lock candidates",
            })
        }

        if (round.status !== "nominating") {
            return jsonResponse(400, { error: "Candidates already locked" })
        }

        const top = await prisma.lunchNomination.groupBy({
            by: ["restaurantId"],
            where: { roundId: round.id },
            _count: { restaurantId: true },
            _min: { createdAt: true },
            orderBy: [{ _count: { restaurantId: "desc" } }],
            take: 3,
        })

        if (top.length === 0) {
            return jsonResponse(400, { error: "No nominations yet" })
        }

        await prisma.$transaction(async (tx) => {
            await tx.lunchCandidate.deleteMany({ where: { roundId: round.id } })

            for (const row of top) {
                await tx.lunchCandidate.create({
                    data: {
                        roundId: round.id,
                        restaurantId: row.restaurantId,
                        nominationCount: row._count.restaurantId,
                    },
                })
            }

            await tx.lunchRound.update({
                where: { id: round.id },
                data: {
                    status: "voting",
                    votingEndsAt: new Date(Date.now() + 15 * 60 * 1000),
                },
            })
        })

        return jsonResponse(200, { ok: true, candidateCount: top.length })
    }

    if (action === "vote") {
        if (round.status !== "voting" && round.status !== "nominating") {
            return jsonResponse(400, { error: "Voting is not open" })
        }

        if (!restaurantId) {
            return jsonResponse(400, { error: "Restaurant required" })
        }

        const restaurant = await prisma.restaurant.findFirst({
            where: { id: restaurantId, active: true },
        })

        if (!restaurant) {
            return jsonResponse(400, {
                error: "Can only vote for restaurants in the pool",
            })
        }

        const existing = await prisma.lunchVote.findUnique({
            where: {
                roundId_userId_restaurantId: {
                    roundId: round.id,
                    userId: auth.user.id,
                    restaurantId,
                },
            },
        })

        if (existing) {
            await prisma.lunchVote.delete({ where: { id: existing.id } })
            return jsonResponse(200, { ok: true, selected: false })
        }

        const selectedCount = await prisma.lunchVote.count({
            where: { roundId: round.id, userId: auth.user.id },
        })

        if (selectedCount >= MAX_LUNCH_VOTES) {
            return jsonResponse(400, {
                error: `You can vote for at most ${MAX_LUNCH_VOTES} options`,
            })
        }

        await prisma.lunchVote.create({
            data: {
                roundId: round.id,
                userId: auth.user.id,
                restaurantId,
            },
        })

        return jsonResponse(200, { ok: true, selected: true })
    }

    if (action === "close") {
        const denied = requireAdmin(auth.user)
        if (denied) return denied

        if (round.status !== "voting" && round.status !== "nominating") {
            return jsonResponse(400, { error: "Round must be open to close" })
        }

        const roundVotes = await prisma.lunchVote.findMany({
            where: { roundId: round.id },
            select: { restaurantId: true, createdAt: true },
        })

        const winnerId = pickLunchWinner(
            roundVotes.map((vote) => ({
                restaurant_id: vote.restaurantId,
                created_at: vote.createdAt.toISOString(),
            }))
        )

        await prisma.lunchRound.update({
            where: { id: round.id },
            data: {
                status: "closed",
                winnerRestaurantId: winnerId,
                closedAt: new Date(),
            },
        })

        return jsonResponse(200, { ok: true, winnerRestaurantId: winnerId })
    }

    return jsonResponse(400, { error: "Unknown action" })
}
