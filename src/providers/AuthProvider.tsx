import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

import { getDemoUser, setDemoUserRole } from "@/lib/demoStore"
import type { User } from "@/types"

type AuthContextValue = {
    user: User
    setAdminMode: (isAdmin: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(() => getDemoUser())

    const value = useMemo(
        () => ({
            user,
            setAdminMode: (isAdmin: boolean) => {
                setUser(setDemoUserRole(isAdmin))
            },
        }),
        [user]
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
