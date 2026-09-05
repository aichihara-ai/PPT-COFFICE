"use client"

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    type ReactNode,
} from "react"
import { useQueryClient } from "@tanstack/react-query"

import { useLogin, useRegister, useSession } from "../model/hooks"
import { ApiError } from "@/shared/api"
import type { User } from "@/entities/user"

type AuthContextValue = {
    user: User | null
    isLoading: boolean
    login: (name: string, password: string) => Promise<void>
    register: (name: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient()
    const session = useSession()
    const loginMutation = useLogin()
    const registerMutation = useRegister()

    const user = session.data ?? null
    const isLoading = session.isLoading

    const login = useCallback(
        async (name: string, password: string) => {
            await loginMutation.mutateAsync({ name, password })
        },
        [loginMutation]
    )

    const register = useCallback(
        async (name: string, password: string) => {
            await registerMutation.mutateAsync({ name, password })
        },
        [registerMutation]
    )

    const logout = useCallback(async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
        queryClient.setQueryData(["auth", "session"], { user: null })
        queryClient.removeQueries({ queryKey: ["auth", "session"] })
    }, [queryClient])

    const value = useMemo(
        () => ({
            user,
            isLoading,
            login,
            register,
            logout,
        }),
        [user, isLoading, login, register, logout]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}

export function useRequiredUser(): User {
    const { user } = useAuth()
    if (!user) {
        throw new Error("Authenticated user required")
    }
    return user
}

export function getAuthErrorMessage(error: unknown) {
    if (error instanceof ApiError) {
        return error.message
    }
    if (error instanceof Error) {
        return error.message
    }
    return "Request failed"
}
