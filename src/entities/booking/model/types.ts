export type RoomId = "room_a" | "room_b"

export type RoomBooking = {
    id: number
    room: RoomId
    booking_date: string
    start_time: string
    end_time: string
    title: string
    user_name: string
    user_id: number
}

export type BookingRequest = {
    id: number
    booking_id: number
    requester_id: number
    requester_name: string
    message: string | null
    status: "pending" | "accepted" | "declined"
    created_at: string
}

export type RoomStatus =
    | { room: RoomId; status: "busy"; until: string; title: string; bookedBy: string }
    | { room: RoomId; status: "free"; nextStart: string | null; nextTitle: string | null }

export const ROOM_CONFIG: Record<RoomId, { label: string; emoji: string; accent: "primary" | "warning" }> = {
    room_a: { label: "Big", emoji: "🟦", accent: "primary" },
    room_b: { label: "Small", emoji: "🟩", accent: "warning" },
}

export const ROOM_SWATCH_CLASS: Record<"primary" | "warning", string> = {
    primary: "bg-primary",
    warning: "bg-warning",
}

export const ROOM_LABELS: Record<RoomId, string> = {
    room_a: ROOM_CONFIG.room_a.label,
    room_b: ROOM_CONFIG.room_b.label,
}

export function timesOverlap(
    aStart: string,
    aEnd: string,
    bStart: string,
    bEnd: string
) {
    return aStart < bEnd && bStart < aEnd
}

export function formatTimeValue(value: Date | string) {
    if (value instanceof Date) {
        const hours = value.getUTCHours()
        const minutes = value.getUTCMinutes()
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
    }

    const match = String(value).match(/(\d{2}):(\d{2})/)
    if (match) return `${match[1]}:${match[2]}`

    return String(value).slice(0, 5)
}
