"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

import { useAuth } from "@/features/auth"
import {
    useBookings,
    useCreateBooking,
    useDeleteBooking,
} from "@/features/manage-bookings"
import { formatLocalDate, ROOM_CONFIG, shiftLocalDate, type RoomId } from "@/entities/booking"
import { PageShell } from "@/widgets/app-shell"
import { RoomDaySchedule, type RoomBookRange } from "@/widgets/room-schedule"
import { BOOKING_TIME_SLOTS } from "@/entities/booking"
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@ppt/luminis"

export function RoomsPage() {
    const { user } = useAuth()
    const [date, setDate] = useState(() => formatLocalDate())
    const [dialogOpen, setDialogOpen] = useState(false)
    const [room, setRoom] = useState<RoomId>("room_a")
    const [startTime, setStartTime] = useState("10:00")
    const [endTime, setEndTime] = useState("11:00")
    const [title, setTitle] = useState("Meeting")

    const { data, isLoading } = useBookings(date)
    const bookMutation = useCreateBooking(date)
    const deleteMutation = useDeleteBooking(date)

    const today = formatLocalDate()
    const roomStatus = data?.roomStatus ?? []
    const bookings = data?.bookings ?? []

    const canCancelBooking = (booking: (typeof bookings)[number]) =>
        booking.user_id === user?.id || Boolean(user?.isAdmin)

    const openBookDialog = (roomId?: RoomId, range?: RoomBookRange) => {
        if (roomId) setRoom(roomId)
        if (range) {
            setStartTime(range.startTime)
            setEndTime(range.endTime)
        }
        setDialogOpen(true)
    }

    return (
        <PageShell
            title="Meeting rooms"
            description="See who is in each room and when they are free."
            actions={
                <>
                    <div className="w-full space-y-2 sm:w-auto">
                        <Label htmlFor="booking-date" className="block text-center sm:text-left">
                            Date
                        </Label>
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0"
                                aria-label="Previous day"
                                onClick={() => setDate((current) => shiftLocalDate(current, -1))}
                            >
                                <ChevronLeft />
                            </Button>
                            <Input
                                id="booking-date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-auto min-w-0 text-center"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0"
                                aria-label="Next day"
                                onClick={() => setDate((current) => shiftLocalDate(current, 1))}
                            >
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                    <Button className="w-full sm:w-auto" onClick={() => openBookDialog()}>
                        Book a room
                    </Button>
                </>
            }
        >
            <Card>
                <CardHeader className="flex flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div>
                        <CardTitle>Meeting rooms</CardTitle>
                        <CardDescription>
                            Drag on the timeline to book, or use the Book button
                        </CardDescription>
                    </div>
                    <Button
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() => openBookDialog()}
                    >
                        Book a room
                    </Button>
                </CardHeader>
                <CardContent>
                    <RoomDaySchedule
                        bookings={bookings}
                        date={date}
                        isLoading={isLoading}
                        roomStatus={date === today ? roomStatus : undefined}
                        onDateChange={setDate}
                        onBookRoom={(roomId, range) => openBookDialog(roomId, range)}
                        onCancelBooking={(id) =>
                            deleteMutation.mutate(id, {
                                onSuccess: () => toast.success("Booking cancelled"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
                        canCancelBooking={canCancelBooking}
                    />
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Book a meeting room</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Room</Label>
                            <Select value={room} onValueChange={(v: string) => setRoom(v as RoomId)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="room_a">
                                        {ROOM_CONFIG.room_a.emoji} {ROOM_CONFIG.room_a.label}
                                    </SelectItem>
                                    <SelectItem value="room_b">
                                        {ROOM_CONFIG.room_b.emoji} {ROOM_CONFIG.room_b.label}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Start</Label>
                                <Select value={startTime} onValueChange={setStartTime}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BOOKING_TIME_SLOTS.map((slot) => (
                                            <SelectItem key={slot} value={slot}>
                                                {slot}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>End</Label>
                                <Select value={endTime} onValueChange={setEndTime}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BOOKING_TIME_SLOTS.map((slot) => (
                                            <SelectItem key={slot} value={slot}>
                                                {slot}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            className="w-full sm:w-auto"
                            onClick={() =>
                                bookMutation.mutate(
                                    {
                                        room,
                                        bookingDate: date,
                                        startTime,
                                        endTime,
                                        title,
                                    },
                                    {
                                        onSuccess: () => {
                                            toast.success("Room booked")
                                            setDialogOpen(false)
                                        },
                                        onError: (e) => toast.error(e.message),
                                    }
                                )
                            }
                            disabled={bookMutation.isPending}
                        >
                            Book room
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageShell>
    )
}
