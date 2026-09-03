import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { apiFetch } from "@/lib/api"
import { RoomDaySchedule, type RoomBookRange } from "@/components/rooms/RoomDaySchedule"
import { PageShell } from "@/components/layouts/PageShell"
import { useAuth } from "@/providers/AuthProvider"
import { BOOKING_TIME_SLOTS } from "@/lib/roomSchedule"
import { ROOM_CONFIG, type RoomId } from "@/types"
import type { RoomBooking, RoomStatus } from "@/types/booking"
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

type Booking = RoomBooking

export function RoomsPage() {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
    const [dialogOpen, setDialogOpen] = useState(false)
    const [room, setRoom] = useState<RoomId>("room_a")
    const [startTime, setStartTime] = useState("10:00")
    const [endTime, setEndTime] = useState("11:00")
    const [title, setTitle] = useState("Meeting")

    const { data, isLoading } = useQuery({
        queryKey: ["bookings", date],
        queryFn: () =>
            apiFetch<{
                bookings: Booking[]
                roomStatus: RoomStatus[]
            }>(`/api/bookings?date=${date}`),
    })

    const bookMutation = useMutation({
        mutationFn: () =>
            apiFetch("/api/bookings", {
                method: "POST",
                body: JSON.stringify({
                    room,
                    bookingDate: date,
                    startTime,
                    endTime,
                    title,
                }),
            }),
        onSuccess: () => {
            toast.success("Room booked")
            setDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) =>
            apiFetch(`/api/bookings?id=${id}`, { method: "DELETE" }),
        onSuccess: () => {
            toast.success("Booking cancelled")
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const today = new Date().toISOString().slice(0, 10)
    const roomStatus = data?.roomStatus ?? []
    const bookings = data?.bookings ?? []

    const canCancelBooking = (booking: Booking) =>
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
                    <div className="space-y-2">
                        <Label htmlFor="booking-date">Date</Label>
                        <Input
                            id="booking-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => openBookDialog()}>Book a room</Button>
                </>
            }
        >
            <div className="flex flex-col gap-6">

            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                    <div>
                        <CardTitle>Meeting rooms</CardTitle>
                        <CardDescription>
                            Drag on the timeline to book, or use the Book button
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => openBookDialog()}>
                            Book a room
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <RoomDaySchedule
                        bookings={bookings}
                        date={date}
                        isLoading={isLoading}
                        roomStatus={date === today ? roomStatus : undefined}
                        onBookRoom={(roomId, range) => openBookDialog(roomId, range)}
                        onCancelBooking={(id) => deleteMutation.mutate(id)}
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
                            <Select value={room} onValueChange={(v) => setRoom(v as RoomId)}>
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
                            onClick={() => bookMutation.mutate()}
                            disabled={bookMutation.isPending}
                        >
                            Book room
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </PageShell>
    )
}
