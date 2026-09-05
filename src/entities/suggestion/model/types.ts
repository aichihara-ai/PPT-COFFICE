export type SuggestionStatus = "open" | "bought" | "declined"

export type Suggestion = {
    id: number
    text: string
    status: SuggestionStatus
    created_at: string
    user_name: string
}

export function normalizeSuggestionUrl(value: string) {
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
