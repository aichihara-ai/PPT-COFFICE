import { RoomTimelineTrack } from "@/widgets/room-schedule/ui/RoomTimelineTrack"
import { RoomLegend, RoomTitle } from "@/widgets/room-schedule/ui/RoomTitle"
import {
    bookingsForRoom,
    formatBookingTime,
    nowMarkerStyle,
    SCHEDULE_HOUR_LABELS,
    sortBookings,
} from "@/entities/booking/lib/room-schedule"
import { cn } from "@/shared/lib/utils"
import type { BookingRequest, RoomBooking, RoomStatus } from "@/entities/booking"
import type { RoomId } from "@/entities/booking"
import { Badge, Button } from "@ppt/luminis"

const ROOM_IDS: RoomId[] = ["room_a", "room_b"]

const ROOM_ROW_CLASS: Record<RoomId, string> = {
    room_a: "border-primary/50 bg-primary/15 text-foreground",
    room_b: "border-warning/50 bg-warning-subtle text-foreground",
}

export type RoomBookRange = {
    startTime: string
    endTime: string
}

type RoomDayScheduleProps = {
    bookings: RoomBooking[]
    date: string
    isLoading?: boolean
    compact?: boolean
    showAgenda?: boolean
    roomStatus?: RoomStatus[]
    requests?: BookingRequest[]
    currentUserId?: number
    onBookRoom?: (roomId: RoomId, range?: RoomBookRange) => void
    onCancelBooking?: (id: number) => void
    canCancelBooking?: (booking: RoomBooking) => boolean
    onRequestBooking?: (booking: RoomBooking) => void
    onRespondRequest?: (requestId: number, accept: boolean) => void
    requestPending?: boolean
    respondPending?: boolean
}

function pendingRequestsForBooking(requests: BookingRequest[], bookingId: number) {
    return requests.filter(
        (request) => request.booking_id === bookingId && request.status === "pending"
    )
}

function userPendingRequest(
    requests: BookingRequest[],
    bookingId: number,
    userId?: number
) {
    if (!userId) return null
    return requests.find(
        (request) =>
            request.booking_id === bookingId &&
            request.requester_id === userId &&
            request.status === "pending"
    )
}

function formatScheduleDate(date: string) {
    return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
    })
}

function statusForRoom(roomStatus: RoomStatus[] | undefined, roomId: RoomId) {
    return roomStatus?.find((entry) => entry.room === roomId)
}

