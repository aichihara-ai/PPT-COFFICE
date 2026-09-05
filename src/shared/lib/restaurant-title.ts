import { uberEatsLinkLabel } from "./uber-eats-links.ts"

export const RESTAURANT_TITLE_MAX_LENGTH = 80

export const LEGACY_SEEDED_RESTAURANT_NAMES = [
    "Japadog",
    "Mezze",
    "Nuba",
    "Earls",
    "Cactus Club",
    "Honest Greens",
    "Tractor Foods",
    "Chipotle",
    "Poké Man",
    "Banana Leaf",
    "Peaceful Restaurant",
    "Jamjar",
    "Nando's",
    "Freshii",
    "Burgers + Fries",
] as const

export type AddRestaurantLinkInput = {
    uberEatsUrl: string
    title?: string
}

export function normalizeRestaurantTitle(value: string | null | undefined) {
    const trimmed = value?.trim() ?? ""
    if (!trimmed) return null
    return trimmed.slice(0, RESTAURANT_TITLE_MAX_LENGTH)
}

export function resolveRestaurantName(input: {
    title?: string | null
    scrapedName?: string | null
    uberEatsUrl?: string | null
}) {
    return (
        normalizeRestaurantTitle(input.title) ||
        normalizeRestaurantTitle(input.scrapedName) ||
        (input.uberEatsUrl ? uberEatsLinkLabel(input.uberEatsUrl) : "") ||
        "Restaurant"
    )
}

export function restaurantDisplayTitle(
    name?: string | null,
    uberEatsUrl?: string | null
) {
    return (
        normalizeRestaurantTitle(name) ||
        (uberEatsUrl ? uberEatsLinkLabel(uberEatsUrl) : "") ||
        "Restaurant"
    )
}

export function withoutUnlinkedPoolRestaurants<T extends { uber_eats_url?: string | null }>(
    restaurants: T[]
) {
    return restaurants.filter((restaurant) => Boolean(restaurant.uber_eats_url))
}
