type MenuPreviewItem = {
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

function parseUberEatsUrl(value: string) {
    const segments = new URL(value).pathname.split("/").filter(Boolean)
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

function slugToDisplayName(slug: string) {
    if (!slug) return "Restaurant"

    return slug
        .split("-")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

function parseMenuItemsFromHtml(html: string): MenuPreviewItem[] {
    const items: MenuPreviewItem[] = []
    const titleMatches = html.matchAll(/"title":"([^"\\]+)"/g)

    for (const match of titleMatches) {
        const name = match[1]?.trim()
        if (!name || name.length < 3 || name.length > 80) continue
        if (/uber|cookie|privacy|javascript/i.test(name)) continue
        if (items.some((item) => item.name === name)) continue
        items.push({ name })
        if (items.length >= 12) break
    }

    return items
}

export async function extractUberEatsMenu(url: string): Promise<MenuPreview> {
    const normalized = normalizeUberEatsUrl(url)
    if (!normalized) {
        throw new Error("Valid Uber Eats link required")
    }

    const { slug } = parseUberEatsUrl(normalized)
    const storeName = slugToDisplayName(slug)
    const base: MenuPreview = {
        storeName,
        uberEatsUrl: normalized,
        fetchedAt: new Date().toISOString(),
        items: [],
    }

    try {
        const response = await fetch(normalized, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml",
                "Accept-Language": "en-CA,en;q=0.9",
            },
            redirect: "follow",
        })

        if (!response.ok) {
            return { ...base, unavailable: true }
        }

        const html = await response.text()
        const items = parseMenuItemsFromHtml(html)

        if (items.length === 0) {
            return { ...base, unavailable: true }
        }

        return { ...base, items }
    } catch {
        return { ...base, unavailable: true }
    }
}
