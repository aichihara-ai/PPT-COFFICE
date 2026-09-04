import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { LunchVotePanel, type LunchPanelData } from "@/components/lunch/LunchVotePanel"
import { PageShell } from "@/components/layouts/PageShell"
import { apiFetch } from "@/lib/api"
import { useRequiredUser } from "@/providers/AuthProvider"
import { Card, CardContent } from "@ppt/luminis"

type Restaurant = {
    id: number
    name: string
    notes?: string | null
    uber_eats_url?: string | null
    menu_preview?: import("@/lib/uberEatsMenu").MenuPreview | null
}

export function LunchPage() {
    const user = useRequiredUser()
    const queryClient = useQueryClient()

    const { data: lunchData, isLoading: lunchLoading } = useQuery({
        queryKey: ["lunch"],
        queryFn: () => apiFetch<LunchPanelData>("/api/lunch"),
        refetchInterval: 15_000,
    })

    const { data: restaurantData } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () => apiFetch<{ restaurants: Restaurant[] }>("/api/restaurants"),
    })

    const restaurants = restaurantData?.restaurants ?? []

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["lunch"] })
    }

    const startMutation = useMutation({
        mutationFn: () =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "start" }),
            }),
        onSuccess: () => {
            toast.success("Lunch round started")
            invalidate()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const nominateMutation = useMutation({
        mutationFn: (restaurantId: number) =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "nominate", restaurantId }),
            }),
        onSuccess: () => {
            toast.success("Nomination saved")
            invalidate()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const lockMutation = useMutation({
        mutationFn: () =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "lock" }),
            }),
        onSuccess: () => {
            toast.success("Top 3 locked — voting open")
            invalidate()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const voteMutation = useMutation({
        mutationFn: (restaurantId: number) =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "vote", restaurantId }),
            }),
        onSuccess: () => {
            toast.success("Vote recorded")
            invalidate()
        },
        onError: (e: Error) => toast.error(e.message),
    })

    const closeMutation = useMutation({
        mutationFn: () =>
            apiFetch("/api/lunch", {
                method: "POST",
                body: JSON.stringify({ action: "close" }),
            }),
        onSuccess: () => {
            toast.success("Round closed")
            invalidate()
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

    return (
        <PageShell
            title="Office lunch vote"
            description="Nominate → lock top 3 → vote. One pick per person."
        >
            <Card>
                <CardContent className="pt-6">
                    <LunchVotePanel
                        lunchData={lunchData}
                        restaurants={restaurants}
                        user={user}
                        isLoading={lunchLoading}
                        onStart={() => startMutation.mutate()}
                        onNominate={(id) => nominateMutation.mutate(id)}
                        onLock={() => lockMutation.mutate()}
                        onVote={(id) => voteMutation.mutate(id)}
                        onClose={() => closeMutation.mutate()}
                        onAddRestaurant={(uberEatsUrl) => addRestaurantMutation.mutate(uberEatsUrl)}
                        startPending={startMutation.isPending}
                        nominatePending={nominateMutation.isPending}
                        lockPending={lockMutation.isPending}
                        votePending={voteMutation.isPending}
                        closePending={closeMutation.isPending}
                        addRestaurantPending={addRestaurantMutation.isPending}
                    />
                </CardContent>
            </Card>
        </PageShell>
    )
}
