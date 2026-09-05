export function normalizeGroupOrderUrl(value: string) {
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

export function isValidGroupOrderUrl(value: string) {
    return normalizeGroupOrderUrl(value).length > 0
}
