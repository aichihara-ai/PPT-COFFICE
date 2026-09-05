import { RESTAURANT_TITLE_MAX_LENGTH } from "@/entities/restaurant"
import { isValidUberEatsUrl, normalizeUberEatsUrl } from "@/shared/lib/uber-eats-links"
import { Button, Input, Label } from "@ppt/luminis"

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

    return (
        <div className="space-y-2">
            <Label htmlFor={titleId}>Title (optional)</Label>
            <Input
                id={titleId}
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="e.g. Guu Garden"
                maxLength={RESTAURANT_TITLE_MAX_LENGTH}
                className={compact ? "h-8 text-sm" : undefined}
            />
            <Label htmlFor={inputId}>Uber Eats link</Label>
            <div className={compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row"}>
                <Input
                    id={inputId}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://www.ubereats.com/ca/store/..."
                    className={compact ? "h-8 min-w-0 text-sm" : "min-w-0"}
                />
                <Button
                    size="sm"
                    className="shrink-0"
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
                    Title is shown in the pool. If you skip it, we use the store name from the link.
                </p>
            )}
        </div>
    )
}
