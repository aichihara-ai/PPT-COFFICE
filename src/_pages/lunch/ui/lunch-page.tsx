"use client"

import { toast } from "sonner"

import { useRequiredUser } from "@/features/auth"
import {
    useAddRestaurantFromLink,
    useCloseLunchRound,
    useLunchPanel,
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
    const voteMutation = useVoteLunch()
    const closeMutation = useCloseLunchRound()
    const addRestaurantMutation = useAddRestaurantFromLink()

    return (
        <PageShell
            title="Office lunch vote"
            description="One step: pick up to 3 spots. The most popular option wins."
        >
            <Card>
                <CardContent className="p-4">
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
                        onVote={(id) =>
                            voteMutation.mutate(id, {
                                onSuccess: () => toast.success("Vote updated"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
                        onClose={() =>
                            closeMutation.mutate(undefined, {
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
                        startPending={startMutation.isPending}
                        votePending={voteMutation.isPending}
                        closePending={closeMutation.isPending}
                        addRestaurantPending={addRestaurantMutation.isPending}
                    />
                </CardContent>
            </Card>
        </PageShell>
    )
}
