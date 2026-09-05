import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { InventoryItemKey, InventoryStatus } from "@/entities/inventory"
import { apiFetch } from "@/shared/api"

const inventoryKey = ["inventory"] as const

type InventoryRow = {
    item: InventoryItemKey
    status: InventoryStatus
    updated_at: string
    updated_by_name: string | null
}

export function useInventory() {
    return useQuery({
        queryKey: inventoryKey,
        queryFn: () => apiFetch<{ inventory: InventoryRow[] }>("/api/inventory"),
    })
}

export function useUpdateInventory() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body: { item: InventoryItemKey; status: InventoryStatus }) =>
            apiFetch("/api/inventory", {
                method: "PATCH",
                body: JSON.stringify(body),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: inventoryKey })
        },
    })
}
