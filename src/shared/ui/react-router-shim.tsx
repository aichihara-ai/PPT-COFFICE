"use client"

import { usePathname } from "next/navigation"
import { MemoryRouter } from "react-router-dom"

export function ReactRouterShim({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <MemoryRouter key={pathname} initialEntries={[pathname]}>
            {children}
        </MemoryRouter>
    )
}
