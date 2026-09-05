"use client"

import { useState } from "react"
import { toast } from "sonner"

import { useRequiredUser } from "@/features/auth"
import {
    useAddSuggestion,
    useSuggestions,
    useUpdateSuggestionStatus,
} from "@/features/manage-suggestions"
import { PageShell } from "@/widgets/app-shell"
import { KitchenSuggestionItem, KitchenWishlistForm } from "@/widgets/kitchen-wishlist"
import type { SuggestionStatus } from "@/entities/suggestion"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@ppt/luminis"

export function KitchenPage() {
    const user = useRequiredUser()
    const [link, setLink] = useState("")

    const { data, isLoading } = useSuggestions()
    const addMutation = useAddSuggestion()
    const updateMutation = useUpdateSuggestionStatus()

    const openSuggestions =
        data?.suggestions.filter((suggestion) => suggestion.status === "open") ?? []

    return (
        <PageShell
            title="Kitchen wishlist"
            description="Share product links for the office kitchen. HR can mark items as bought."
        >
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add a product link</CardTitle>
                        <CardDescription>
                            Paste a product page link from any store
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <KitchenWishlistForm
                            value={link}
                            onChange={setLink}
                            onSubmit={() =>
                                addMutation.mutate(link, {
                                    onSuccess: () => {
                                        toast.success("Link added to wishlist")
                                        setLink("")
                                    },
                                    onError: (e) => toast.error(e.message),
                                })
                            }
                            isPending={addMutation.isPending}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Open wishlist</CardTitle>
                        <CardDescription>
                            {isLoading
                                ? "Loading…"
                                : `${openSuggestions.length} open link${openSuggestions.length === 1 ? "" : "s"}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {openSuggestions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No open links yet — add one above.
                            </p>
                        ) : (
                            openSuggestions.map((suggestion) => (
                                <KitchenSuggestionItem
                                    key={suggestion.id}
                                    id={suggestion.id}
                                    text={suggestion.text}
                                    status={suggestion.status}
                                    userName={suggestion.user_name}
                                    isAdmin={user.isAdmin}
                                    onMarkBought={(id) =>
                                        updateMutation.mutate({
                                            id,
                                            status: "bought" as SuggestionStatus,
                                        })
                                    }
                                    onDecline={(id) =>
                                        updateMutation.mutate({
                                            id,
                                            status: "declined" as SuggestionStatus,
                                        })
                                    }
                                />
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageShell>
    )
}
