"use client"

import { LayoutHeaderBreadCrumb } from "@/widgets/app-shell/ui/LayoutHeaderBreadCrumb"
import { MobileNavSheet } from "@/widgets/app-shell/ui/MobileNavSheet"

function LayoutHeader() {
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-2 sm:h-16 sm:px-4">
            <MobileNavSheet />
            <div className="min-w-0 flex-1">
                <LayoutHeaderBreadCrumb />
            </div>
        </header>
    )
}

export default LayoutHeader
