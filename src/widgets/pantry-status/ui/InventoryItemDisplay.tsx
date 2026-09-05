import type { InventoryItemKey } from "@/entities/inventory"
import {
    INVENTORY_ITEM_CONFIG,
    INVENTORY_STATUS_EMOJI,
    INVENTORY_STATUS_LABEL,
} from "@/entities/inventory"
import type { InventoryStatus } from "@/entities/inventory"
import { cn } from "@/shared/lib/cn"

type InventoryItemHeaderProps = {
    itemKey: InventoryItemKey
    description?: string
    size?: "sm" | "lg"
}

export function InventoryItemHeader({
    itemKey,
    description,
    size = "lg",
}: InventoryItemHeaderProps) {
    const { label, emoji } = INVENTORY_ITEM_CONFIG[itemKey]

    return (
        <div className="flex items-center gap-3">
            <span
                className={cn(
                    "flex shrink-0 items-center justify-center rounded-lg bg-muted",
                    size === "lg" ? "size-14 text-3xl" : "size-10 text-xl"
                )}
                aria-hidden
            >
                {emoji}
            </span>
            <div className="min-w-0 space-y-0.5">
                <span
                    className={cn(
                        "font-semibold text-foreground",
                        size === "lg" ? "text-lg" : "text-sm"
                    )}
                >
                    {label}
                </span>
                {description ? (
                    <p className="text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
        </div>
    )
}

export function InventoryStatusLabel({
    status,
    showEmoji = true,
}: {
    status: InventoryStatus
    showEmoji?: boolean
}) {
    return (
        <span className="inline-flex items-center gap-1.5">
            {showEmoji ? <span aria-hidden>{INVENTORY_STATUS_EMOJI[status]}</span> : null}
            {INVENTORY_STATUS_LABEL[status]}
        </span>
    )
}
