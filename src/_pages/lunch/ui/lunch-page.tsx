"use client"

import { toast } from "sonner"

import { useRequiredUser } from "@/features/auth"
import {
    useAddRestaurantFromLink,
    useCloseLunchRound,
    useLunchPanel,
    useRestaurants,
    useStartLunchRound,
    usePickLunch,
    useSetGroupOrderLink,
} from "@/features/manage-lunch"
import { formatWinnerToast } from "@/shared/lib/lunch-round"
import { PageShell } from "@/widgets/app-shell"
import { LunchVotePanel } from "@/widgets/lunch-vote"
import { Card, CardContent } from "@ppt/luminis"

export function LunchPage() {
    const user = useRequiredUser()
    const { data: lunchData, isLoading: lunchLoading } = useLunchPanel()
    const { data: restaurantData } = useRestaurants()
    const restaurants = restaurantData?.restaurants ?? []

    const startMutation = useStartLunchRound()
    const pickMutation = usePickLunch()
    const closeMutation = useCloseLunchRound()
    const addRestaurantMutation = useAddRestaurantFromLink()
    const groupOrderMutation = useSetGroupOrderLink()

    return (
        <PageShell
            title="Office lunch vote"
            description="Pick exactly 3 spots from the pool. When everyone's in or time's up, the top pick wins—or two if it's close (40%+)."
        >
            <Card>
                <CardContent className="pt-6">
                    <LunchVotePanel
                        lunchData={lunchData}
                        restaurants={restaurants}
                        user={user}
                        isLoading={lunchLoading}
                        onStart={(votingEndsAt) =>
                            startMutation.mutate(votingEndsAt, {
                                onSuccess: () => toast.success("Lunch round started"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
                        onPick={(id) =>
                            pickMutation.mutate(id, {
                                onSuccess: (data) =>
                                    toast.success(data.picked ? "Pick added" : "Pick removed"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
                        onClose={() =>
                            closeMutation.mutate(undefined, {
                                onSuccess: (data) =>
                                    toast.success(
                                        formatWinnerToast(data.winnerName, data.secondWinnerName)
                                    ),
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
                        onSetGroupOrderLink={(url) =>
                            groupOrderMutation.mutate(url, {
                                onSuccess: () => toast.success("Group order link saved"),
                                onError: (e) => toast.error(e.message),
                            })
                        }
                        startPending={startMutation.isPending}
                        pickPending={pickMutation.isPending}
                        closePending={closeMutation.isPending}
                        addRestaurantPending={addRestaurantMutation.isPending}
                        groupOrderPending={groupOrderMutation.isPending}
                    />
                </CardContent>
            </Card>
        </PageShell>
    )
}
