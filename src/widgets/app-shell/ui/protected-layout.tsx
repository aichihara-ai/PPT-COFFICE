"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

import { useAuth } from "@/features/auth"

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, isApiMode } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isApiMode || isLoading || user) return
        router.replace(`/login?from=${encodeURIComponent(pathname)}`)
    }, [isApiMode, isLoading, user, router, pathname])

    if (!isApiMode) {
        return children
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
                Loading...
            </div>
        )
    }

    if (!user) {
        return null
    }

    return children
}
