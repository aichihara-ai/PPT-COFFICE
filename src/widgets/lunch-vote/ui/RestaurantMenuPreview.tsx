import { ExternalLink } from "lucide-react"

import type { MenuPreview } from "@/shared/lib/uber-eats-menu"
import { Button } from "@ppt/luminis"

type RestaurantMenuPreviewProps = {
    menu: MenuPreview | null | undefined
    compact?: boolean
    showUnavailableNote?: boolean
}

export function RestaurantMenuPreview({
    menu,
    compact = false,
    showUnavailableNote = true,
}: RestaurantMenuPreviewProps) {
    if (!menu?.uberEatsUrl) {
        return (
            <p className="text-xs text-muted-foreground">No Uber Eats link for this spot yet.</p>
        )
    }

    const hasItems = (menu.items?.length ?? 0) > 0

    return (
        <div className={compact ? "space-y-2" : "space-y-3"}>
            <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 shrink-0" asChild>
                    <a href={menu.uberEatsUrl} target="_blank" rel="noopener noreferrer">
                        Open menu
                        <ExternalLink className="size-3.5" />
                    </a>
                </Button>
                {menu.unavailable && showUnavailableNote ? (
                    <span className="text-xs text-muted-foreground">
                        Live menu preview blocked — open Uber Eats to browse.
                    </span>
                ) : null}
            </div>

            {hasItems ? (
                <ul
                    className={
                        compact
                            ? "max-h-36 space-y-1 overflow-y-auto rounded-md border bg-muted/30 p-2 text-xs"
                            : "max-h-48 space-y-2 overflow-y-auto rounded-md border p-3 text-sm"
                    }
                >
                    {menu.items.map((item) => (
                        <li
                            key={`${item.name}-${item.price ?? ""}`}
                            className="flex items-start justify-between gap-2"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium">{item.name}</p>
                                {item.description ? (
                                    <p className="truncate text-muted-foreground">
                                        {item.description}
                                    </p>
                                ) : null}
                            </div>
                            {item.price ? (
                                <span className="shrink-0 text-muted-foreground">{item.price}</span>
                            ) : null}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    )
}
