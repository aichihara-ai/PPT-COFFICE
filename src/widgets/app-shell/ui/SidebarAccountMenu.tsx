"use client"

import { LogOut, Moon, Sun } from "lucide-react"

import { useDarkMode } from "@/widgets/app-shell/ui/use-dark-mode"
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@ppt/luminis"

type SidebarAccountMenuProps = {
    onSignOut: () => void | Promise<void>
}

export function SidebarAccountMenu({ onSignOut }: SidebarAccountMenuProps) {
    const { isDark, toggle } = useDarkMode()

    return (
        <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem
                    onSelect={(event) => {
                        event.preventDefault()
                        toggle()
                    }}
                >
                    {isDark ? <Sun /> : <Moon />}
                    {isDark ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem
                    onSelect={() => {
                        void onSignOut()
                    }}
                >
                    <LogOut />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </>
    )
}
