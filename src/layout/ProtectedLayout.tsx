import { Navigate, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/providers/AuthProvider"

export function ProtectedLayout() {
    const { user, isLoading, isApiMode } = useAuth()
    const location = useLocation()

    if (!isApiMode) {
        return <Outlet />
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
                Loading...
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    return <Outlet />
}
