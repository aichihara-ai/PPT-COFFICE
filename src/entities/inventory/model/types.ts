export type InventoryItemKey = "coffee" | "milk"
export type InventoryStatus = "ok" | "low"

export const INVENTORY_LABELS = {
    coffee: "Coffee",
    milk: "Milk",
} as const

export const INVENTORY_ITEM_CONFIG: Record<
    InventoryItemKey,
    { label: string; emoji: string; description?: string }
> = {
    coffee: { label: "Coffee", emoji: "☕" },
    milk: { label: "Milk", emoji: "🥛" },
}

export const INVENTORY_STATUS_EMOJI: Record<InventoryStatus, string> = {
    ok: "✅",
    low: "⚠️",
}

export const INVENTORY_STATUS_LABEL: Record<InventoryStatus, string> = {
    ok: "Stocked",
    low: "Running low",
}
