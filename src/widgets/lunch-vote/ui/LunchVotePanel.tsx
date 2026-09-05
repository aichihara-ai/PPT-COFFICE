import { useState } from "react"

import { AddRestaurantLinkForm } from "@/widgets/lunch-vote/ui/AddRestaurantLinkForm"
import { LunchGroupOrderForm } from "@/widgets/lunch-vote/ui/LunchGroupOrderForm"
import { LunchDeadlinePicker } from "@/widgets/lunch-vote/ui/LunchDeadlinePicker"
import { LunchFlowSteps } from "@/widgets/lunch-vote/ui/LunchFlowSteps"
import { LunchWinners } from "@/widgets/lunch-vote/ui/LunchWinners"
import { RestaurantMenuPreview } from "@/widgets/lunch-vote/ui/RestaurantMenuPreview"
import { useCountdown } from "@/shared/lib/use-countdown"
import {
    defaultDeadlineDate,
    formatDeadlineOption,
    formatNextOfficeLunchLabel,
    isValidDeadlineDate,
    LUNCH_DEADLINE_OPTIONS,
    LUNCH_PICK_LIMIT,
} from "@/shared/lib/lunch-round"
import type { MenuPreview } from "@/shared/lib/uber-eats-menu"
import { restaurantThumbnailUrl } from "@/shared/config/restaurant-images"
import type { AddRestaurantLinkInput } from "@/entities/restaurant"
import type { LunchPanelData } from "@/entities/lunch-round"
import type { User } from "@/entities/user"
import { cn } from "@/shared/lib/utils"
import { Badge, Button } from "@ppt/luminis"

const PICKS_REQUIRED = LUNCH_PICK_LIMIT

export type PoolRestaurant = {
    id: number
    name: string
    notes?: string | null
    uber_eats_url?: string | null
    menu_preview?: MenuPreview | null
}

type LunchVotePanelProps = {
    lunchData: LunchPanelData | undefined
    restaurants: PoolRestaurant[]
    user: User
    isLoading?: boolean
    compact?: boolean
    onStart: (votingEndsAt: string) => void
    onPick: (restaurantId: number) => void
    onClose: () => void
    onAddRestaurant: (input: AddRestaurantLinkInput) => void
    onSetGroupOrderLink?: (url: string) => void
    startPending?: boolean
    pickPending?: boolean
    closePending?: boolean
    addRestaurantPending?: boolean
    groupOrderPending?: boolean
}

function restaurantMenu(
    restaurants: PoolRestaurant[],
    restaurantId: number
): MenuPreview | null {
    const restaurant = restaurants.find((entry) => entry.id === restaurantId)
    if (!restaurant) return null

    if (restaurant.menu_preview) {
        return restaurant.menu_preview
    }

    if (restaurant.uber_eats_url) {
        return {
            storeName: restaurant.name,
            uberEatsUrl: restaurant.uber_eats_url,
            fetchedAt: "",
            items: [],
            unavailable: true,
        }
    }

    return null
}

function placeThumbnail(restaurant: PoolRestaurant) {
    return restaurantThumbnailUrl(restaurant.name)
}

