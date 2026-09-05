import {
    Coffee,
    DoorOpen,
    LayoutDashboard,
    Salad,
    ShoppingBag,
    type LucideIcon,
} from "lucide-react"

export interface RouteMeta {
    path: string
    label: string
    icon: LucideIcon
    group: string
}

export const routeMeta: Record<string, RouteMeta> = {
    dashboard: {
        path: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
        group: "Office",
    },
    rooms: {
        path: "/rooms",
        label: "Meeting rooms",
        icon: DoorOpen,
        group: "Office",
    },
    kitchen: {
        path: "/kitchen",
        label: "Kitchen snacks",
        icon: ShoppingBag,
        group: "Office",
    },
    inventory: {
        path: "/inventory",
        label: "Coffee & milk",
        icon: Coffee,
        group: "Office",
    },
    lunch: {
        path: "/lunch",
        label: "Office lunch",
        icon: Salad,
        group: "Office",
    },
}

export const APP_ROUTE_PATHS = new Set(
    Object.values(routeMeta).map((route) => route.path)
)
