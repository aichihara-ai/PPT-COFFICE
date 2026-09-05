import { useRef, useState } from "react"

import {
    bookingBlockStyle,
    formatBookingTime,
    minuteOverlapsBooking,
    minutesFromPointerX,
    minutesToTimeString,
    rangeOverlapsBooking,
    selectionBlockStyle,
    SCHEDULE_SLOT_MINUTES,
} from "@/entities/booking"
import { cn } from "@/shared/lib/cn"
import type { RoomBooking } from "@/entities/booking"
import type { RoomId } from "@/entities/booking"

type RoomTimelineTrackProps = {
    roomId: RoomId
    bookings: RoomBooking[]
    compact?: boolean
    nowMarkerLeft?: string | null
    rowClassName: string
    onDragBook?: (startTime: string, endTime: string) => void
}

type DragState = {
    anchorMinutes: number
    currentMinutes: number
}

export function RoomTimelineTrack({
    roomId,
    bookings,
    compact = false,
    nowMarkerLeft = null,
    rowClassName,
    onDragBook,
}: RoomTimelineTrackProps) {
    const trackRef = useRef<HTMLDivElement>(null)
    const [drag, setDrag] = useState<DragState | null>(null)
    const canDrag = Boolean(onDragBook)

    const finishDrag = (state: DragState | null) => {
        if (!state || !onDragBook) {
            setDrag(null)
            return
        }

        const start = Math.min(state.anchorMinutes, state.currentMinutes)
        const end = Math.max(state.anchorMinutes, state.currentMinutes)
        const duration = end - start

        if (duration >= SCHEDULE_SLOT_MINUTES && !rangeOverlapsBooking(start, end, bookings)) {
            onDragBook(minutesToTimeString(start), minutesToTimeString(end))
        }

        setDrag(null)
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!canDrag || !trackRef.current || event.button !== 0) return

        const minutes = minutesFromPointerX(trackRef.current, event.clientX)
        if (minuteOverlapsBooking(minutes, bookings)) return

        event.currentTarget.setPointerCapture(event.pointerId)
        setDrag({ anchorMinutes: minutes, currentMinutes: minutes })
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!drag || !trackRef.current) return

        const minutes = minutesFromPointerX(trackRef.current, event.clientX)
        setDrag((current) =>
            current ? { ...current, currentMinutes: minutes } : current
        )
    }

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!drag) return

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }

        finishDrag(drag)
    }

    const handlePointerCancel = () => {
        setDrag(null)
    }

    const selection =
        drag &&
        selectionBlockStyle(drag.anchorMinutes, drag.currentMinutes)

    const selectionValid =
        selection &&
        selection.endMinutes - selection.startMinutes >= SCHEDULE_SLOT_MINUTES &&
        !rangeOverlapsBooking(selection.startMinutes, selection.endMinutes, bookings)

    return (
        <div
            ref={trackRef}
            className={cn(
                "relative min-w-0 flex-1 rounded-lg border border-dashed border-border-medium bg-muted/40 touch-none select-none",
                compact ? "h-10" : "h-12",
                canDrag && "cursor-crosshair"
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            aria-label={`${roomId} schedule — drag to book`}
        >
            {nowMarkerLeft ? (
                <div
                    data-now-marker
                    className="pointer-events-none absolute inset-y-1 z-10 w-0.5 bg-destructive"
                    style={{ left: nowMarkerLeft }}
                    aria-hidden
                />
            ) : null}

            {selection && selection.width !== "0%" ? (
                <div
                    className={cn(
                        "pointer-events-none absolute inset-y-1 z-20 rounded-md border-2 border-dashed px-2 py-1 text-xs leading-tight",
                        selectionValid
                            ? "border-primary bg-primary/20 text-foreground"
                            : "border-destructive/60 bg-destructive/10 text-destructive"
                    )}
                    style={{ left: selection.left, width: selection.width }}
                >
                    <p className="truncate font-medium">
                        {formatBookingTime(minutesToTimeString(selection.startMinutes))}
                        –
                        {formatBookingTime(minutesToTimeString(selection.endMinutes))}
                    </p>
                </div>
            ) : null}

            {bookings.map((booking) => {
                const style = bookingBlockStyle(booking)
                return (
                    <div
                        key={booking.id}
                        className={cn(
                            "pointer-events-none absolute inset-y-1 z-30 overflow-hidden rounded-md border px-2 py-1 text-xs leading-tight",
                            rowClassName
                        )}
                        style={style}
                        title={`${booking.title} · ${formatBookingTime(booking.start_time)}–${formatBookingTime(booking.end_time)} · ${booking.user_name}`}
                    >
                        <p className="truncate font-medium">{booking.title}</p>
                        {!compact ? (
                            <p className="truncate text-muted-foreground">
                                {formatBookingTime(booking.start_time)}–
                                {formatBookingTime(booking.end_time)}
                            </p>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}
