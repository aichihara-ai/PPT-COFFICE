type RestaurantImageSet = {
    thumbnail: string
    items: string[]
}

/** Self-hosted lunch thumbnails (see public/lunch/). */
export const RESTAURANT_IMAGES: Record<string, RestaurantImageSet> = {
    Japadog: {
        thumbnail: "/lunch/japadog.jpg",
        items: ["/lunch/japadog.jpg"],
    },
    Mezze: {
        thumbnail: "/lunch/mezze.jpg",
        items: ["/lunch/mezze.jpg"],
    },
    Nuba: {
        thumbnail: "/lunch/nuba.jpg",
        items: ["/lunch/nuba.jpg"],
    },
    Earls: {
        thumbnail: "/lunch/earls.jpg",
        items: ["/lunch/earls.jpg"],
    },
    "Cactus Club": {
        thumbnail: "/lunch/cactus-club.jpg",
        items: ["/lunch/cactus-club.jpg"],
    },
    "Honest Greens": {
        thumbnail: "/lunch/honest-greens.jpg",
        items: ["/lunch/honest-greens.jpg"],
    },
    Chipotle: {
        thumbnail: "/lunch/chipotle.jpg",
        items: ["/lunch/chipotle.jpg"],
    },
    "Poké Man": {
        thumbnail: "/lunch/poke-man.jpg",
        items: ["/lunch/poke-man.jpg"],
    },
    "Banana Leaf": {
        thumbnail: "/lunch/banana-leaf.jpg",
        items: ["/lunch/banana-leaf.jpg"],
    },
    "Peaceful Restaurant": {
        thumbnail: "/lunch/peaceful-restaurant.webp",
        items: ["/lunch/peaceful-restaurant.webp"],
    },
    Jamjar: {
        thumbnail: "/lunch/jamjar.jpg",
        items: ["/lunch/jamjar.jpg"],
    },
    "Nando's": {
        thumbnail: "/lunch/nandos.jpg",
        items: ["/lunch/nandos.jpg"],
    },
    "Tractor Foods": {
        thumbnail: "/lunch/tractor-foods.jpg",
        items: ["/lunch/tractor-foods.jpg"],
    },
    Freshii: {
        thumbnail: "/lunch/freshii.jpg",
        items: ["/lunch/freshii.jpg"],
    },
    "Burgers + Fries": {
        thumbnail: "/lunch/burgers-fries.jpg",
        items: ["/lunch/burgers-fries.jpg"],
    },
}

const GENERIC_FOOD_IMAGES = [
    "/lunch/honest-greens.jpg",
    "/lunch/tractor-foods.jpg",
    "/lunch/freshii.jpg",
    "/lunch/nandos.jpg",
    "/lunch/chipotle.jpg",
    "/lunch/poke-man.jpg",
]

function hashString(value: string) {
    let hash = 0
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

export function restaurantThumbnailUrl(name: string): string {
    const set = RESTAURANT_IMAGES[name]
    if (set) return set.thumbnail

    const normalized = name.toLowerCase()
    for (const [key, value] of Object.entries(RESTAURANT_IMAGES)) {
        if (normalized.startsWith(key.toLowerCase())) {
            return value.thumbnail
        }
    }

    return GENERIC_FOOD_IMAGES[hashString(name) % GENERIC_FOOD_IMAGES.length]
}

export function restaurantItemImageUrl(name: string, itemName: string, index: number): string {
    const set =
        RESTAURANT_IMAGES[name] ??
        Object.entries(RESTAURANT_IMAGES).find(([key]) =>
            name.toLowerCase().startsWith(key.toLowerCase())
        )?.[1]

    if (set?.items.length) return set.items[index % set.items.length]
    return restaurantThumbnailUrl(name || itemName)
}
