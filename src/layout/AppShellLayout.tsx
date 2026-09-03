import { SIDEBAR_CONFIG } from "@/consts/sidebar"
import LayoutHeader from "@/components/layouts/LayoutHeader"
import { createSidebarMenu } from "@/layout/createSidebarMenu"
import { useAuth } from "@/providers/AuthProvider"
import { useBrandTheme } from "@/providers/ThemeProvider"
import { AppSidebar, SidebarInset, SidebarProvider } from "@ppt/luminis"
import { Outlet, useLocation } from "react-router-dom"

export function AppShellLayout() {
    const { pathname } = useLocation()
    const { activeThemeId, setTheme } = useBrandTheme()
    const { user } = useAuth()
    const sidebarData = createSidebarMenu(pathname, activeThemeId, setTheme)

    const teamEntries = Object.values(SIDEBAR_CONFIG.HEADER.DROPDOWN.TEAMS)
    const activeTeamIndex = teamEntries.findIndex(
        (t) => t.THEME_ID === activeThemeId
    )

    return (
        <SidebarProvider>
            <div className="flex w-full flex-row">
                <AppSidebar
                    data={{
                        user: {
                            name: user.name,
                            email: user.isAdmin ? "HR Admin" : "Team member",
                            avatar: "",
                        },
                        teams: sidebarData.teams,
                        groups: sidebarData.groups,
                    }}
                    shouldShowSidebarTrigger
                    headerDropdownTitle={SIDEBAR_CONFIG.HEADER.DROPDOWN.TITLE}
                    hideFooterDropdown
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
                                <Outlet />
                            </main>
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}
