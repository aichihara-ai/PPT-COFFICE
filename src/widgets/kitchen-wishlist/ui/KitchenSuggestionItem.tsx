import {
    kitchenItemDisplayTitle,
    kitchenLinkLabel,
    normalizeKitchenUrl,
} from "@/shared/lib/kitchen-links"
import type { SuggestionStatus } from "@/entities/suggestion"
import { Badge, Button } from "@ppt/luminis"

type KitchenSuggestionItemProps = {
    id: number
    text: string
    title?: string | null
    status: SuggestionStatus
    userName: string
    isAdmin?: boolean
    onMarkBought?: (id: number) => void
    onDecline?: (id: number) => void
}

const STATUS_VARIANT: Record<SuggestionStatus, "default" | "secondary" | "destructive"> = {
    open: "default",
    bought: "secondary",
    declined: "destructive",
}

const ACTION_CLASS = "min-w-0 flex-1 sm:flex-none"

export function KitchenSuggestionItem({
    id,
    text,
    title,
    status,
    userName,
    isAdmin = false,
    onMarkBought,
    onDecline,
}: KitchenSuggestionItemProps) {
    const href = normalizeKitchenUrl(text)
    const label = kitchenItemDisplayTitle(text, title)
    const fallback = kitchenLinkLabel(text)
    const showFallback = Boolean(title?.trim()) && fallback !== label

    return (
        <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate font-medium">{label}</p>
                {showFallback ? (
                    <p className="truncate text-xs text-muted-foreground">{fallback}</p>
                ) : null}
                <p className="text-sm text-muted-foreground">{userName}</p>
            </div>
            <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                {href ? (
                    <Button asChild size="sm" variant="default" className={ACTION_CLASS}>
                        <a href={href} target="_blank" rel="noopener noreferrer">
                            Open
                        </a>
                    </Button>
                ) : (
                    <Badge variant={STATUS_VARIANT[status]} className="shrink-0">
                        {status}
                    </Badge>
                )}
                {isAdmin && status === "open" ? (
                    <>
                        <Button
                            size="sm"
                            variant="secondary"
                            className={ACTION_CLASS}
                            onClick={() => onMarkBought?.(id)}
                        >
                            Bought
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className={ACTION_CLASS}
                            onClick={() => onDecline?.(id)}
                        >
                            Decline
                        </Button>
                    </>
                ) : null}
            </div>
        </div>
    )
}
