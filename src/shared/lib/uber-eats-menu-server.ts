import {
    normalizeUberEatsUrl,
    parseUberEatsUrl,
    slugToDisplayName,
} from "@/shared/lib/uber-eats-links"

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

export { normalizeUberEatsUrl }

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

        const finalHost = new URL(response.url).hostname.replace(/^www\./, "")
        if (finalHost !== "ubereats.com" || !response.ok) {
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
