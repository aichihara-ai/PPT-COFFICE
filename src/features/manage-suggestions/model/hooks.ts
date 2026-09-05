import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Suggestion, SuggestionStatus } from "@/entities/suggestion"
import { normalizeSuggestionUrl } from "@/entities/suggestion"
import { apiFetch } from "@/shared/api"

const suggestionsKey = ["suggestions"] as const

export function useSuggestions() {
    return useQuery({
        queryKey: suggestionsKey,
        queryFn: () => apiFetch<{ suggestions: Suggestion[] }>("/api/suggestions"),
    })
}

export function useAddSuggestion() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (text: string) =>
            apiFetch("/api/suggestions", {
                method: "POST",
                body: JSON.stringify({ text: normalizeSuggestionUrl(text) }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: suggestionsKey })
        },
    })
}

export function useUpdateSuggestionStatus() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: SuggestionStatus }) =>
            apiFetch(`/api/suggestions?id=${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: suggestionsKey })
        },
    })
}
