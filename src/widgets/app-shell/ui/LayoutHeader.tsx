"use client"

import { LayoutHeaderBreadCrumb } from "@/widgets/app-shell/ui/LayoutHeaderBreadCrumb"
import { MobileNavSheet } from "@/widgets/app-shell/ui/MobileNavSheet"
import { useAuth } from "@/features/auth"
import { Badge, Button } from "@ppt/luminis"

function LayoutHeader() {
    const { user, isApiMode, logout } = useAuth()

    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-2 sm:h-16 sm:px-4">
            <MobileNavSheet />
            <div className="min-w-0 flex-1">
                <LayoutHeaderBreadCrumb />
            </div>
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                <Badge
                    variant={user?.isAdmin ? "secondary" : "outline"}
                    className="hidden sm:inline-flex"
                >
                    {user?.isAdmin ? "HR Admin" : user?.name ?? "Guest"}
                </Badge>
                {isApiMode ? (
                    <Button type="button" size="sm" variant="outline" onClick={() => void logout()}>
                        Sign out
                    </Button>
                ) : null}
            </div>
        </header>
    )
}

export default LayoutHeader
