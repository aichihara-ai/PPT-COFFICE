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
