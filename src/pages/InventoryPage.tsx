import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import {
    InventoryItemHeader,
    InventoryStatusLabel,
} from "@/components/inventory/InventoryItemDisplay"
import { PageShell } from "@/components/layouts/PageShell"
import { INVENTORY_ITEM_CONFIG } from "@/consts/inventory"
import { apiFetch } from "@/lib/api"
import { useRequiredUser } from "@/providers/AuthProvider"
import type { InventoryStatus } from "@/types"
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
} from "@ppt/luminis"

type InventoryItem = {
    item: "coffee" | "milk"
    status: InventoryStatus
    updated_at: string
    updated_by_name: string | null
}

const STATUS_BADGE: Record<InventoryStatus, "secondary" | "destructive"> = {
    ok: "secondary",
    low: "destructive",
}

export function InventoryPage() {
    const user = useRequiredUser()
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery({
        queryKey: ["inventory"],
        queryFn: () => apiFetch<{ inventory: InventoryItem[] }>("/api/inventory"),
    })

    const updateMutation = useMutation({
        mutationFn: ({
            item,
            status,
        }: {
            item: "coffee" | "milk"
            status: InventoryStatus
        }) =>
            apiFetch("/api/inventory", {
                method: "PATCH",
                body: JSON.stringify({ item, status }),
            }),
        onSuccess: (_, { status }) => {
            toast.success(
                status === "low" ? "Team notified — running low" : "Marked as restocked"
            )
            queryClient.invalidateQueries({ queryKey: ["inventory"] })
        },
        onError: (error: Error) => toast.error(error.message),
    })

    const items = data?.inventory ?? []

    return (
        <PageShell
            title="Coffee & milk ☕🥛"
            description="Tell the team when we're running low. HR marks it bought once it's restocked."
        >
            <div className="grid gap-4 md:grid-cols-2">
                {(["coffee", "milk"] as const).map((itemKey) => {
                    const item = items.find((entry) => entry.item === itemKey)
                    const status = item?.status ?? "ok"
                    const meta = INVENTORY_ITEM_CONFIG[itemKey]

                    return (
                        <Card key={itemKey}>
                            <CardHeader>
                                <InventoryItemHeader
                                    itemKey={itemKey}
                                    description={
                                        isLoading
                                            ? "Loading…"
                                            : item?.updated_by_name
                                              ? `Last update by ${item.updated_by_name}`
                                              : "No updates yet"
                                    }
                                />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Badge variant={STATUS_BADGE[status]} className="text-base">
                                    <InventoryStatusLabel status={status} />
                                </Badge>
                                {item?.updated_at ? (
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(item.updated_at).toLocaleString()}
                                    </p>
                                ) : null}
                                <div className="flex flex-wrap gap-2">
                                    {status === "ok" ? (
                                        <Button
                                            variant="outline"
                                            className="h-auto min-h-9 whitespace-normal px-3 py-2 text-sm leading-snug"
                                            onClick={() =>
                                                updateMutation.mutate({
                                                    item: itemKey,
                                                    status: "low",
                                                })
                                            }
                                            disabled={updateMutation.isPending}
                                        >
                                            {meta.emoji} Running low
                                        </Button>
                                    ) : user.isAdmin ? (
                                        <Button
                                            className="h-auto min-h-9 whitespace-normal px-3 py-2 text-sm leading-snug"
                                            onClick={() =>
                                                updateMutation.mutate({
                                                    item: itemKey,
                                                    status: "ok",
                                                })
                                            }
                                            disabled={updateMutation.isPending}
                                        >
                                            {meta.emoji} Restocked
                                        </Button>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            ⚠️ HR has been notified. Waiting for a restock.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </PageShell>
    )
}
