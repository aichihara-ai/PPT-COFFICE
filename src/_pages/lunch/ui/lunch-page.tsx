"use client"

import { toast } from "sonner"

import { useRequiredUser } from "@/features/auth"
import {
    useAddRestaurantFromLink,
    useCloseLunchRound,
    useLockLunchCandidates,
    useLunchPanel,
    useNominateLunch,
    useRestaurants,
    useStartLunchRound,
    useVoteLunch,
} from "@/features/manage-lunch"
import { PageShell } from "@/widgets/app-shell"
import { LunchVotePanel } from "@/widgets/lunch-vote"
import { Card, CardContent } from "@ppt/luminis"

export function LunchPage() {
    const user = useRequiredUser()
    const { data: lunchData, isLoading: lunchLoading } = useLunchPanel()
    const { data: restaurantData } = useRestaurants()
    const restaurants = restaurantData?.restaurants ?? []

    const startMutation = useStartLunchRound()
    const nominateMutation = useNominateLunch()
    const lockMutation = useLockLunchCandidates()
    const voteMutation = useVoteLunch()
    const closeMutation = useCloseLunchRound()
    const addRestaurantMutation = useAddRestaurantFromLink()

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
                        onStart={() =>
                            startMutation.mutate(undefined, {
                                onSuccess: () => toast.success("Lunch round started"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
                        onNominate={(id) =>
                            nominateMutation.mutate(id, {
                                onSuccess: () => toast.success("Nomination saved"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
                        onLock={() =>
                            lockMutation.mutate(undefined, {
                                onSuccess: () => toast.success("Top 3 locked — voting open"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
                        onVote={(id) =>
                            voteMutation.mutate(id, {
                                onSuccess: () => toast.success("Vote recorded"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
                        onClose={() =>
                            closeMutation.mutate(undefined, {
                                onSuccess: () => toast.success("Round closed"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
                        onAddRestaurant={(uberEatsUrl) =>
                            addRestaurantMutation.mutate(uberEatsUrl, {
                                onSuccess: () =>
                                    toast.success("Restaurant added from Uber Eats link"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
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
