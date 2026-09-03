import { routes, type RoutesType } from "@/configs/route"
import { SIDEBAR_CONFIG } from "@/consts/sidebar"
import type { LucideIcon } from "lucide-react"

function toSidebarItem(route: RoutesType, pathname: string) {
    return {
        title: route.label,
        url: route.path,
        icon: route.icon as LucideIcon,
        isActive: pathname === route.path,
    }
}

export function createSidebarMenu(
    pathname: string,
    _activeThemeId: string,
    setTheme: (id: string) => void
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
    for (const route of Object.values(routes)) {
        const items = groupMap.get(route.group) ?? []
        items.push(toSidebarItem(route, pathname))
        groupMap.set(route.group, items)
    }

    const groups = Array.from(groupMap.entries()).map(([label, items]) => ({
        label,
        items,
    }))

    return { teams, groups }
}
