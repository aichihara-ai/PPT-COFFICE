import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
    ArrowRight,
} from "lucide-react"

import { PageShell } from "@/components/layouts/PageShell"
import {
    InventoryItemHeader,
    InventoryStatusLabel,
} from "@/components/inventory/InventoryItemDisplay"
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard"
import { KitchenSuggestionItem } from "@/components/kitchen/KitchenSuggestionItem"
import { KitchenWishlistForm } from "@/components/kitchen/KitchenWishlistForm"
import { LunchVotePanel, type LunchPanelData } from "@/components/lunch/LunchVotePanel"
import { RoomDaySchedule, type RoomBookRange } from "@/components/rooms/RoomDaySchedule"
import { INVENTORY_ITEM_CONFIG } from "@/consts/inventory"
import { apiFetch } from "@/lib/api"
import { normalizeKitchenUrl } from "@/lib/kitchenLinks"
import { BOOKING_TIME_SLOTS } from "@/lib/roomSchedule"
import { useCountdown } from "@/hooks/useCountdown"
import { useAuth } from "@/providers/AuthProvider"
import {
    ROOM_CONFIG,
    type InventoryStatus,
    type RoomId,
    type SuggestionStatus,
} from "@/types"
import type { RoomBooking, RoomStatus } from "@/types/booking"
import {
    Badge,
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

type Restaurant = {
    id: number
    name: string
    uber_eats_url?: string | null
    menu_preview?: import("@/lib/uberEatsMenu").MenuPreview | null
}

const STATUS_BADGE: Record<InventoryStatus, "secondary" | "destructive"> = {
    ok: "secondary",
    low: "destructive",
}

export function DashboardPage() {
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const today = new Date().toISOString().slice(0, 10)

    const [bookDialogOpen, setBookDialogOpen] = useState(false)
    const [bookRoom, setBookRoom] = useState<RoomId>("room_a")
    const [bookStart, setBookStart] = useState("10:00")
    const [bookEnd, setBookEnd] = useState("11:00")
    const [bookTitle, setBookTitle] = useState("Meeting")
    const [snackLink, setSnackLink] = useState("")

    const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
        queryKey: ["bookings", today],
        queryFn: () =>
            apiFetch<{ bookings: RoomBooking[]; roomStatus: RoomStatus[] }>(
                `/api/bookings?date=${today}`
            ),
    })

    const { data: suggestionsData } = useQuery({
        queryKey: ["suggestions"],
        queryFn: () =>
            apiFetch<{
                suggestions: {
                    id: number
                    text: string
                    status: SuggestionStatus
                    user_name: string
                }[]
            }>("/api/suggestions"),
    })

    const { data: inventoryData } = useQuery({
        queryKey: ["inventory"],
        queryFn: () =>
            apiFetch<{
                inventory: {
                    item: "coffee" | "milk"
                    status: InventoryStatus
                    updated_by_name: string | null
                }[]
            }>("/api/inventory"),
    })

    const { data: lunchData } = useQuery({
        queryKey: ["lunch"],
        queryFn: () => apiFetch<LunchPanelData>("/api/lunch"),
        refetchInterval: 15_000,
    })

    const { data: restaurantData } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () => apiFetch<{ restaurants: Restaurant[] }>("/api/restaurants"),
    })

    const bookMutation = useMutation({
        mutationFn: () =>
            apiFetch("/api/bookings", {
                method: "POST",
                body: JSON.stringify({
                    room: bookRoom,
                    bookingDate: today,
                    startTime: bookStart,
                    endTime: bookEnd,
                    title: bookTitle,
                }),
            }),
        onSuccess: () => {
            toast.success("Room booked")
            setBookDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const snackAddMutation = useMutation({
        mutationFn: () =>
            apiFetch("/api/suggestions", {
                method: "POST",
                body: JSON.stringify({ text: normalizeKitchenUrl(snackLink) }),
            }),
        onSuccess: () => {
            toast.success("Link added")
            setSnackLink("")
            queryClient.invalidateQueries({ queryKey: ["suggestions"] })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const snackUpdateMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: SuggestionStatus }) =>
            apiFetch(`/api/suggestions?id=${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suggestions"] })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const inventoryMutation = useMutation({
        mutationFn: ({
            item,
            status,
        }: {
            item: "coffee" | "milk"
            status: InventoryStatus
        }) =>
            apiFetch("/api/inventory", {
                method: "PATCH",
                body: JSON.stringify({ item, status }),
            }),
        onSuccess: (_, { status }) => {
            toast.success(
                status === "low" ? "Team notified — running low" : "Marked as restocked"
            )
            queryClient.invalidateQueries({ queryKey: ["inventory"] })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const invalidateLunch = () => queryClient.invalidateQueries({ queryKey: ["lunch"] })

    const lunchStartMutation = useMutation({
        mutationFn: () =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "start" }),
            }),
        onSuccess: () => {
            toast.success("Lunch round started")
            invalidateLunch()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const lunchNominateMutation = useMutation({
        mutationFn: (restaurantId: number) =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "nominate", restaurantId }),
            }),
        onSuccess: () => {
            toast.success("Nomination saved")
            invalidateLunch()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const lunchVoteMutation = useMutation({
        mutationFn: (restaurantId: number) =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "vote", restaurantId }),
            }),
        onSuccess: () => {
            toast.success("Vote recorded")
            invalidateLunch()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const lunchLockMutation = useMutation({
        mutationFn: () =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "lock" }),
            }),
        onSuccess: () => {
            toast.success("Top 3 locked — time to vote!")
            invalidateLunch()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const lunchCloseMutation = useMutation({
        mutationFn: () =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "close" }),
            }),
        onSuccess: () => {
            toast.success("Round closed")
            invalidateLunch()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const addRestaurantMutation = useMutation({
        mutationFn: (uberEatsUrl: string) =>
            apiFetch("/api/restaurants", {
                method: "POST",
                body: JSON.stringify({ uberEatsUrl }),
            }),
        onSuccess: () => {
            toast.success("Restaurant added from Uber Eats link")
            queryClient.invalidateQueries({ queryKey: ["restaurants"] })
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const roomStatus = bookingsData?.roomStatus ?? []
    const roomBookings = bookingsData?.bookings ?? []
    const busyCount = roomStatus.filter((r) => r.status === "busy").length
    const openSuggestions =
        suggestionsData?.suggestions.filter((s) => s.status === "open") ?? []
    const inventory = inventoryData?.inventory ?? []
    const lunchRound = lunchData?.round
    const restaurants = restaurantData?.restaurants ?? []
    const lunchCountdown = useCountdown(
        lunchRound?.status === "voting" ? lunchRound.voting_ends_at : null
    )

    const pantryLow = inventory.some((item) => item.status === "low")
    const pantryDetail = (["coffee", "milk"] as const)
        .map((itemKey) => {
            const status = inventory.find((item) => item.item === itemKey)?.status ?? "ok"
            const meta = INVENTORY_ITEM_CONFIG[itemKey]
            return `${meta.emoji} ${status === "ok" ? "OK" : "Low"}`
        })
        .join(" · ")

    const roomDetail =
        roomStatus.length > 0
            ? roomStatus
                  .map((status) => {
                      const { emoji, label } = ROOM_CONFIG[status.room]
                      return status.status === "busy"
                          ? `${emoji} ${label} busy`
                          : `${emoji} ${label} free`
                  })
                  .join(" · ")
            : "Loading availability…"

    const lunchValue = lunchRound
        ? lunchRound.status === "nominating"
            ? "Nominating"
            : "Voting"
        : "Idle"

    const lunchDetail = lunchRound
        ? lunchRound.status === "voting" && lunchRound.voting_ends_at
            ? lunchCountdown.isExpired
                ? "Voting closed"
                : `${lunchCountdown.label} left`
            : `By ${lunchRound.created_by_name}`
        : lunchData?.lastClosed?.winner_name
          ? `Last: ${lunchData.lastClosed.winner_name}`
          : user.isAdmin
            ? "No active round"
            : "Waiting for HR to start"

    const openBookDialog = (roomId?: RoomId, range?: RoomBookRange) => {
        if (roomId) setBookRoom(roomId)
        if (range) {
            setBookStart(range.startTime)
            setBookEnd(range.endTime)
        }
        setBookDialogOpen(true)
    }

    return (
        <PageShell
            title="Dashboard"
            description="Everything happening in the Vancouver office — act on it right here."
        >
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardStatCard
                    icon="🚪"
                    label="Rooms"
                    value={`${2 - busyCount}/2 free`}
                    detail={roomDetail}
                    tone={busyCount === 0 ? "success" : "warning"}
                />
                <DashboardStatCard
                    icon="🛒"
                    label="Kitchen"
                    value={`${openSuggestions.length} open`}
                    detail={
                        openSuggestions.length === 0
                            ? "Add links on Kitchen page"
                            : `${openSuggestions.length} link${openSuggestions.length === 1 ? "" : "s"} waiting`
                    }
                    tone={openSuggestions.length > 0 ? "active" : "default"}
                />
                <DashboardStatCard
                    icon="☕"
                    label="Pantry"
                    value={pantryLow ? "Running low" : "Stocked"}
                    detail={pantryDetail}
                    tone={pantryLow ? "warning" : "success"}
                />
                <DashboardStatCard
                    icon="🥗"
                    label="Lunch"
                    value={lunchValue}
                    detail={lunchDetail}
                    tone={lunchRound ? "active" : "default"}
                />
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                    <div>
                        <CardTitle>Meeting rooms</CardTitle>
                        <CardDescription>
                            {busyCount === 0
                                ? "Both rooms free — today's schedule below"
                                : `${busyCount} room${busyCount === 1 ? "" : "s"} in use`}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => openBookDialog()}>
                            Book a room
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/rooms">
                                Full view
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <RoomDaySchedule
                        bookings={roomBookings}
                        date={today}
                        isLoading={bookingsLoading}
                        compact
                        showAgenda={false}
                        roomStatus={roomStatus}
                        onBookRoom={openBookDialog}
                    />
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle>Kitchen snacks</CardTitle>
                            <CardDescription>
                                {openSuggestions.length === 0
                                    ? "No open links"
                                    : `${openSuggestions.length} open link${openSuggestions.length === 1 ? "" : "s"}`}
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/kitchen">
                                View all
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <KitchenWishlistForm
                            value={snackLink}
                            onChange={setSnackLink}
                            onSubmit={() => snackAddMutation.mutate()}
                            isPending={snackAddMutation.isPending}
                            inputId="dash-kitchen-link"
                            compact
                        />
                        {user.isAdmin && openSuggestions.length > 0 ? (
                            <div className="space-y-2 border-t border-border pt-3">
                                {openSuggestions.slice(0, 2).map((suggestion) => (
                                    <KitchenSuggestionItem
                                        key={suggestion.id}
                                        id={suggestion.id}
                                        text={suggestion.text}
                                        status={suggestion.status}
                                        userName={suggestion.user_name}
                                        isAdmin={user.isAdmin}
                                        onMarkBought={(id) =>
                                            snackUpdateMutation.mutate({ id, status: "bought" })
                                        }
                                        onDecline={(id) =>
                                            snackUpdateMutation.mutate({ id, status: "declined" })
                                        }
                                    />
                                ))}
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle>Pantry status</CardTitle>
                            <CardDescription>Coffee and milk — low or stocked</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/inventory">
                                View all
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        {(["coffee", "milk"] as const).map((itemKey) => {
                            const item = inventory.find((i) => i.item === itemKey)
                            const status = item?.status ?? "ok"
                            const meta = INVENTORY_ITEM_CONFIG[itemKey]
                            return (
                                <div key={itemKey} className="rounded-lg border px-4 py-3">
                                    <InventoryItemHeader itemKey={itemKey} size="sm" />
                                    <Badge variant={STATUS_BADGE[status]} className="mt-3">
                                        <InventoryStatusLabel status={status} />
                                    </Badge>
                                    <div className="mt-3">
                                        {status === "ok" ? (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-auto min-h-8 w-full whitespace-normal px-2 py-1.5 text-center text-xs leading-snug sm:text-sm"
                                                onClick={() =>
                                                    inventoryMutation.mutate({
                                                        item: itemKey,
                                                        status: "low",
                                                    })
                                                }
                                                disabled={inventoryMutation.isPending}
                                            >
                                                {meta.emoji} Running low
                                            </Button>
                                        ) : user.isAdmin ? (
                                            <Button
                                                size="sm"
                                                className="h-auto min-h-8 w-full whitespace-normal px-2 py-1.5 text-center text-xs leading-snug sm:text-sm"
                                                onClick={() =>
                                                    inventoryMutation.mutate({
                                                        item: itemKey,
                                                        status: "ok",
                                                    })
                                                }
                                                disabled={inventoryMutation.isPending}
                                            >
                                                {meta.emoji} Restocked
                                            </Button>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                Waiting for HR restock
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                        <div>
                            <CardTitle>Lunch vote</CardTitle>
                            <CardDescription>Nominate → lock top 3 → vote</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/lunch">
                                View all
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <LunchVotePanel
                            lunchData={lunchData}
                            restaurants={restaurants}
                            user={user}
                            compact
                            onStart={() => lunchStartMutation.mutate()}
                            onNominate={(id) => lunchNominateMutation.mutate(id)}
                            onLock={() => lunchLockMutation.mutate()}
                            onVote={(id) => lunchVoteMutation.mutate(id)}
                            onClose={() => lunchCloseMutation.mutate()}
                            onAddRestaurant={(uberEatsUrl) =>
                                addRestaurantMutation.mutate(uberEatsUrl)
                            }
                            startPending={lunchStartMutation.isPending}
                            nominatePending={lunchNominateMutation.isPending}
                            lockPending={lunchLockMutation.isPending}
                            votePending={lunchVoteMutation.isPending}
                            closePending={lunchCloseMutation.isPending}
                            addRestaurantPending={addRestaurantMutation.isPending}
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={bookDialogOpen} onOpenChange={setBookDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Book a meeting room</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Room</Label>
                            <Select
                                value={bookRoom}
                                onValueChange={(v: string) => setBookRoom(v as RoomId)}
                            >
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
                            <Input
                                value={bookTitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Start</Label>
                                <Select value={bookStart} onValueChange={setBookStart}>
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
                                <Select value={bookEnd} onValueChange={setBookEnd}>
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
        </PageShell>
    )
}
