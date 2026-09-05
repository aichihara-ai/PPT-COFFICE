"use client"

import { LayoutHeaderBreadCrumb } from "@/widgets/app-shell/ui/LayoutHeaderBreadCrumb"
import { ThemeToggle } from "@/widgets/app-shell/ui/ThemeToggle"
import { useAuth } from "@/features/auth"
import { Badge, Button } from "@ppt/luminis"

function LayoutHeader() {
    const { user, isApiMode, setAdminMode, logout } = useAuth()

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
            <LayoutHeaderBreadCrumb />
            <div className="flex items-center gap-3">
                {!isApiMode ? (
                    <div className="flex items-center rounded-md border p-0.5">
                        <Button
                            type="button"
                            size="sm"
                            variant={user?.isAdmin ? "ghost" : "secondary"}
                            className="h-7 px-2.5 text-xs"
                            onClick={() => setAdminMode(false)}
                        >
                            Team
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={user?.isAdmin ? "secondary" : "ghost"}
                            className="h-7 px-2.5 text-xs"
                            onClick={() => setAdminMode(true)}
                        >
                            HR Admin
                        </Button>
                    </div>
                ) : null}
                <Badge variant={user?.isAdmin ? "secondary" : "outline"}>
                    {user?.isAdmin ? "HR Admin" : user?.name ?? "Guest"}
                </Badge>
                {isApiMode ? (
                    <Button type="button" size="sm" variant="outline" onClick={() => void logout()}>
                        Sign out
                    </Button>
                ) : null}
                <ThemeToggle />
            </div>
        </header>
    )
}

export default LayoutHeader
