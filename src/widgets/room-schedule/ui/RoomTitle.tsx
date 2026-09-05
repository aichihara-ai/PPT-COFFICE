import { ROOM_CONFIG, type RoomId } from "@/entities/booking"

export function RoomTitle({ roomId }: { roomId: RoomId }) {
    const { label, emoji } = ROOM_CONFIG[roomId]
    return (
        <span className="inline-flex items-center gap-2">
            <span aria-hidden>{emoji}</span>
            {label}
        </span>
    )
}
