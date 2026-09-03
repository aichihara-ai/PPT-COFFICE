import type { InventoryStatus } from "@/types"

export type InventoryItemKey = "coffee" | "milk"

export const INVENTORY_ITEM_CONFIG: Record<
    InventoryItemKey,
    { label: string; emoji: string }
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
