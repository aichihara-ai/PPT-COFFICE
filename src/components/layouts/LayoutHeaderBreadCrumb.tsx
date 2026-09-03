import { routes } from "@/configs/route"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@ppt/luminis"
import { Link, useLocation } from "react-router-dom"

function useBreadcrumbs(): { label: string; href?: string }[] {
    const pathname = useLocation().pathname
    const topRoute = Object.values(routes).find((r) => r.path === pathname)
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
                                        <Link to={crumb.href!}>{crumb.label}</Link>
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
