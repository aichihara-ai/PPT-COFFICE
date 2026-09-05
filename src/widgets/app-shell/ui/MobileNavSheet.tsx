"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { routeMeta } from "@/shared/config"
import { cn } from "@/shared/lib/cn"
import {
    Button,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@ppt/luminis"

export function MobileNavSheet() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open navigation"
                >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="left"
                className="w-80 max-w-[85vw] [&>button]:top-4 [&>button]:right-4 [&>button]:p-2"
            >
                <SheetHeader className="pr-12">
                    <SheetTitle>Office Hub</SheetTitle>
                    <SheetDescription>Go to a page</SheetDescription>
                </SheetHeader>
                <nav aria-label="Office pages" className="flex flex-col gap-1 px-4 pb-4">
                    {Object.values(routeMeta).map((route) => {
                        const Icon = route.icon
                        const isActive = pathname === route.path
                        return (
                            <Link
                                key={route.path}
                                href={route.path}
                                onClick={() => setOpen(false)}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground",
                                    isActive ? "font-bold" : "font-normal"
                                )}
                            >
                                <Icon className="size-4 shrink-0" aria-hidden />
                                {route.label}
                            </Link>
                        )
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
