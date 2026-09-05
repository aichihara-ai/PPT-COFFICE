import { routeMeta, SIDEBAR_CONFIG, type RouteMeta } from "@/shared/config"
import type { LucideIcon } from "lucide-react"

function toSidebarItem(
    route: RouteMeta,
    pathname: string,
    navigate: (url: string) => void
) {
    return {
        title: route.label,
        url: route.path,
        icon: route.icon as LucideIcon,
        isActive: pathname === route.path,
        onClick: () => navigate(route.path),
    }
}

export function createSidebarMenu(
    pathname: string,
    _activeThemeId: string,
    setTheme: (id: string) => void,
    navigate: (url: string) => void
) {
    const teams = Object.values(SIDEBAR_CONFIG.HEADER.DROPDOWN.TEAMS).map(
        (team) => ({
            name: team.NAME,
            logo: team.LOGO,
            plan: team.PLAN,
            onClick: () => setTheme(team.THEME_ID),
        })
    )

    const groupMap = new Map<string, ReturnType<typeof toSidebarItem>[]>()
    for (const route of Object.values(routeMeta)) {
        const items = groupMap.get(route.group) ?? []
        items.push(toSidebarItem(route, pathname, navigate))
        groupMap.set(route.group, items)
    }

    const groups = Array.from(groupMap.entries()).map(([label, items]) => ({
        label,
        items,
    }))

    return { teams, groups }
}