export function LunchVotePanel({
    lunchData,
    restaurants,
    user,
    isLoading = false,
    compact = false,
    onStart,
    onPick,
    onClose,
    onAddRestaurant,
    onSetGroupOrderLink,
    startPending = false,
    pickPending = false,
    closePending = false,
    addRestaurantPending = false,
    groupOrderPending = false,
}: LunchVotePanelProps) {
    const [uberEatsLink, setUberEatsLink] = useState("")
    const [uberEatsTitle, setUberEatsTitle] = useState("")
    const [deadline, setDeadline] = useState(defaultDeadlineDate)
    const [deadlineError, setDeadlineError] = useState<string | null>(null)

    const applyPresetMinutes = (minutes: number) => {
        setDeadline(new Date(Date.now() + minutes * 60 * 1000))
        setDeadlineError(null)
    }

    const handleStart = () => {
        if (!isValidDeadlineDate(deadline)) {
            setDeadlineError("Pick a future date and time within the next 24 hours.")
            return
        }
        setDeadlineError(null)
        onStart(deadline.toISOString())
    }

    const round = lunchData?.round
    const lastClosed = lunchData?.lastClosed
    const myPicks = lunchData?.myPicks ?? []
    const pickCount = lunchData?.pickCount ?? 0
    const isComplete = lunchData?.isComplete ?? false
    const participation = lunchData?.participation ?? { completed: 0, total: 0 }

    const countdown = useCountdown(round?.voting_ends_at ?? null)

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">Loading lunch round…</p>
    }

    const visibleRestaurants = restaurants
    const canPickMore = pickCount < PICKS_REQUIRED
    const isLive = Boolean(round)
    const nextLunchLabel = formatNextOfficeLunchLabel()

    const pickStatusLabel =
        pickCount === 0
            ? `Select ${PICKS_REQUIRED} restaurants`
            : pickCount < PICKS_REQUIRED
              ? `You picked ${pickCount}/${PICKS_REQUIRED} — pick ${PICKS_REQUIRED - pickCount} more`
              : `${PICKS_REQUIRED}/${PICKS_REQUIRED} — you're in!`

    return (
        <div className="space-y-4 rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border/80 bg-muted/30 px-3 py-2">
                <p className="text-sm text-muted-foreground">{nextLunchLabel}</p>
                {isLive ? (
                    <Badge className="gap-1.5 bg-primary text-primary-foreground">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary-foreground opacity-60" />
                            <span className="relative inline-flex size-2 rounded-full bg-primary-foreground" />
                        </span>
                        Live now
                    </Badge>
                ) : null}
            </div>

            <LunchFlowSteps
                isActive={Boolean(round)}
                hasLastWinner={Boolean(lastClosed?.winner_name)}
                winnerName={lastClosed?.winner_name}
                secondWinnerName={lastClosed?.second_winner_name}
            />

            {!round && lastClosed?.winner_name ? (
                <div className="space-y-3">
                    <LunchWinners
                        winnerName={lastClosed.winner_name}
                        secondWinnerName={lastClosed.second_winner_name}
                        groupOrderUrl={lastClosed.group_order_url}
                        hidePendingMessage={user.isAdmin}
                        compact={compact}
                    />
                    {user.isAdmin && onSetGroupOrderLink ? (
                        <LunchGroupOrderForm
                            currentUrl={lastClosed.group_order_url}
                            onSubmit={onSetGroupOrderLink}
                            isPending={groupOrderPending}
                            inputId={compact ? "dash-lunch-group-order" : "lunch-group-order"}
                        />
                    ) : null}
                </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                    {round ? "Round open" : "No active round"}
                </Badge>
                {round?.voting_ends_at ? (
                    <Badge variant={countdown.isExpired ? "destructive" : "secondary"}>
                        {countdown.isExpired ? "Time's up" : `${countdown.label} left`}
                    </Badge>
                ) : null}
                {round ? (
                    <span className="text-sm text-muted-foreground">
                        {participation.completed}/{participation.total} teammates done
                    </span>
                ) : null}
            </div>

            {!round ? (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        {user.isAdmin
                            ? "Start a round — everyone picks exactly 3 spots from the pool."
                            : "Waiting for HR to start the next lunch round."}
                    </p>
                    {user.isAdmin ? (
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-end gap-3">
                                <LunchDeadlinePicker
                                    value={deadline}
                                    onChange={(next) => {
                                        setDeadline(next)
                                        setDeadlineError(null)
                                    }}
                                    idPrefix={compact ? "dash-lunch-deadline" : "lunch-deadline"}
                                />
                                <Button
                                    onClick={handleStart}
                                    disabled={startPending || restaurants.length < PICKS_REQUIRED}
                                    size={compact ? "sm" : "default"}
                                >
                                    Start lunch round
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {LUNCH_DEADLINE_OPTIONS.map((minutes) => (
                                    <Button
                                        key={minutes}
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        className="h-7 px-2.5 text-xs"
                                        onClick={() => applyPresetMinutes(minutes)}
                                    >
                                        +{formatDeadlineOption(minutes)}
                                    </Button>
                                ))}
                            </div>
                            {deadlineError ? (
                                <p className="text-xs text-destructive">{deadlineError}</p>
                            ) : null}
                        </div>
                    ) : null}
                    {user.isAdmin && restaurants.length < PICKS_REQUIRED ? (
                        <p className="text-xs text-destructive">
                            Need at least {PICKS_REQUIRED} restaurants in the pool to start.
                        </p>
                    ) : null}
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        {pickStatusLabel}
                        {isComplete ? " Waiting for the rest of the team." : ""}
                    </p>

                    <div
                        className={cn(
                            "grid gap-2 sm:grid-cols-2",
                            !compact && "lg:grid-cols-3 xl:grid-cols-4"
                        )}
                    >
                        {visibleRestaurants.map((restaurant) => {
                            const count =
                                lunchData?.nominationCounts.find(
                                    (entry) => entry.restaurant_id === restaurant.id
                                )?.count ?? 0
                            const isSelected = myPicks.includes(restaurant.id)
                            const menu = restaurantMenu(restaurants, restaurant.id)
                            const thumbnail = placeThumbnail(restaurant)
                            const pickDisabled = pickPending || (!isSelected && !canPickMore)

                            return (
                                <div
                                    key={restaurant.id}
                                    className={cn(
                                        "flex h-full flex-col overflow-hidden rounded-lg border-2",
                                        isSelected ? "border-primary" : "border-border"
                                    )}
                                >
                                    {thumbnail ? (
                                        <img
                                            src={thumbnail}
                                            alt=""
                                            className="h-24 w-full shrink-0 object-cover"
                                            loading="lazy"
                                        />
                                    ) : null}
                                    <div className="flex flex-1 flex-col p-3">
                                        <div className="min-h-0 flex-1 space-y-1">
                                            <p className="font-medium leading-tight">
                                                {restaurant.name}
                                                {count > 0 ? (
                                                    <span className="text-muted-foreground">
                                                        {" "}
                                                        · {count} pick
                                                        {count === 1 ? "" : "s"}
                                                    </span>
                                                ) : null}
                                            </p>
                                            {restaurant.notes ? (
                                                <p className="text-xs text-muted-foreground">
                                                    {restaurant.notes}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="mt-3 flex items-center gap-2">
                                            {menu ? (
                                                <RestaurantMenuPreview menu={menu} />
                                            ) : null}
                                            <Button
                                                size="sm"
                                                variant={isSelected ? "default" : "outline"}
                                                className="ml-auto h-8 shrink-0"
                                                onClick={() => onPick(restaurant.id)}
                                                disabled={pickDisabled}
                                            >
                                                {isSelected ? "Selected" : "Pick"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {user.isAdmin ? (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={onClose}
                            disabled={closePending}
                        >
                            Close round now
                        </Button>
                    ) : null}
                </div>
            )}

            <div className="border-t border-border pt-3">
                <AddRestaurantLinkForm
                    value={uberEatsLink}
                    onChange={setUberEatsLink}
                    title={uberEatsTitle}
                    onTitleChange={setUberEatsTitle}
                    onSubmit={() => {
                        onAddRestaurant({
                            uberEatsUrl: uberEatsLink.trim(),
                            title: uberEatsTitle,
                        })
                        setUberEatsLink("")
                        setUberEatsTitle("")
                    }}
                    isPending={addRestaurantPending}
                    inputId={compact ? "dash-lunch-uber-eats" : "lunch-uber-eats"}
                    compact={compact}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                    {restaurants.length} spot{restaurants.length === 1 ? "" : "s"} in pool
                    {restaurants.filter((r) => r.uber_eats_url).length < restaurants.length
                        ? ` · ${restaurants.filter((r) => r.uber_eats_url).length} with Uber Eats links`
                        : ""}
                </p>
            </div>
        </div>
    )
}
