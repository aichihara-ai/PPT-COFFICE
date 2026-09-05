import type { ReactNode } from "react"

import { cn } from "@/shared/lib/cn"

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
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                <div className="min-w-0 space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {title}
                    </h1>
                    {description ? (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    ) : null}
                </div>
                {actions ? (
                    <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-end">
                        {actions}
                    </div>
                ) : null}
            </div>
            <div className="flex flex-col gap-6">{children}</div>
        </div>
    )
}
