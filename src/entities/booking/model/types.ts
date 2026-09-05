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

export type RoomStatus =
    | { room: RoomId; status: "busy"; until: string; title: string; bookedBy: string }
    | { room: RoomId; status: "free"; nextStart: string | null; nextTitle: string | null }

export const ROOM_CONFIG: Record<RoomId, { label: string; emoji: string }> = {
    room_a: { label: "Big", emoji: "🟦" },
    room_b: { label: "Small", emoji: "🟩" },
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
    return String(value).slice(0, 5)
}
