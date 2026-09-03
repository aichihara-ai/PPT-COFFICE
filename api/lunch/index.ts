import type { VercelRequest, VercelResponse } from "@vercel/node"

import { getSql } from "../_lib/db.js"
import {
    methodNotAllowed,
    requireAdmin,
    requireUser,
    sendJson,
} from "../_lib/auth.js"

async function getActiveRound(sql: ReturnType<typeof getSql>) {
    const rounds = await sql`
        SELECT r.id, r.status, r.created_at, r.winner_restaurant_id, r.closed_at,
               r.voting_ends_at, r.created_by, u.name AS created_by_name
        FROM lunch_rounds r
        JOIN users u ON u.id = r.created_by
        WHERE r.status IN ('nominating', 'voting')
        ORDER BY r.created_at DESC
        LIMIT 1
    `
    return rounds[0] ?? null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await requireUser(req, res)
    if (!user) return

    const sql = getSql()

    if (req.method === "GET") {
        const round = await getActiveRound(sql)

        if (!round) {
            const lastClosed = await sql`
                SELECT r.id, r.status, r.closed_at, r.winner_restaurant_id,
                       wr.name AS winner_name
                FROM lunch_rounds r
                LEFT JOIN restaurants wr ON wr.id = r.winner_restaurant_id
                WHERE r.status = 'closed'
                ORDER BY r.closed_at DESC NULLS LAST
                LIMIT 1
            `
            return sendJson(res, 200, { round: null, lastClosed: lastClosed[0] ?? null })
        }

        const nominations = await sql`
            SELECT n.user_id, n.restaurant_id, n.created_at,
                   u.name AS user_name, r.name AS restaurant_name
            FROM lunch_nominations n
            JOIN users u ON u.id = n.user_id
            JOIN restaurants r ON r.id = n.restaurant_id
            WHERE n.round_id = ${round.id}
            ORDER BY n.created_at
        `

        const nominationCounts = await sql`
            SELECT n.restaurant_id, r.name AS restaurant_name, COUNT(*)::int AS count,
                   MIN(n.created_at) AS first_nominated_at
            FROM lunch_nominations n
            JOIN restaurants r ON r.id = n.restaurant_id
            WHERE n.round_id = ${round.id}
            GROUP BY n.restaurant_id, r.name
            ORDER BY count DESC, first_nominated_at ASC
        `

        const candidates = await sql`
            SELECT c.restaurant_id, r.name AS restaurant_name, c.nomination_count
            FROM lunch_candidates c
            JOIN restaurants r ON r.id = c.restaurant_id
            WHERE c.round_id = ${round.id}
            ORDER BY c.nomination_count DESC, r.name
        `

        const votes = await sql`
            SELECT v.user_id, v.restaurant_id, u.name AS user_name, r.name AS restaurant_name
            FROM lunch_votes v
            JOIN users u ON u.id = v.user_id
            JOIN restaurants r ON r.id = v.restaurant_id
            WHERE v.round_id = ${round.id}
        `

        const voteCounts = await sql`
            SELECT v.restaurant_id, r.name AS restaurant_name, COUNT(*)::int AS count
            FROM lunch_votes v
            JOIN restaurants r ON r.id = v.restaurant_id
            WHERE v.round_id = ${round.id}
            GROUP BY v.restaurant_id, r.name
            ORDER BY count DESC, r.name
        `

        const users = await sql`SELECT id, name FROM users ORDER BY name`

        return sendJson(res, 200, {
            round,
            nominations,
            nominationCounts,
            candidates,
            votes,
            voteCounts,
            users,
            myNomination: nominations.find((n) => n.user_id === user.id) ?? null,
            myVote: votes.find((v) => v.user_id === user.id) ?? null,
        })
    }

    if (req.method === "POST") {
        const body = req.body as { action?: string; restaurantId?: number }
        const action = body.action

        if (action === "start") {
            if (!requireAdmin(user, res)) return

            const existing = await getActiveRound(sql)
            if (existing) {
                return sendJson(res, 409, { error: "A lunch round is already active" })
            }

            const rows = await sql`
                INSERT INTO lunch_rounds (status, created_by)
                VALUES ('nominating', ${user.id})
                RETURNING id, status, created_at
            `
            return sendJson(res, 201, { round: rows[0] })
        }

        const round = await getActiveRound(sql)
        if (!round) {
            return sendJson(res, 404, { error: "No active lunch round" })
        }

        if (action === "nominate") {
            if (round.status !== "nominating") {
                return sendJson(res, 400, { error: "Nomination phase is closed" })
            }

            const restaurantId = Number(body.restaurantId)
            if (!restaurantId) {
                return sendJson(res, 400, { error: "Restaurant required" })
            }

            await sql`
                INSERT INTO lunch_nominations (round_id, user_id, restaurant_id)
                VALUES (${round.id}, ${user.id}, ${restaurantId})
                ON CONFLICT (round_id, user_id)
                DO UPDATE SET restaurant_id = ${restaurantId}, created_at = NOW()
            `

            return sendJson(res, 200, { ok: true })
        }

        if (action === "lock") {
            if (!user.isAdmin && round.created_by !== user.id) {
                return sendJson(res, 403, { error: "Only admin or round starter can lock candidates" })
            }

            if (round.status !== "nominating") {
                return sendJson(res, 400, { error: "Candidates already locked" })
            }

            const top = await sql`
                SELECT n.restaurant_id, COUNT(*)::int AS nomination_count,
                       MIN(n.created_at) AS first_nominated_at
                FROM lunch_nominations n
                WHERE n.round_id = ${round.id}
                GROUP BY n.restaurant_id
                ORDER BY nomination_count DESC, first_nominated_at ASC
                LIMIT 3
            `

            if (top.length === 0) {
                return sendJson(res, 400, { error: "No nominations yet" })
            }

            await sql`DELETE FROM lunch_candidates WHERE round_id = ${round.id}`

            for (const row of top) {
                await sql`
                    INSERT INTO lunch_candidates (round_id, restaurant_id, nomination_count)
                    VALUES (${round.id}, ${row.restaurant_id}, ${row.nomination_count})
                `
            }

            await sql`
                UPDATE lunch_rounds
                SET status = 'voting', voting_ends_at = NOW() + INTERVAL '15 minutes'
                WHERE id = ${round.id}
            `

            return sendJson(res, 200, { ok: true, candidateCount: top.length })
        }

        if (action === "vote") {
            if (round.status !== "voting") {
                return sendJson(res, 400, { error: "Voting is not open" })
            }

            const restaurantId = Number(body.restaurantId)
            if (!restaurantId) {
                return sendJson(res, 400, { error: "Restaurant required" })
            }

            const candidate = await sql`
                SELECT id FROM lunch_candidates
                WHERE round_id = ${round.id} AND restaurant_id = ${restaurantId}
            `
            if (!candidate[0]) {
                return sendJson(res, 400, { error: "Can only vote for locked candidates" })
            }

            await sql`
                INSERT INTO lunch_votes (round_id, user_id, restaurant_id)
                VALUES (${round.id}, ${user.id}, ${restaurantId})
                ON CONFLICT (round_id, user_id)
                DO UPDATE SET restaurant_id = ${restaurantId}
            `

            return sendJson(res, 200, { ok: true })
        }

        if (action === "close") {
            if (!requireAdmin(user, res)) return

            if (round.status !== "voting") {
                return sendJson(res, 400, { error: "Round must be in voting phase" })
            }

            const winner = await sql`
                SELECT v.restaurant_id, COUNT(*)::int AS count
                FROM lunch_votes v
                WHERE v.round_id = ${round.id}
                GROUP BY v.restaurant_id
                ORDER BY count DESC
                LIMIT 1
            `

            const winnerId = winner[0]?.restaurant_id ?? null

            await sql`
                UPDATE lunch_rounds
                SET status = 'closed', winner_restaurant_id = ${winnerId}, closed_at = NOW()
                WHERE id = ${round.id}
            `

            return sendJson(res, 200, { ok: true, winnerRestaurantId: winnerId })
        }

        return sendJson(res, 400, { error: "Unknown action" })
    }

    return methodNotAllowed(res)
}
