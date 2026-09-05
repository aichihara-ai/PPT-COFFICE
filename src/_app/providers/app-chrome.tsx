"use client"

import { usePathname, useRouter } from "next/navigation"

import { APP_ROUTE_PATHS } from "@/shared/config"
import { AppShellLayout, ProtectedLayout } from "@/widgets/app-shell"
import { useBrandTheme } from "./theme-provider"

export function AppChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { activeThemeId, setTheme } = useBrandTheme()

    if (pathname === "/login") {
        return children
    }

    if (!APP_ROUTE_PATHS.has(pathname)) {
        return children
    }

    return (
        <ProtectedLayout>
            <AppShellLayout
                activeThemeId={activeThemeId}
                navigate={router.push}
                setTheme={setTheme}
            >
                {children}
            </AppShellLayout>
        </ProtectedLayout>
    )
}
