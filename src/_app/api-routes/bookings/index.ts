import "server-only"

import type { NextRequest } from "next/server"
import { z } from "zod"

import { formatTimeValue, timesOverlap } from "@/entities/booking"
import { prisma } from "@/shared/db/index.server"
import { jsonResponse, methodNotAllowed, requireUser } from "@/shared/auth/index.server"

const OFFICE_TIMEZONE = "America/Vancouver"

function officeCalendarParts(now: Date = new Date()) {
    const date = now.toLocaleDateString("en-CA", { timeZone: OFFICE_TIMEZONE })
    const time = now.toLocaleTimeString("en-GB", {
        timeZone: OFFICE_TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })

    return { date, time }
}

const bookingBodySchema = z.object({
    room: z.enum(["room_a", "room_b"]),
    bookingDate: z.string().min(1),
    startTime: z.string().min(1),
    endTime: z.string().min(1),
    title: z.string().optional(),
})

function formatBookingRow(
    row: {
        id: number
        room: string
        bookingDate: Date
        startTime: Date
        endTime: Date
        title: string
        userId: number
        user: { name: string }
    }
) {
    return {
        id: row.id,
        room: row.room,
        booking_date: row.bookingDate.toISOString().slice(0, 10),
        start_time: formatTimeValue(row.startTime),
        end_time: formatTimeValue(row.endTime),
        title: row.title,
        user_id: row.userId,
        user_name: row.user.name,
    }
}

function buildRoomStatus(
    rows: ReturnType<typeof formatBookingRow>[],
    viewedDate: string
) {
    const { date: today, time: currentTime } = officeCalendarParts()
    const isToday = viewedDate === today

    return (["room_a", "room_b"] as const).map((room) => {
        const roomBookings = rows.filter((b) => b.room === room)
        const active =
            isToday &&
            roomBookings.find(
                (b) =>
                    b.start_time <= currentTime && b.end_time > currentTime
            )

        if (active) {
            return {
                room,
                status: "busy" as const,
                until: active.end_time,
                title: active.title,
                bookedBy: active.user_name,
            }
        }

        const next =
            isToday &&
            roomBookings.find((b) => b.start_time > currentTime)

        return {
            room,
            status: "free" as const,
            nextStart: next ? next.start_time : null,
            nextTitle: next?.title ?? null,
        }
    })
}

export async function GET(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const date =
        request.nextUrl.searchParams.get("date") ??
        new Date().toISOString().slice(0, 10)

    const rows = await prisma.booking.findMany({
        where: { bookingDate: new Date(`${date}T00:00:00.000Z`) },
        include: { user: { select: { name: true } } },
        orderBy: [{ room: "asc" }, { startTime: "asc" }],
    })

    const bookings = rows.map(formatBookingRow)

    return jsonResponse(200, {
        bookings,
        roomStatus: buildRoomStatus(bookings, date),
        date,
    })
}

export async function POST(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const parsed = bookingBodySchema.safeParse(await request.json())
    if (!parsed.success) {
        return jsonResponse(400, { error: "Missing booking fields" })
    }

    const { room, bookingDate, startTime, endTime, title } = parsed.data
    const bookingTitle = title?.trim() || "Meeting"

    if (endTime <= startTime) {
        return jsonResponse(400, { error: "End time must be after start" })
    }

    const conflicts = await prisma.booking.findMany({
        where: {
            room,
            bookingDate: new Date(`${bookingDate}T00:00:00.000Z`),
        },
    })

    const hasConflict = conflicts.some((b) =>
        timesOverlap(
            startTime,
            endTime,
            formatTimeValue(b.startTime),
            formatTimeValue(b.endTime)
        )
    )

    if (hasConflict) {
        return jsonResponse(409, { error: "Room is already booked for that time" })
    }

    const created = await prisma.booking.create({
        data: {
            room,
            userId: auth.user.id,
            bookingDate: new Date(`${bookingDate}T00:00:00.000Z`),
            startTime: new Date(`1970-01-01T${startTime}:00.000Z`),
            endTime: new Date(`1970-01-01T${endTime}:00.000Z`),
            title: bookingTitle,
        },
        include: { user: { select: { name: true } } },
    })

    return jsonResponse(201, { booking: formatBookingRow(created) })
}

export async function DELETE(request: NextRequest) {
    const auth = await requireUser(request)
    if ("error" in auth) return auth.error

    const id = Number(request.nextUrl.searchParams.get("id"))
    if (!id) {
        return jsonResponse(400, { error: "Booking id required" })
    }

    const booking = await prisma.booking.findUnique({ where: { id } })
    if (!booking) {
        return jsonResponse(404, { error: "Booking not found" })
    }

    if (booking.userId !== auth.user.id && !auth.user.isAdmin) {
        return jsonResponse(403, { error: "Cannot delete this booking" })
    }

    await prisma.booking.delete({ where: { id } })
    return jsonResponse(200, { ok: true })
}

export async function PATCH() {
    return methodNotAllowed()
}
