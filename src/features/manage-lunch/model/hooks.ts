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
        mutationFn: () =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "start" }),
            }),
        onSuccess: invalidate,
    })
}

export function useNominateLunch() {
    const invalidate = useInvalidateLunch()

    return useMutation({
        mutationFn: (restaurantId: number) =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "nominate", restaurantId }),
            }),
        onSuccess: invalidate,
    })
}

export function useLockLunchCandidates() {
    const invalidate = useInvalidateLunch()

    return useMutation({
        mutationFn: () =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "lock" }),
            }),
        onSuccess: invalidate,
    })
}

export function useVoteLunch() {
    const invalidate = useInvalidateLunch()

    return useMutation({
        mutationFn: (restaurantId: number) =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "vote", restaurantId }),
            }),
        onSuccess: invalidate,
    })
}

export function useCloseLunchRound() {
    const invalidate = useInvalidateLunch()

    return useMutation({
        mutationFn: () =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "close" }),
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
