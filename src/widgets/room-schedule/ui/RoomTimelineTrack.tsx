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
} from "@/entities/booking/lib/room-schedule"
import { cn } from "@/shared/lib/utils"
import type { BookingRequest, RoomBooking } from "@/entities/booking"
import type { RoomId } from "@/entities/booking"
import { Button } from "@ppt/luminis"

type RoomTimelineTrackProps = {
    roomId: RoomId
    bookings: RoomBooking[]
    compact?: boolean
    nowMarkerLeft?: string | null
    rowClassName: string
    onDragBook?: (startTime: string, endTime: string) => void
    currentUserId?: number
    requests?: BookingRequest[]
    onRequestBooking?: (booking: RoomBooking) => void
    requestPending?: boolean
}

type DragState = {
    anchorMinutes: number
    currentMinutes: number
}

function userPendingRequest(
    requests: BookingRequest[] | undefined,
    bookingId: number,
    userId?: number
) {
    if (!userId || !requests) return false
    return requests.some(
        (request) =>
            request.booking_id === bookingId &&
            request.requester_id === userId &&
            request.status === "pending"
    )
}

export function RoomTimelineTrack({
    roomId,
    bookings,
    compact = false,
    nowMarkerLeft = null,
    rowClassName,
    onDragBook,
    currentUserId,
    requests,
    onRequestBooking,
    requestPending = false,
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
        if ((event.target as HTMLElement).closest("[data-booking-action]")) return

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
                compact ? "h-11" : "h-14",
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
                const isOwnBooking = booking.user_id === currentUserId
                const requestSent = userPendingRequest(requests, booking.id, currentUserId)
                const canRequest =
                    !isOwnBooking && onRequestBooking && !requestSent

                return (
                    <div
                        key={booking.id}
                        className={cn(
                            "group pointer-events-auto absolute inset-y-1 z-30 min-w-0 overflow-hidden rounded-md border",
                            rowClassName
                        )}
                        style={style}
                        title={`${booking.title} · ${formatBookingTime(booking.start_time)}–${formatBookingTime(booking.end_time)} · ${booking.user_name}`}
                    >
                        <div
                            className={cn(
                                "flex h-full flex-col justify-center px-1.5 py-0.5 transition-opacity",
                                (canRequest || requestSent) &&
                                    "group-hover:opacity-0 group-focus-within:opacity-0"
                            )}
                        >
                            <p className="truncate text-[11px] font-medium leading-tight">
                                {booking.title}
                            </p>
                            {!compact ? (
                                <p className="truncate text-[10px] leading-tight opacity-80">
                                    {formatBookingTime(booking.start_time)}–
                                    {formatBookingTime(booking.end_time)} · {booking.user_name}
                                </p>
                            ) : null}
                        </div>
                        {canRequest ? (
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                data-booking-action
                                className="absolute inset-0 z-10 h-full w-full min-w-0 rounded-md px-1 text-[10px] leading-none opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    onRequestBooking?.(booking)
                                }}
                                disabled={requestPending}
                            >
                                Request
                            </Button>
                        ) : requestSent ? (
                            <span className="absolute inset-0 z-10 flex items-center justify-center text-[10px] leading-none opacity-0 transition-opacity group-hover:opacity-80 group-focus-within:opacity-80">
                                Sent
                            </span>
                        ) : null}
                    </div>
                )
            })}
        </div>
    )
}
