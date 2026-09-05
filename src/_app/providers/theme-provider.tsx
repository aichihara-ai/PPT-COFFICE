"use client"

import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react"

import { DEFAULT_THEME_ID, THEME_STORAGE_KEY_BRAND } from "@/shared/config"

interface BrandThemeContextType {
    activeThemeId: string
    setTheme: (themeId: string) => void
}

const BrandThemeContext = createContext<BrandThemeContextType | null>(null)

const SUPPORTED_THEMES = new Set([DEFAULT_THEME_ID])

function readStoredThemeId() {
    if (typeof window === "undefined") return DEFAULT_THEME_ID
    const stored = localStorage.getItem(THEME_STORAGE_KEY_BRAND)
    return stored && SUPPORTED_THEMES.has(stored) ? stored : DEFAULT_THEME_ID
}

export function BrandThemeProvider({ children }: { children: ReactNode }) {
    const [activeThemeId, setActiveThemeId] = useState(readStoredThemeId)

    const setTheme = useCallback((themeId: string) => {
        if (!SUPPORTED_THEMES.has(themeId)) return
        localStorage.setItem(THEME_STORAGE_KEY_BRAND, themeId)
        setActiveThemeId(themeId)
    }, [])

    return (
        <BrandThemeContext.Provider value={{ activeThemeId, setTheme }}>
            {children}
        </BrandThemeContext.Provider>
    )
}

export function useBrandTheme() {
    const ctx = useContext(BrandThemeContext)
    if (!ctx) {
        throw new Error("useBrandTheme must be used inside BrandThemeProvider")
    }
    return ctx
}
