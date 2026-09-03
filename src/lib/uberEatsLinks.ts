const UBER_EATS_HOSTS = new Set(["ubereats.com", "www.ubereats.com"])

export function normalizeUberEatsUrl(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return ""

    try {
        const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
        const url = new URL(withProtocol)
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return ""
        }
        const host = url.hostname.replace(/^www\./, "")
        if (!UBER_EATS_HOSTS.has(host) && host !== "ubereats.com") {
            return ""
        }
        url.hash = ""
        return url.toString()
    } catch {
        return ""
    }
}

export function isValidUberEatsUrl(value: string) {
    return normalizeUberEatsUrl(value).length > 0
}

export function parseUberEatsUrl(value: string) {
    const normalized = normalizeUberEatsUrl(value)
    if (!normalized) {
        return { slug: "", storeId: null as string | null }
    }

    const segments = new URL(normalized).pathname.split("/").filter(Boolean)
    const storeIndex = segments.indexOf("store")
    if (storeIndex >= 0 && segments[storeIndex + 1]) {
        return {
            slug: segments[storeIndex + 1],
            storeId: segments[storeIndex + 2] ?? null,
        }
    }

    const deliveryIndex = segments.indexOf("food-delivery")
    if (deliveryIndex >= 0 && segments[deliveryIndex + 1]) {
        return {
            slug: segments[deliveryIndex + 1],
            storeId: segments[deliveryIndex + 2] ?? null,
        }
    }

    if (segments.length >= 2) {
        return {
            slug: segments[segments.length - 2],
            storeId: segments[segments.length - 1],
        }
    }

    return { slug: segments[0] ?? "restaurant", storeId: null }
}

export function slugToDisplayName(slug: string) {
    if (!slug) return "Restaurant"

    return slug
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

export function uberEatsLinkLabel(value: string) {
    const normalized = normalizeUberEatsUrl(value)
    if (!normalized) return value

    const { slug } = parseUberEatsUrl(normalized)
    return slugToDisplayName(slug)
}
