"use client"

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react"
import { useQueryClient } from "@tanstack/react-query"

import { useLogin, useRegister, useSession } from "../model/hooks"
import { ApiError, isApiMode } from "@/shared/api"
import { getDemoUser, setDemoUserRole } from "@/shared/lib/demo-store"
import type { User } from "@/entities/user"

type AuthContextValue = {
    user: User | null
    isLoading: boolean
    isApiMode: boolean
    setAdminMode: (isAdmin: boolean) => void
    login: (name: string, password: string) => Promise<void>
    register: (name: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient()
    const [demoUser, setDemoUser] = useState<User | null>(() =>
        isApiMode ? null : getDemoUser()
    )
    const session = useSession(!isApiMode)
    const loginMutation = useLogin()
    const registerMutation = useRegister()

    const user = isApiMode ? session.data ?? null : demoUser
    const isLoading = isApiMode ? session.isLoading : false

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
        if (isApiMode) {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
            queryClient.removeQueries({ queryKey: ["auth", "session"] })
            return
        }
        setDemoUser(getDemoUser())
    }, [queryClient])

    const value = useMemo(
        () => ({
            user,
            isLoading,
            isApiMode,
            setAdminMode: (isAdmin: boolean) => {
                if (isApiMode) return
                setDemoUser(setDemoUserRole(isAdmin))
            },
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
