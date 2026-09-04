import { useState } from "react"
import { ExternalLink } from "lucide-react"

import { AddRestaurantLinkForm } from "@/components/lunch/AddRestaurantLinkForm"
import { RestaurantMenuPreview } from "@/components/lunch/RestaurantMenuPreview"
import { useCountdown } from "@/hooks/useCountdown"
import type { MenuPreview } from "@/lib/uberEatsMenu"
import type { User } from "@/types"
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

export type LunchPanelData = {
    round: {
        id: number
        status: "nominating" | "voting" | "closed"
        created_by_name: string
        voting_ends_at: string | null
    } | null
    lastClosed: { winner_name: string | null } | null
    nominationCounts: {
        restaurant_id: number
        restaurant_name: string
        count: number
    }[]
    candidates: {
        restaurant_id: number
        restaurant_name: string
        nomination_count: number
    }[]
    voteCounts: {
        restaurant_id: number
        restaurant_name: string
        count: number
    }[]
    myNomination: { restaurant_id: number } | null
    myVote: { restaurant_id: number } | null
    votes: { user_id: number; restaurant_name: string }[]
    users: { id: number; name: string }[]
}

type LunchVotePanelProps = {
    lunchData: LunchPanelData | undefined
    restaurants: PoolRestaurant[]
    user: User
    isLoading?: boolean
    compact?: boolean
    onStart: () => void
    onNominate: (restaurantId: number) => void
    onLock: () => void
    onVote: (restaurantId: number) => void
    onClose: () => void
    onAddRestaurant: (uberEatsUrl: string) => void
    startPending?: boolean
    nominatePending?: boolean
    lockPending?: boolean
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
    onNominate,
    onLock,
    onVote,
    onClose,
    onAddRestaurant,
    startPending = false,
    nominatePending = false,
    lockPending = false,
    votePending = false,
    closePending = false,
    addRestaurantPending = false,
}: LunchVotePanelProps) {
    const [uberEatsLink, setUberEatsLink] = useState("")
    const [expandedMenuId, setExpandedMenuId] = useState<number | null>(null)

    const round = lunchData?.round
    const countdown = useCountdown(
        round?.status === "voting" ? round.voting_ends_at : null
    )

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">Loading lunch round…</p>
    }

    const stepLabel = !round
        ? "No active round"
        : round.status === "nominating"
          ? "Step 1 · Nominate"
          : "Step 2 · Vote"

    const totalVotes = lunchData?.votes?.length ?? 0
    const totalUsers = lunchData?.users?.length ?? 0
    const visibleRestaurants = compact ? restaurants.slice(0, 8) : restaurants

    const toggleMenu = (restaurantId: number) => {
        setExpandedMenuId((current) => (current === restaurantId ? null : restaurantId))
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{stepLabel}</Badge>
                {round?.status === "voting" && round.voting_ends_at ? (
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
                            ? "Start a round — everyone nominates one spot from the Uber Eats pool."
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
            ) : round.status === "nominating" ? (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Pick one spot — tap a name to nominate. Preview menus before you choose.
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {visibleRestaurants.map((restaurant) => {
                            const count =
                                lunchData?.nominationCounts?.find(
                                    (entry) => entry.restaurant_id === restaurant.id
                                )?.count ?? 0
                            const isMine =
                                lunchData?.myNomination?.restaurant_id === restaurant.id
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
                                                {count > 0 ? (
                                                    <span className="text-muted-foreground">
                                                        {" "}
                                                        · {count} nom
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
                                                onClick={() => onNominate(restaurant.id)}
                                                disabled={nominatePending}
                                            >
                                                {isMine ? "Nominated" : "Nominate"}
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
                    <Button
                        size="sm"
                        onClick={onLock}
                        disabled={
                            lockPending || (lunchData?.nominationCounts?.length ?? 0) === 0
                        }
                    >
                        Lock top 3 → start voting
                    </Button>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Pick one finalist · {totalVotes}/{totalUsers} voted
                    </p>
                    <div className="grid gap-3 lg:grid-cols-3">
                        {(lunchData?.candidates ?? []).map((candidate) => {
                            const votes =
                                lunchData?.voteCounts?.find(
                                    (entry) => entry.restaurant_id === candidate.restaurant_id
                                )?.count ?? 0
                            const isMine =
                                lunchData?.myVote?.restaurant_id === candidate.restaurant_id
                            const menu = restaurantMenu(restaurants, candidate.restaurant_id)

                            return (
                                <div
                                    key={candidate.restaurant_id}
                                    className="flex min-w-0 flex-col rounded-lg border p-3"
                                >
                                    <div className="mb-2 flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-medium leading-tight">
                                                {candidate.restaurant_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {candidate.nomination_count} nominations · {votes}{" "}
                                                votes
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={isMine ? "default" : "outline"}
                                            className="h-8 shrink-0"
                                            onClick={() => onVote(candidate.restaurant_id)}
                                            disabled={votePending}
                                        >
                                            {isMine ? "Voted" : "Vote"}
                                        </Button>
                                    </div>
                                    <RestaurantMenuPreview menu={menu} compact />
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
