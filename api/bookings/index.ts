import type { VercelRequest, VercelResponse } from "@vercel/node"

import { getSql } from "../_lib/db.js"
import {
    methodNotAllowed,
    requireAdmin,
    requireUser,
    sendJson,
} from "../_lib/auth.js"

type BookingBody = {
    room?: string
    bookingDate?: string
    startTime?: string
    endTime?: string
    title?: string
}

function timesOverlap(
    aStart: string,
    aEnd: string,
    bStart: string,
    bEnd: string
) {
    return aStart < bEnd && bStart < aEnd
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = await requireUser(req, res)
    if (!user) return

    const sql = getSql()

    if (req.method === "GET") {
        const date =
            typeof req.query.date === "string"
                ? req.query.date
                : new Date().toISOString().slice(0, 10)

        const rows = await sql`
            SELECT b.id, b.room, b.booking_date, b.start_time, b.end_time, b.title,
                   u.name AS user_name, b.user_id
            FROM bookings b
            JOIN users u ON u.id = b.user_id
            WHERE b.booking_date = ${date}
            ORDER BY b.room, b.start_time
        `

        const now = new Date()
        const today = now.toISOString().slice(0, 10)
        const currentTime = now.toTimeString().slice(0, 5)

        const status = (["room_a", "room_b"] as const).map((room) => {
            const roomBookings = rows.filter((b) => b.room === room)
            const active = roomBookings.find(
                (b) =>
                    b.booking_date === today &&
                    String(b.start_time).slice(0, 5) <= currentTime &&
                    String(b.end_time).slice(0, 5) > currentTime
            )

            if (active) {
                return {
                    room,
                    status: "busy" as const,
                    until: String(active.end_time).slice(0, 5),
                    title: active.title,
                    bookedBy: active.user_name,
                }
            }

            const next = roomBookings.find(
                (b) =>
                    b.booking_date === today &&
                    String(b.start_time).slice(0, 5) > currentTime
            )

            return {
                room,
                status: "free" as const,
                nextStart: next ? String(next.start_time).slice(0, 5) : null,
                nextTitle: next?.title ?? null,
            }
        })

        return sendJson(res, 200, { bookings: rows, roomStatus: status, date })
    }

    if (req.method === "POST") {
        const body = req.body as BookingBody
        const room = body.room
        const bookingDate = body.bookingDate
        const startTime = body.startTime
        const endTime = body.endTime
        const title = body.title?.trim() || "Meeting"

        if (!room || !bookingDate || !startTime || !endTime) {
            return sendJson(res, 400, { error: "Missing booking fields" })
        }

        if (!["room_a", "room_b"].includes(room)) {
            return sendJson(res, 400, { error: "Invalid room" })
        }

        if (endTime <= startTime) {
            return sendJson(res, 400, { error: "End time must be after start" })
        }

        const conflicts = await sql`
            SELECT id, start_time, end_time
            FROM bookings
            WHERE room = ${room} AND booking_date = ${bookingDate}
        `

        const hasConflict = conflicts.some((b) =>
            timesOverlap(
                startTime,
                endTime,
                String(b.start_time).slice(0, 5),
                String(b.end_time).slice(0, 5)
            )
        )

        if (hasConflict) {
            return sendJson(res, 409, { error: "Room is already booked for that time" })
        }

        const rows = await sql`
            INSERT INTO bookings (room, user_id, booking_date, start_time, end_time, title)
            VALUES (${room}, ${user.id}, ${bookingDate}, ${startTime}, ${endTime}, ${title})
            RETURNING id, room, booking_date, start_time, end_time, title, user_id
        `

        return sendJson(res, 201, { booking: rows[0] })
    }

    if (req.method === "DELETE") {
        const id = Number(req.query.id)
        if (!id) {
            return sendJson(res, 400, { error: "Booking id required" })
        }

        const rows = await sql`SELECT user_id FROM bookings WHERE id = ${id}`
        const booking = rows[0]
        if (!booking) {
            return sendJson(res, 404, { error: "Booking not found" })
        }

        if (booking.user_id !== user.id && !user.isAdmin) {
            return sendJson(res, 403, { error: "Cannot delete this booking" })
        }

        await sql`DELETE FROM bookings WHERE id = ${id}`
        return sendJson(res, 200, { ok: true })
    }

    return methodNotAllowed(res)
}
