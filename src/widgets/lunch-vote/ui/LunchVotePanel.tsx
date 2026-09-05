import { useState } from "react"
import { ExternalLink } from "lucide-react"

import { AddRestaurantLinkForm } from "@/widgets/lunch-vote/ui/AddRestaurantLinkForm"
import { RestaurantMenuPreview } from "@/widgets/lunch-vote/ui/RestaurantMenuPreview"
import { useCountdown } from "@/shared/lib/use-countdown"
import type { MenuPreview } from "@/shared/lib/uber-eats-menu"
import {
    MAX_LUNCH_VOTES,
    remainingLunchVotes,
    type LunchPanelData,
} from "@/entities/lunch-round"
import type { User } from "@/entities/user"
import {
    Badge,
    Button,
} from "@ppt/luminis"

export type PoolRestaurant = {
    id: number
    name: string
    uber_eats_url?: string | null
    menu_preview?: MenuPreview | null
}

type LunchVotePanelProps = {
    lunchData: LunchPanelData | undefined
    restaurants: PoolRestaurant[]
    user: User
    isLoading?: boolean
    compact?: boolean
    onStart: () => void
    onVote: (restaurantId: number) => void
    onClose: () => void
    onAddRestaurant: (uberEatsUrl: string) => void
    startPending?: boolean
    votePending?: boolean
    closePending?: boolean
    addRestaurantPending?: boolean
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

export function LunchVotePanel({
    lunchData,
    restaurants,
    user,
    isLoading = false,
    compact = false,
    onStart,
    onVote,
    onClose,
    onAddRestaurant,
    startPending = false,
    votePending = false,
    closePending = false,
    addRestaurantPending = false,
}: LunchVotePanelProps) {
    const [uberEatsLink, setUberEatsLink] = useState("")
    const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null)

    const round = lunchData?.round
    const countdown = useCountdown(round ? round.voting_ends_at : null)
    const myVotes = lunchData?.myVotes ?? []
    const selectedCount = myVotes.length
    const remaining = remainingLunchVotes(selectedCount)
    const atCap = remaining === 0
    const votedUserCount = new Set((lunchData?.votes ?? []).map((vote) => vote.user_id))
        .size
    const totalUsers = lunchData?.users?.length ?? 0
    const visibleRestaurants = compact ? restaurants.slice(0, 8) : restaurants

    const toggleMenu = (restaurantId: number) => {
        setExpandedMenuId((current) => (current === restaurantId ? null : restaurantId))
    }

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">Loading lunch round…</p>
    }

    const stepLabel = !round ? "No active round" : "Voting open"

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{stepLabel}</Badge>
                {round?.voting_ends_at ? (
                    <Badge variant={countdown.isExpired ? "destructive" : "secondary"}>
                        {countdown.isExpired ? "Time's up" : `${countdown.label} left`}
                    </Badge>
                ) : null}
                {lunchData?.lastClosed?.winner_name && !round ? (
                    <span className="text-sm text-muted-foreground">
                        Last winner: {lunchData.lastClosed.winner_name}
                    </span>
                ) : null}
            </div>

            {!round ? (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        {user.isAdmin
                            ? `Start a round — everyone picks up to ${MAX_LUNCH_VOTES} spots. One winner.`
                            : "Waiting for HR to start the next lunch round."}
                    </p>
                    {user.isAdmin ? (
                        <Button
                            onClick={onStart}
                            disabled={startPending}
                            size={compact ? "sm" : "default"}
                        >
                            Start lunch round
                        </Button>
                    ) : null}
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Pick up to {MAX_LUNCH_VOTES} · {remaining} remaining ·{" "}
                        {votedUserCount}/{totalUsers} voted
                    </p>
                    {atCap ? (
                        <p className="text-xs text-muted-foreground">
                            Limit reached — unvote a pick to choose another.
                        </p>
                    ) : null}
                    <div className="grid gap-2 sm:grid-cols-2">
                        {visibleRestaurants.map((restaurant) => {
                            const votes =
                                lunchData?.voteCounts?.find(
                                    (entry) => entry.restaurant_id === restaurant.id
                                )?.count ?? 0
                            const isMine = myVotes.some(
                                (vote) => vote.restaurant_id === restaurant.id
                            )
                            const menu = restaurantMenu(restaurants, restaurant.id)
                            const menuOpen = expandedMenuId === restaurant.id

                            return (
                                <div
                                    key={restaurant.id}
                                    className="rounded-lg border p-3"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div className="min-w-0 space-y-1">
                                            <p className="font-medium leading-tight">
                                                {restaurant.name}
                                                {votes > 0 ? (
                                                    <span className="text-muted-foreground">
                                                        {" "}
                                                        · {votes} vote{votes === 1 ? "" : "s"}
                                                    </span>
                                                ) : null}
                                            </p>
                                            {restaurant.uber_eats_url ? (
                                                <a
                                                    href={restaurant.uber_eats_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                >
                                                    Uber Eats
                                                    <ExternalLink className="size-3" />
                                                </a>
                                            ) : (
                                                <p className="text-xs text-muted-foreground">
                                                    No Uber Eats link
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex shrink-0 flex-wrap gap-1">
                                            {menu ? (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 px-2"
                                                    onClick={() => toggleMenu(restaurant.id)}
                                                >
                                                    {menuOpen ? "Hide menu" : "Menu"}
                                                </Button>
                                            ) : null}
                                            <Button
                                                size="sm"
                                                variant={isMine ? "default" : "outline"}
                                                className="h-8"
                                                onClick={() => onVote(restaurant.id)}
                                                disabled={
                                                    votePending || countdown.isExpired || (!isMine && atCap)
                                                }
                                            >
                                                {isMine ? "Voted" : "Vote"}
                                            </Button>
                                        </div>
                                    </div>
                                    {menuOpen && menu ? (
                                        <div className="mt-3 border-t border-border pt-3">
                                            <RestaurantMenuPreview menu={menu} compact />
                                        </div>
                                    ) : null}
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
                            Close round & announce winner
                        </Button>
                    ) : null}
                </div>
            )}

            <div className="border-t border-border pt-3">
                <AddRestaurantLinkForm
                    value={uberEatsLink}
                    onChange={setUberEatsLink}
                    onSubmit={() => {
                        onAddRestaurant(uberEatsLink.trim())
                        setUberEatsLink("")
                    }}
                    isPending={addRestaurantPending}
                    inputId={compact ? "dash-lunch-uber-eats" : "lunch-uber-eats"}
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
