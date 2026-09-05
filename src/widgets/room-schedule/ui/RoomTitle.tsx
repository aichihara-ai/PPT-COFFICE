import { ROOM_CONFIG, ROOM_SWATCH_CLASS, type RoomId } from "@/entities/booking"
import { cn } from "@/shared/lib/utils"

export function RoomSwatch({
    roomId,
    className,
}: {
    roomId: RoomId
    className?: string
}) {
    const { accent } = ROOM_CONFIG[roomId]
    return (
        <span
            aria-hidden
            className={cn("inline-block size-2 shrink-0 rounded-full", ROOM_SWATCH_CLASS[accent], className)}
        />
    )
}

export function RoomTitle({
    roomId,
    showSwatch = true,
    className,
}: {
    roomId: RoomId
    showSwatch?: boolean
    className?: string
}) {
    const { label } = ROOM_CONFIG[roomId]
    return (
        <span className={cn("inline-flex items-center gap-1.5", className)}>
            {showSwatch ? <RoomSwatch roomId={roomId} /> : null}
            {label}
        </span>
    )
}

export function RoomLegend() {
    return (
        <span className="inline-flex items-center gap-3 text-xs text-muted-foreground">
            {(["room_a", "room_b"] as const).map((roomId) => (
                <RoomTitle key={roomId} roomId={roomId} />
            ))}
        </span>
    )
}
