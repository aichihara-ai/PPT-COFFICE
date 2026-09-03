import { Building2 } from "lucide-react"

export const SIDEBAR_CONFIG = {
    HEADER: {
        DROPDOWN: {
            TITLE: "Office",
            TEAMS: {
                VANCOUVER: {
                    NAME: "Office Hub",
                    LOGO: Building2,
                    PLAN: "Vancouver",
                    THEME_ID: "standard",
                },
            },
        },
    },
} as const
