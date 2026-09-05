"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { routeMeta } from "@/shared/config"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@ppt/luminis"

function useBreadcrumbs(): { label: string; href?: string }[] {
    const pathname = usePathname()
    const topRoute = Object.values(routeMeta).find((r) => r.path === pathname)
    if (topRoute) return [{ label: topRoute.label }]
    return [{ label: "Office Hub" }]
}

export function LayoutHeaderBreadCrumb() {
    const crumbs = useBreadcrumbs()

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {crumbs.map((crumb, i) => {
                    const isLast = i === crumbs.length - 1
                    return (
                        <BreadcrumbItem key={crumb.label}>
                            {isLast ? (
                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                            ) : (
                                <>
                                    <BreadcrumbLink asChild>
                                        <Link href={crumb.href!}>{crumb.label}</Link>
                                    </BreadcrumbLink>
                                    <BreadcrumbSeparator />
                                </>
                            )}
                        </BreadcrumbItem>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
