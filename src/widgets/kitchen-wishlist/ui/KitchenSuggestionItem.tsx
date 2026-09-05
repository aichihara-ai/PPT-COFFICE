import { kitchenLinkLabel, normalizeKitchenUrl } from "@/shared/lib/kitchen-links"
import type { SuggestionStatus } from "@/entities/suggestion"
import { Badge, Button } from "@ppt/luminis"

type KitchenSuggestionItemProps = {
    id: number
    text: string
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

export function KitchenSuggestionItem({
    id,
    text,
    status,
    userName,
    isAdmin = false,
    onMarkBought,
    onDecline,
}: KitchenSuggestionItemProps) {
    const href = normalizeKitchenUrl(text)
    const label = kitchenLinkLabel(text)

    return (
        <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1 space-y-1">
                {href ? (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate font-medium text-primary underline-offset-4 hover:underline"
                    >
                        {label}
                    </a>
                ) : (
                    <p className="truncate font-medium">{text}</p>
                )}
                <p className="text-sm text-muted-foreground">{userName}</p>
            </div>
            <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                <Badge variant={STATUS_VARIANT[status]} className="shrink-0">
                    {status}
                </Badge>
                {isAdmin && status === "open" ? (
                    <>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="min-w-0 flex-1 sm:flex-none"
                            onClick={() => onMarkBought?.(id)}
                        >
                            Bought
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="min-w-0 flex-1 sm:flex-none"
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