export function RoomDaySchedule({
    bookings,
    date,
    isLoading = false,
    compact = false,
    showAgenda = true,
    roomStatus,
    requests = [],
    currentUserId,
    onBookRoom,
    onCancelBooking,
    canCancelBooking,
    onRequestBooking,
    onRespondRequest,
    requestPending = false,
    respondPending = false,
}: RoomDayScheduleProps) {
    const sortedBookings = sortBookings(bookings)
    const nowMarker = nowMarkerStyle(date)
    const showLiveStatus = Boolean(roomStatus?.length)
    const canBook = Boolean(onBookRoom)

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">Loading schedule…</p>
    }

    return (
        <div className={showAgenda ? "space-y-4" : "space-y-0"}>
            <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                        {formatScheduleDate(date)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <RoomLegend />
                        {canBook ? (
                            <p className="text-xs text-muted-foreground">
                                Drag on a room row to pick a time (Outlook-style)
                            </p>
                        ) : null}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className={cn("min-w-[32rem]", compact ? "space-y-3" : "space-y-4")}>
                        <div className="grid grid-cols-[5.5rem_1fr] items-end gap-3">
                            <span className="text-xs text-muted-foreground" />
                            <div className="relative border-b border-border pb-1">
                                <div className="grid grid-cols-11 text-xs text-muted-foreground">
                                    {SCHEDULE_HOUR_LABELS.map((hour) => (
                                        <span key={hour} className="text-center">
                                            {hour === 12
                                                ? "12p"
                                                : hour > 12
                                                  ? `${hour - 12}p`
                                                  : `${hour}a`}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {ROOM_IDS.map((roomId) => {
                            const roomBookings = bookingsForRoom(bookings, roomId)
                            const live = statusForRoom(roomStatus, roomId)

                            return (
                                <div key={roomId} className="space-y-2">
                                    <div className="grid grid-cols-[5.5rem_1fr] items-start gap-3">
                                        <div className="space-y-1 text-sm font-medium">
                                            <RoomTitle roomId={roomId} />
                                            {showLiveStatus && live ? (
                                                <div className="space-y-1">
                                                    <Badge
                                                        variant={
                                                            live.status === "busy"
                                                                ? "destructive"
                                                                : "secondary"
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {live.status === "busy" ? "Busy" : "Free"}
                                                    </Badge>
                                                    {live.status === "busy" ? (
                                                        <p className="text-xs text-muted-foreground">
                                                            Until {live.until}
                                                        </p>
                                                    ) : live.nextStart ? (
                                                        <p className="text-xs text-muted-foreground">
                                                            Next {live.nextStart}
                                                            {live.nextTitle
                                                                ? ` · ${live.nextTitle}`
                                                                : ""}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </div>
                                        <RoomTimelineTrack
                                            roomId={roomId}
                                            bookings={roomBookings}
                                            compact={compact}
                                            nowMarkerLeft={nowMarker?.left ?? null}
                                            rowClassName={ROOM_ROW_CLASS[roomId]}
                                            currentUserId={currentUserId}
                                            requests={requests}
                                            onRequestBooking={onRequestBooking}
                                            requestPending={requestPending}
                                            onDragBook={
                                                canBook
                                                    ? (startTime, endTime) =>
                                                          onBookRoom?.(roomId, {
                                                              startTime,
                                                              endTime,
                                                          })
                                                    : undefined
                                            }
                                        />
                                    </div>
                                    {showLiveStatus && live?.status === "busy" ? (
                                        <p className="pl-[5.5rem] text-xs text-muted-foreground">
                                            {live.title} · {live.bookedBy}
                                        </p>
                                    ) : null}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {nowMarker ? (
                    <p className="text-xs text-muted-foreground">
                        Red line = current time
                    </p>
                ) : null}
            </div>

            {showAgenda ? (
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Agenda
                    </p>
                    {sortedBookings.length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                            No bookings scheduled for this day.
                        </p>
                    ) : (
                        <div className="divide-y divide-border rounded-lg border">
                            {sortedBookings.map((booking) => {
                                const isOwnBooking = booking.user_id === currentUserId
                                const incoming = pendingRequestsForBooking(requests, booking.id)
                                const outgoing = userPendingRequest(
                                    requests,
                                    booking.id,
                                    currentUserId
                                )
                                const canRequest =
                                    !isOwnBooking && onRequestBooking && !outgoing

                                return (
                                <div
                                    key={booking.id}
                                    className="space-y-2 px-2.5 py-2"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="min-w-0 text-xs leading-snug">
                                        <p className="font-medium text-foreground">
                                            {formatBookingTime(booking.start_time)}–
                                            {formatBookingTime(booking.end_time)}
                                            <span className="mx-1.5 text-muted-foreground">·</span>
                                            <RoomTitle roomId={booking.room} />
                                            <span className="mx-1.5 text-muted-foreground">·</span>
                                            {booking.title}
                                        </p>
                                        <p className="truncate text-muted-foreground">
                                            Booked by {booking.user_name}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1">
                                    {canRequest ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => onRequestBooking?.(booking)}
                                            disabled={requestPending}
                                        >
                                            Request
                                        </Button>
                                    ) : null}
                                    {onCancelBooking && canCancelBooking?.(booking) ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs"
                                            onClick={() => onCancelBooking(booking.id)}
                                        >
                                            Cancel
                                        </Button>
                                    ) : null}
                                    {outgoing ? (
                                        <Badge variant="secondary" className="text-xs">
                                            Request sent
                                        </Badge>
                                    ) : null}
                                    </div>
                                    </div>

                                    {isOwnBooking && incoming.length > 0 ? (
                                        <div className="space-y-2 rounded-md border border-dashed border-border bg-muted/30 p-2">
                                            {incoming.map((request) => (
                                                <div
                                                    key={request.id}
                                                    className="flex flex-wrap items-center justify-between gap-2"
                                                >
                                                    <div className="min-w-0 text-xs">
                                                        <p className="font-medium">
                                                            {request.requester_name} wants this room
                                                        </p>
                                                        {request.message ? (
                                                            <p className="text-muted-foreground">
                                                                “{request.message}”
                                                            </p>
                                                        ) : (
                                                            <p className="text-muted-foreground">
                                                                Accepting releases the booking so
                                                                they can book it.
                                                            </p>
                                                        )}
                                                    </div>
                                                    {onRespondRequest ? (
                                                        <div className="flex gap-1">
                                                            <Button
                                                                size="sm"
                                                                className="h-7 px-2 text-xs"
                                                                onClick={() =>
                                                                    onRespondRequest(
                                                                        request.id,
                                                                        true
                                                                    )
                                                                }
                                                                disabled={respondPending}
                                                            >
                                                                Release room
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-7 px-2 text-xs"
                                                                onClick={() =>
                                                                    onRespondRequest(
                                                                        request.id,
                                                                        false
                                                                    )
                                                                }
                                                                disabled={respondPending}
                                                            >
                                                                Decline
                                                            </Button>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    )
}
