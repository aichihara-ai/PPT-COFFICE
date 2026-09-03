import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PageShellProps = {
    title: string
    description?: string
    actions?: ReactNode
    children: ReactNode
    className?: string
}

export function PageShell({
    title,
    description,
    actions,
    children,
    className,
}: PageShellProps) {
    return (
        <div
            className={cn(
                "mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6",
                className
            )}
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {description ? (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    ) : null}
                </div>
                {actions ? (
                    <div className="flex flex-wrap items-end gap-3">{actions}</div>
                ) : null}
            </div>
            <div className="flex flex-col gap-6">{children}</div>
        </div>
    )
}
