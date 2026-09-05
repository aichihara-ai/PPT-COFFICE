import { ExternalLink } from "lucide-react"

import { menuStoreUrl, type MenuPreview } from "@/shared/lib/uber-eats-menu"
import { Button } from "@ppt/luminis"

type RestaurantMenuPreviewProps = {
    menu: MenuPreview | null | undefined
}

export function RestaurantMenuPreview({ menu }: RestaurantMenuPreviewProps) {
    const storeUrl = menuStoreUrl(menu)

    if (!storeUrl) {
        return null
    }

    return (
        <Button size="sm" variant="ghost" className="h-8 gap-1.5 px-2" asChild>
            <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                Open menu
                <ExternalLink className="size-3.5" />
            </a>
        </Button>
    )
}
