export { isValidUberEatsUrl, normalizeUberEatsUrl } from "@/shared/lib/uber-eats-links"
export type { MenuPreview, MenuPreviewItem, Restaurant } from "./model/types"
export {
    LEGACY_SEEDED_RESTAURANT_NAMES,
    RESTAURANT_TITLE_MAX_LENGTH,
    normalizeRestaurantTitle,
    resolveRestaurantName,
    restaurantDisplayTitle,
    withoutUnlinkedPoolRestaurants,
    type AddRestaurantLinkInput,
} from "@/shared/lib/restaurant-title"
