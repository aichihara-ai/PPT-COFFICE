import type { ReactNode } from "react"

import { cn } from "@/shared/lib/cn"
import { Card, CardContent } from "@ppt/luminis"

type DashboardStatCardProps = {
    icon: ReactNode
    label: string
    value: string
    detail?: string
    tone?: "default" | "success" | "warning" | "active"
}

const TONE_CLASS: Record<NonNullable<DashboardStatCardProps["tone"]>, string> = {
    default: "bg-muted text-foreground",
    success: "bg-secondary text-foreground",
    warning: "bg-destructive/10 text-destructive",
    active: "bg-primary/10 text-primary",
}

export function DashboardStatCard({
    icon,
    label,
    value,
    detail,
    tone = "default",
}: DashboardStatCardProps) {
    return (
        <Card className="overflow-hidden py-0 shadow-none">
            <CardContent className="flex items-start gap-2 p-2">
                <div
                    className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-md text-base",
                        TONE_CLASS[tone]
                    )}
                    aria-hidden
                >
                    {icon}
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        {label}
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">{value}</p>
                    {detail ? (
                        <p className="truncate text-xs text-muted-foreground">{detail}</p>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    )
}
