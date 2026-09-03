import type { ReactElement, ReactNode } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Separator,
} from "@ppt/luminis"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface BlockFrameProps {
    title?: string
    description?: string
    Icon?: LucideIcon
    buttonElement?: ReactElement
    children: ReactNode
    className?: string
}

export function BlockFrame({
    title,
    description,
    Icon,
    buttonElement,
    children,
    className,
}: BlockFrameProps) {
    const hasHeader = Boolean(title)

    return (
        <Card className={cn("gap-0 py-0 shadow-none", className)}>
            {hasHeader ? (
                <>
                    <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 px-4 py-4">
                        <div className="flex items-start gap-2">
                            {Icon ? (
                                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            ) : null}
                            <div className="space-y-1">
                                <CardTitle className="text-base font-medium">
                                    {title}
                                </CardTitle>
                                {description ? (
                                    <CardDescription>{description}</CardDescription>
                                ) : null}
                            </div>
                        </div>
                        {buttonElement}
                    </CardHeader>
                    <Separator />
                </>
            ) : null}
            <CardContent className={cn("px-4 py-4", hasHeader ? "pt-4" : "")}>
                {children}
            </CardContent>
        </Card>
    )
}
