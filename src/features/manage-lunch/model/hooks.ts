import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { LunchPanelData } from "@/entities/lunch-round"
import type { AddRestaurantLinkInput, Restaurant } from "@/entities/restaurant"
import { apiFetch } from "@/shared/api"

const lunchKey = ["lunch"] as const
const restaurantsKey = ["restaurants"] as const

export function useLunchPanel() {
    return useQuery({
        queryKey: lunchKey,
        queryFn: () => apiFetch<LunchPanelData>("/api/lunch"),
        refetchInterval: 15_000,
    })
}

export function useRestaurants() {
    return useQuery({
        queryKey: restaurantsKey,
        queryFn: () => apiFetch<{ restaurants: Restaurant[] }>("/api/restaurants"),
    })
}

function useInvalidateLunch() {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries({ queryKey: lunchKey })
}

export function useStartLunchRound() {
    const invalidate = useInvalidateLunch()

    return useMutation({
        mutationFn: (votingEndsAt: string) =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "start", votingEndsAt }),
            }),
        onSuccess: invalidate,
    })
}

export function usePickLunch() {
    const invalidate = useInvalidateLunch()

    return useMutation({
        mutationFn: (restaurantId: number) =>
            apiFetch<{ picked: boolean }>("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "pick", restaurantId }),
            }),
        onSuccess: invalidate,
    })
}

export function useCloseLunchRound() {
    const invalidate = useInvalidateLunch()

    return useMutation({
        mutationFn: () =>
            apiFetch<{
                winnerName: string | null
                secondWinnerName: string | null
            }>("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "close" }),
            }),
        onSuccess: invalidate,
    })
}

export function useSetGroupOrderLink() {
    const invalidate = useInvalidateLunch()

    return useMutation({
        mutationFn: (groupOrderUrl: string) =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "setGroupOrderLink", groupOrderUrl }),
            }),
        onSuccess: invalidate,
    })
}

export function useAddRestaurantFromLink() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ uberEatsUrl, title }: AddRestaurantLinkInput) =>
            apiFetch("/api/restaurants", {
                method: "POST",
                body: JSON.stringify({ uberEatsUrl, title }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: restaurantsKey })
        },
    })
}
