export const PREFERRED_KITCHEN_STORES = [
    {
        id: "costco",
        label: "Costco.ca",
        url: "https://www.costco.ca",
        hint: "Paste a product link from costco.ca",
    },
    {
        id: "canadian-tire",
        label: "Canadian Tire",
        url: "https://www.canadiantire.ca",
        hint: "Paste a product link from canadiantire.ca",
    },
    {
        id: "no-frills",
        label: "No Frills",
        url: "https://www.nofrills.ca",
        hint: "Paste a product link from nofrills.ca",
    },
] as const

export function normalizeKitchenUrl(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return ""

    try {
        const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
        const url = new URL(withProtocol)
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return ""
        }
        return url.toString()
    } catch {
        return ""
    }
}

export function isValidKitchenUrl(value: string) {
    return normalizeKitchenUrl(value).length > 0
}

export function isPreferredKitchenUrl(value: string) {
    const normalized = normalizeKitchenUrl(value)
    if (!normalized) return false

    try {
        const host = new URL(normalized).hostname.replace(/^www\./, "")
        return PREFERRED_KITCHEN_STORES.some((store) => {
            const storeHost = new URL(store.url).hostname.replace(/^www\./, "")
            return host === storeHost || host.endsWith(`.${storeHost}`)
        })
    } catch {
        return false
    }
}

export function kitchenLinkLabel(value: string) {
    const normalized = normalizeKitchenUrl(value)
    if (!normalized) return value

    try {
        const url = new URL(normalized)
        const path = url.pathname === "/" ? "" : url.pathname
        return `${url.hostname.replace(/^www\./, "")}${path}`.slice(0, 72)
    } catch {
        return value
    }
}

export function kitchenItemDisplayTitle(
    text: string,
    title?: string | null
) {
    const trimmed = title?.trim()
    if (trimmed) return trimmed
    return kitchenLinkLabel(text)
}
