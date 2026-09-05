export type SuggestionStatus = "open" | "bought" | "declined"

export type Suggestion = {
    id: number
    text: string
    title?: string | null
    status: SuggestionStatus
    created_at: string
    user_name: string
}

export const SUGGESTION_TITLE_MAX_LENGTH = 80

export function normalizeSuggestionTitle(value: string | null | undefined) {
    const trimmed = value?.trim() ?? ""
    if (!trimmed) return null
    return trimmed.slice(0, SUGGESTION_TITLE_MAX_LENGTH)
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
