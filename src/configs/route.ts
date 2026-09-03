import type { ComponentType } from "react"
import { DashboardPage } from "@/pages/DashboardPage"
import { InventoryPage } from "@/pages/InventoryPage"
import { KitchenPage } from "@/pages/KitchenPage"
import { LunchPage } from "@/pages/LunchPage"
import { RoomsPage } from "@/pages/RoomsPage"
import {
    Coffee,
    DoorOpen,
    LayoutDashboard,
    Salad,
    ShoppingBag,
    type LucideIcon,
} from "lucide-react"

export interface RouteConfig {
    path: string
    label: string
    icon: LucideIcon
    group: string
    element: ComponentType
}

export type RoutesType = RouteConfig

export const routes: Record<string, RouteConfig> = {
    dashboard: {
        path: "/",
        label: "Dashboard",
        icon: LayoutDashboard,
        group: "Office",
        element: DashboardPage,
    },
    rooms: {
        path: "/rooms",
        label: "Meeting rooms",
        icon: DoorOpen,
        group: "Office",
        element: RoomsPage,
    },
    kitchen: {
        path: "/kitchen",
        label: "Kitchen snacks",
        icon: ShoppingBag,
        group: "Office",
        element: KitchenPage,
    },
    inventory: {
        path: "/inventory",
        label: "Coffee & milk",
        icon: Coffee,
        group: "Office",
        element: InventoryPage,
    },
    lunch: {
        path: "/lunch",
        label: "Office lunch",
        icon: Salad,
        group: "Office",
        element: LunchPage,
    },
}
