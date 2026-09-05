import { Building2 } from "lucide-react"

export const DEFAULT_THEME_ID = "standard"
export const THEME_STORAGE_KEY_BRAND = "brand-theme"

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

const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV

export const isApiMode =
    process.env.NEXT_PUBLIC_USE_API === "true" ||
    vercelEnv === "production" ||
    vercelEnv === "preview"
