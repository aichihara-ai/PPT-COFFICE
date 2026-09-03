import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react"
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY_BRAND } from "@/consts/themes"

import standardCss from "../../theme-packages/standard/css/theme.css?raw"

const THEME_CSS_MAP: Record<string, string> = {
    standard: standardCss,
}

interface BrandThemeContextType {
    activeThemeId: string
    setTheme: (themeId: string) => void
}

const BrandThemeContext = createContext<BrandThemeContextType | null>(null)

const STYLE_ELEMENT_ID = "brand-theme-override"

function applyThemeCss(themeId: string) {
    const css = THEME_CSS_MAP[themeId]
    if (!css) return

    let styleEl = document.getElementById(
        STYLE_ELEMENT_ID
    ) as HTMLStyleElement | null
    if (!styleEl) {
        styleEl = document.createElement("style")
        styleEl.id = STYLE_ELEMENT_ID
        document.head.appendChild(styleEl)
    }
    styleEl.textContent = css
}

export function BrandThemeProvider({ children }: { children: ReactNode }) {
    const [activeThemeId, setActiveThemeId] = useState(() => {
        if (typeof window === "undefined") return DEFAULT_THEME_ID
        return localStorage.getItem(THEME_STORAGE_KEY_BRAND) || DEFAULT_THEME_ID
    })

    useEffect(() => {
        applyThemeCss(activeThemeId)
    }, [activeThemeId])

    const setTheme = useCallback((themeId: string) => {
        if (!THEME_CSS_MAP[themeId]) return
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
