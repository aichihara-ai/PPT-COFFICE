import { RESTAURANT_TITLE_MAX_LENGTH } from "@/entities/restaurant"
import { isValidUberEatsUrl, normalizeUberEatsUrl } from "@/shared/lib/uber-eats-links"
import { cn } from "@/shared/lib/utils"
import { Button, Input } from "@ppt/luminis"

type AddRestaurantLinkFormProps = {
    value: string
    onChange: (value: string) => void
    title: string
    onTitleChange: (value: string) => void
    onSubmit: () => void
    isPending?: boolean
    inputId?: string
    compact?: boolean
}

export function AddRestaurantLinkForm({
    value,
    onChange,
    title,
    onTitleChange,
    onSubmit,
    isPending = false,
    inputId = "lunch-uber-eats-link",
    compact = false,
}: AddRestaurantLinkFormProps) {
    const normalized = normalizeUberEatsUrl(value)
    const isValid = isValidUberEatsUrl(value)
    const titleId = `${inputId}-title`
    const inputClass = compact ? "h-8 min-w-0 text-sm" : "min-w-0"

    return (
        <div className="space-y-2">
            <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center")}>
                <Input
                    id={titleId}
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Title"
                    maxLength={RESTAURANT_TITLE_MAX_LENGTH}
                    className={cn(inputClass, "sm:w-40 sm:shrink-0")}
                />
                <Input
                    id={inputId}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://www.ubereats.com/ca/store/..."
                    className={cn(inputClass, "min-w-0 flex-1")}
                />
                <Button
                    size="sm"
                    className="w-full shrink-0 sm:w-auto"
                    onClick={onSubmit}
                    disabled={!isValid || isPending}
                >
                    Add to pool
                </Button>
            </div>
            {value.trim() && !isValid ? (
                <p className="text-xs text-destructive">Paste a valid ubereats.com store link.</p>
            ) : normalized ? (
                <p className="text-xs text-muted-foreground truncate">
                    Will add: {normalized}
                </p>
            ) : (
                <p className="text-xs text-muted-foreground">
                    Title shows in the pool. Leave blank to use the store name from the link.
                </p>
            )}
        </div>
    )
}
