import { RoomTimelineTrack } from "@/components/rooms/RoomTimelineTrack"
import { RoomTitle } from "@/components/rooms/RoomTitle"
import {
    bookingsForRoom,
    formatBookingTime,
    nowMarkerStyle,
    SCHEDULE_HOUR_LABELS,
    sortBookings,
} from "@/lib/roomSchedule"
import { cn } from "@/lib/utils"
import type { RoomBooking, RoomStatus } from "@/types/booking"
import type { RoomId } from "@/types"
import { Badge, Button } from "@ppt/luminis"

const ROOM_IDS: RoomId[] = ["room_a", "room_b"]

const ROOM_ROW_CLASS: Record<RoomId, string> = {
    room_a: "border-primary/50 bg-primary/15 text-foreground",
    room_b: "border-secondary-foreground/30 bg-secondary text-foreground",
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
    onBookRoom?: (roomId: RoomId, range?: RoomBookRange) => void
    onCancelBooking?: (id: number) => void
    canCancelBooking?: (booking: RoomBooking) => boolean
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
    onBookRoom,
    onCancelBooking,
    canCancelBooking,
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
                    {canBook ? (
                        <p className="text-xs text-muted-foreground">
                            Drag on a room row to pick a time (Outlook-style)
                        </p>
                    ) : null}
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
                                                        </p>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <RoomTimelineTrack
                                                roomId={roomId}
                                                bookings={roomBookings}
                                                compact={compact}
                                                nowMarkerLeft={nowMarker?.left ?? null}
                                                rowClassName={ROOM_ROW_CLASS[roomId]}
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
                                            {canBook ? (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="shrink-0"
                                                    onClick={() => onBookRoom?.(roomId)}
                                                >
                                                    Book
                                                </Button>
                                            ) : null}
                                        </div>
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
                            {sortedBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5"
                                >
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
                                            {booking.user_name}
                                        </p>
                                    </div>
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    )
}
