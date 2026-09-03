export type User = {
    id: number
    name: string
    isAdmin: boolean
}

export type RoomId = "room_a" | "room_b"

export type InventoryStatus = "ok" | "low"

export type SuggestionStatus = "open" | "bought" | "declined"

export type LunchRoundStatus = "nominating" | "voting" | "closed"

export const ROOM_CONFIG: Record<RoomId, { label: string; emoji: string }> = {
    room_a: { label: "Big", emoji: "🟦" },
    room_b: { label: "Small", emoji: "🟩" },
}

/** @deprecated use ROOM_CONFIG */
export const ROOM_LABELS: Record<RoomId, string> = {
    room_a: ROOM_CONFIG.room_a.label,
    room_b: ROOM_CONFIG.room_b.label,
}

export const INVENTORY_LABELS = {
    coffee: "Coffee",
    milk: "Milk",
} as const
