import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"

import { ApiError, apiFetch, isApiMode } from "@/lib/api"
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/authStorage"
import { getDemoUser, setDemoUserRole } from "@/lib/demoStore"
import type { User } from "@/types"

type AuthContextValue = {
    user: User | null
    isLoading: boolean
    isApiMode: boolean
    setAdminMode: (isAdmin: boolean) => void
    login: (name: string, password: string) => Promise<void>
    register: (name: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthResponse = {
    token: string
    user: User
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() =>
        isApiMode ? null : getDemoUser()
    )
    const [isLoading, setIsLoading] = useState(isApiMode)

    const loadSession = useCallback(async () => {
        if (!isApiMode) {
            setIsLoading(false)
            return
        }

        const token = getAuthToken()
        if (!token) {
            setUser(null)
            setIsLoading(false)
            return
        }

        try {
            const data = await apiFetch<{ user: User }>("/api/auth/me")
            setUser(data.user)
        } catch {
            clearAuthToken()
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadSession()
    }, [loadSession])

    const persistAuth = useCallback((data: AuthResponse) => {
        setAuthToken(data.token)
        setUser(data.user)
    }, [])

    const login = useCallback(async (name: string, password: string) => {
        const data = await apiFetch<AuthResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ name, password }),
        })
        persistAuth(data)
    }, [persistAuth])

    const register = useCallback(async (name: string, password: string) => {
        const data = await apiFetch<AuthResponse>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, password }),
        })
        persistAuth(data)
    }, [persistAuth])

    const logout = useCallback(() => {
        if (isApiMode) {
            clearAuthToken()
            setUser(null)
            return
        }
        setUser(getDemoUser())
    }, [])

    const value = useMemo(
        () => ({
            user,
            isLoading,
            isApiMode,
            setAdminMode: (isAdmin: boolean) => {
                if (isApiMode) return
                setUser(setDemoUserRole(isAdmin))
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
