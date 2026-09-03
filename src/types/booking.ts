import type { RoomId } from "@/types"

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
