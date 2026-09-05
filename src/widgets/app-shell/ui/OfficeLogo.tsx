import { cn } from "@/shared/lib/utils"

const OFFICE_LOGO_MASK = 'url("/office-logo.png")'

type OfficeLogoProps = {
    className?: string
    size?: number
    showWordmark?: boolean
}

/** Sidebar / hub thumbnail — PNG mask tinted via currentColor token. */
export function OfficeLogoIcon({ className }: { className?: string }) {
    return (
        <span
            aria-hidden
            className={cn("inline-block size-4 shrink-0 bg-current", className)}
            style={{
                mask: `${OFFICE_LOGO_MASK} center / contain no-repeat`,
                WebkitMask: `${OFFICE_LOGO_MASK} center / contain no-repeat`,
            }}
        />
    )
}

export function OfficeLogo({
    className,
    size = 28,
    showWordmark = false,
}: OfficeLogoProps) {
    return (
        <span className={cn("inline-flex items-center gap-2 text-primary", className)}>
            <span
                aria-hidden
                className="inline-block shrink-0 bg-current"
                style={{
                    width: size,
                    height: size,
                    mask: `${OFFICE_LOGO_MASK} center / contain no-repeat`,
                    WebkitMask: `${OFFICE_LOGO_MASK} center / contain no-repeat`,
                }}
            />
            {showWordmark ? (
                <span className="font-semibold tracking-tight text-foreground">
                    Office Hub
                </span>
            ) : null}
        </span>
    )
}
