"use client"

import { useAuth } from "@/features/auth"
import { Button } from "@ppt/luminis"

export function DemoRoleSwitch() {
    const { user, setAdminMode } = useAuth()

    return (
        <div className="flex w-full items-center rounded-md border p-0.5">
            <Button
                type="button"
                size="sm"
                variant={user?.isAdmin ? "ghost" : "secondary"}
                className="h-8 flex-1 px-2.5 text-xs"
                onClick={() => setAdminMode(false)}
            >
                Team
            </Button>
            <Button
                type="button"
                size="sm"
                variant={user?.isAdmin ? "secondary" : "ghost"}
                className="h-8 flex-1 px-2.5 text-xs"
                onClick={() => setAdminMode(true)}
            >
                HR Admin
            </Button>
        </div>
    )
}
