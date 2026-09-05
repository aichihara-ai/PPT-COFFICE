import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { apiFetch } from "@/shared/api"
import type { User } from "@/entities/user"

const sessionKey = ["auth", "session"] as const

export function useSession(skip: boolean) {
    return useQuery({
        queryKey: sessionKey,
        queryFn: () => apiFetch<{ user: User }>("/api/auth/me"),
        enabled: !skip,
        retry: false,
        select: (data) => data.user,
    })
}

export function useLogin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body: { name: string; password: string }) =>
            apiFetch<{ user: User }>("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(body),
            }),
        onSuccess: (data) => {
            queryClient.setQueryData(sessionKey, { user: data.user })
        },
    })
}

export function useRegister() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body: { name: string; password: string }) =>
            apiFetch<{ user: User }>("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(body),
            }),
        onSuccess: (data) => {
            queryClient.setQueryData(sessionKey, { user: data.user })
        },
    })
}
