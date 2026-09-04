import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { KitchenSuggestionItem } from "@/components/kitchen/KitchenSuggestionItem"
import { KitchenWishlistForm } from "@/components/kitchen/KitchenWishlistForm"
import { PageShell } from "@/components/layouts/PageShell"
import { apiFetch } from "@/lib/api"
import { normalizeKitchenUrl } from "@/lib/kitchenLinks"
import { useRequiredUser } from "@/providers/AuthProvider"
import type { SuggestionStatus } from "@/types"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@ppt/luminis"

type Suggestion = {
    id: number
    text: string
    status: SuggestionStatus
    created_at: string
    user_name: string
}

export function KitchenPage() {
    const user = useRequiredUser()
    const queryClient = useQueryClient()
    const [link, setLink] = useState("")

    const { data, isLoading } = useQuery({
        queryKey: ["suggestions"],
        queryFn: () => apiFetch<{ suggestions: Suggestion[] }>("/api/suggestions"),
    })

    const addMutation = useMutation({
        mutationFn: () =>
            apiFetch("/api/suggestions", {
                method: "POST",
                body: JSON.stringify({ text: normalizeKitchenUrl(link) }),
            }),
        onSuccess: () => {
            toast.success("Link added to wishlist")
            setLink("")
            queryClient.invalidateQueries({ queryKey: ["suggestions"] })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: SuggestionStatus }) =>
            apiFetch(`/api/suggestions?id=${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suggestions"] })
        },
        onError: (error: Error) => toast.error(error.message),
    })

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
                            onSubmit={() => addMutation.mutate()}
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
                                        updateMutation.mutate({ id, status: "bought" })
                                    }
                                    onDecline={(id) =>
                                        updateMutation.mutate({ id, status: "declined" })
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
