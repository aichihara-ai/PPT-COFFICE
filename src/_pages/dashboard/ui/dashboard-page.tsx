"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"

import { useRequiredUser } from "@/features/auth"
import {
    useBookings,
    useCreateBooking,
} from "@/features/manage-bookings"
import { useInventory, useUpdateInventory } from "@/features/manage-inventory"
import {
    useAddSuggestion,
    useSuggestions,
    useUpdateSuggestionStatus,
} from "@/features/manage-suggestions"
import {
    useAddRestaurantFromLink,
    useCloseLunchRound,
    useLunchPanel,
    useRestaurants,
    useStartLunchRound,
    useVoteLunch,
} from "@/features/manage-lunch"
import { formatLocalDate, ROOM_CONFIG, type RoomId } from "@/entities/booking"
import { INVENTORY_ITEM_CONFIG } from "@/entities/inventory"
import { DashboardStatCard, PageShell } from "@/widgets/app-shell"
import { KitchenSuggestionItem, KitchenWishlistForm } from "@/widgets/kitchen-wishlist"
import { LunchVotePanel } from "@/widgets/lunch-vote"
import {
    InventoryItemHeader,
    InventoryStatusLabel,
} from "@/widgets/pantry-status"
import { RoomDaySchedule, type RoomBookRange } from "@/widgets/room-schedule"
import { useCountdown } from "@/shared/lib/use-countdown"
import { BOOKING_TIME_SLOTS } from "@/entities/booking"
import type { InventoryStatus } from "@/entities/inventory"
import type { SuggestionStatus } from "@/entities/suggestion"
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

const STATUS_BADGE: Record<InventoryStatus, "secondary" | "destructive"> = {
    ok: "secondary",
    low: "destructive",
}

