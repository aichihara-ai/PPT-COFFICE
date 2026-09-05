"use client"

import { usePathname, useRouter } from "next/navigation"

import { createSidebarMenu } from "@/widgets/app-shell/model/create-sidebar-menu"
import LayoutHeader from "@/widgets/app-shell/ui/LayoutHeader"
import { SidebarAccountMenu } from "@/widgets/app-shell/ui/SidebarAccountMenu"
import { useAuth } from "@/features/auth"
import { SIDEBAR_CONFIG } from "@/shared/config"
import { ReactRouterShim } from "@/shared/ui"
import { AppSidebar, SidebarInset, SidebarProvider } from "@ppt/luminis"

export function AppShellLayout({
    activeThemeId,
    children,
    navigate,
    setTheme,
}: {
    activeThemeId: string
    children: React.ReactNode
    navigate?: (url: string) => void
    setTheme: (themeId: string) => void
}) {
    const pathname = usePathname()
    const router = useRouter()
    const push = navigate ?? router.push.bind(router)
    const { user, logout } = useAuth()
    const sidebarData = createSidebarMenu(pathname, activeThemeId, setTheme, push)

    const teamEntries = Object.values(SIDEBAR_CONFIG.HEADER.DROPDOWN.TEAMS)
    const activeTeamIndex = teamEntries.findIndex(
        (t) => t.THEME_ID === activeThemeId
    )

    return (
        <ReactRouterShim>
            <SidebarProvider>
                <div className="flex w-full flex-row">
                    <AppSidebar
                        data={{
                            user: {
                                name: user?.name ?? "Guest",
                                email: user?.isAdmin ? "HR Admin" : "Team member",
                                avatar: "",
                            },
                            teams: sidebarData.teams,
                            groups: sidebarData.groups,
                        }}
                        shouldShowSidebarTrigger
                        headerDropdownTitle={SIDEBAR_CONFIG.HEADER.DROPDOWN.TITLE}
                        footer={{
                            dropdownEnabled: true,
                            dropdownContent: (
                                <SidebarAccountMenu onSignOut={logout} />
                            ),
                        }}
                        defaultActiveTeamIndex={
                            activeTeamIndex >= 0 ? activeTeamIndex : 0
                        }
                        collapsible="icon"
                    />
                    <SidebarInset className="min-w-0">
                        <div className="flex h-screen w-full min-w-0 flex-col">
                            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                                <LayoutHeader />
                                <main className="min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto bg-background">
                                    {children}
                                </main>
                            </div>
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </ReactRouterShim>
    )
}
