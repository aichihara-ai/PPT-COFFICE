export type MenuPreviewItem = {
    name: string
    price?: string
    description?: string
}

export type MenuPreview = {
    storeName: string
    uberEatsUrl: string
    fetchedAt: string
    items: MenuPreviewItem[]
    unavailable?: boolean
}

export type Restaurant = {
    id: number
    name: string
    notes: string | null
    active: boolean
    uber_eats_url?: string | null
    menu_preview?: MenuPreview | null
}