export function DashboardPage() {
    const user = useRequiredUser()
    const today = formatLocalDate()

    const [bookDialogOpen, setBookDialogOpen] = useState(false)
    const [bookRoom, setBookRoom] = useState<RoomId>("room_a")
    const [bookStart, setBookStart] = useState("10:00")
    const [bookEnd, setBookEnd] = useState("11:00")
    const [bookTitle, setBookTitle] = useState("Meeting")
    const [snackLink, setSnackLink] = useState("")
    const [snackTitle, setSnackTitle] = useState("")

    const { data: bookingsData, isLoading: bookingsLoading } = useBookings(today)
    const { data: suggestionsData } = useSuggestions()
    const { data: inventoryData } = useInventory()
    const { data: lunchData } = useLunchPanel()
    const { data: restaurantData } = useRestaurants()

    const bookMutation = useCreateBooking(today)
    const snackAddMutation = useAddSuggestion()
    const snackUpdateMutation = useUpdateSuggestionStatus()
    const inventoryMutation = useUpdateInventory()
    const lunchStartMutation = useStartLunchRound()
    const lunchVoteMutation = useVoteLunch()
    const lunchCloseMutation = useCloseLunchRound()
    const addRestaurantMutation = useAddRestaurantFromLink()

    const roomStatus = bookingsData?.roomStatus ?? []
    const roomBookings = bookingsData?.bookings ?? []
    const busyCount = roomStatus.filter((r) => r.status === "busy").length
    const openSuggestions =
        suggestionsData?.suggestions.filter((s) => s.status === "open") ?? []
    const inventory = inventoryData?.inventory ?? []
    const lunchRound = lunchData?.round
    const restaurants = restaurantData?.restaurants ?? []
    const lunchCountdown = useCountdown(lunchRound?.voting_ends_at ?? null)

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

    const lunchValue = lunchRound ? "Voting" : "Idle"

    const lunchDetail = lunchRound
        ? lunchRound.voting_ends_at
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
                <CardHeader className="flex flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div>
                        <CardTitle>Meeting rooms</CardTitle>
                        <CardDescription>
                            {busyCount === 0
                                ? "Both rooms free — today's schedule below"
                                : `${busyCount} room${busyCount === 1 ? "" : "s"} in use`}
                        </CardDescription>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                        <Button
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => openBookDialog()}
                        >
                            Book a room
                        </Button>
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto" asChild>
                            <Link href="/rooms">
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
                    <CardHeader className="flex flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div>
                            <CardTitle>Kitchen snacks</CardTitle>
                            <CardDescription>
                                {openSuggestions.length === 0
                                    ? "No open links"
                                    : `${openSuggestions.length} open link${openSuggestions.length === 1 ? "" : "s"}`}
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto" asChild>
                            <Link href="/kitchen">
                                View all
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <KitchenWishlistForm
                            value={snackLink}
                            onChange={setSnackLink}
                            title={snackTitle}
                            onTitleChange={setSnackTitle}
                            onSubmit={() =>
                                snackAddMutation.mutate(
                                    { text: snackLink, title: snackTitle },
                                    {
                                        onSuccess: () => {
                                            toast.success("Link added")
                                            setSnackLink("")
                                            setSnackTitle("")
                                        },
                                        onError: (e) => toast.error(e.message),
                                    }
                                )
                            }
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
                                        title={suggestion.title}
                                        status={suggestion.status}
                                        userName={suggestion.user_name}
                                        isAdmin={user.isAdmin}
                                        onMarkBought={(id) =>
                                            snackUpdateMutation.mutate({
                                                id,
                                                status: "bought" as SuggestionStatus,
                                            })
                                        }
                                        onDecline={(id) =>
                                            snackUpdateMutation.mutate({
                                                id,
                                                status: "declined" as SuggestionStatus,
                                            })
                                        }
                                    />
                                ))}
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div>
                            <CardTitle>Pantry status</CardTitle>
                            <CardDescription>Coffee and milk — low or stocked</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto" asChild>
                            <Link href="/inventory">
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
                                                    inventoryMutation.mutate(
                                                        { item: itemKey, status: "low" },
                                                        {
                                                            onSuccess: () =>
                                                                toast.success(
                                                                    "Team notified — running low"
                                                                ),
                                                            onError: (e) => toast.error(e.message),
                                                        }
                                                    )
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
                                                    inventoryMutation.mutate(
                                                        { item: itemKey, status: "ok" },
                                                        {
                                                            onSuccess: () =>
                                                                toast.success("Marked as restocked"),
                                                            onError: (e) => toast.error(e.message),
                                                        }
                                                    )
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
                    <CardHeader className="flex flex-col items-stretch gap-3 space-y-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div>
                            <CardTitle>Lunch vote</CardTitle>
                            <CardDescription>Pick up to 3 · one winner</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto" asChild>
                            <Link href="/lunch">
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
                            onStart={() =>
                                lunchStartMutation.mutate(undefined, {
                                    onSuccess: () => toast.success("Lunch round started"),
                                    onError: (e) => toast.error(e.message),
                                })
                            }
                            onVote={(id) =>
                                lunchVoteMutation.mutate(id, {
                                    onSuccess: () => toast.success("Vote updated"),
                                    onError: (e) => toast.error(e.message),
                                })
                            }
                            onClose={() =>
                                lunchCloseMutation.mutate(undefined, {
                                    onSuccess: () => toast.success("Round closed"),
                                    onError: (e) => toast.error(e.message),
                                })
                            }
                            onAddRestaurant={(input) =>
                                addRestaurantMutation.mutate(input, {
                                    onSuccess: () =>
                                        toast.success("Restaurant added to pool"),
                                    onError: (e) => toast.error(e.message),
                                })
                            }
                            startPending={lunchStartMutation.isPending}
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
                            onClick={() =>
                                bookMutation.mutate(
                                    {
                                        room: bookRoom,
                                        bookingDate: today,
                                        startTime: bookStart,
                                        endTime: bookEnd,
                                        title: bookTitle,
                                    },
                                    {
                                        onSuccess: () => {
                                            toast.success("Room booked")
                                            setBookDialogOpen(false)
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
