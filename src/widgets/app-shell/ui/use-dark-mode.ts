"use client"

import { useEffect, useState } from "react"

import { THEME_PREFERENCE, THEME_STORAGE_KEY } from "@/shared/config"

export function useDarkMode() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof document === "undefined") return false
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        if (stored === THEME_PREFERENCE.DARK) return true
        if (stored === THEME_PREFERENCE.LIGHT) return false
        return document.documentElement.classList.contains(THEME_PREFERENCE.DARK)
    })

    useEffect(() => {
        const root = document.documentElement
        const stored = localStorage.getItem(THEME_STORAGE_KEY) as
            | typeof THEME_PREFERENCE.DARK
            | typeof THEME_PREFERENCE.LIGHT
            | null

        if (
            stored === THEME_PREFERENCE.DARK ||
            (!stored && root.classList.contains(THEME_PREFERENCE.DARK))
        ) {
            root.classList.add(THEME_PREFERENCE.DARK)
        } else {
            root.classList.remove(THEME_PREFERENCE.DARK)
        }
    }, [])

    const toggle = () => {
        const root = document.documentElement
        const nextIsDark = !root.classList.contains(THEME_PREFERENCE.DARK)
        if (nextIsDark) {
            root.classList.add(THEME_PREFERENCE.DARK)
            localStorage.setItem(THEME_STORAGE_KEY, THEME_PREFERENCE.DARK)
            setIsDark(true)
        } else {
            root.classList.remove(THEME_PREFERENCE.DARK)
            localStorage.setItem(THEME_STORAGE_KEY, THEME_PREFERENCE.LIGHT)
            setIsDark(false)
        }
    }

    return { isDark, toggle }
}
