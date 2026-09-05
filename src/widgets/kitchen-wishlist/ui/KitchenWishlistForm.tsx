import { SUGGESTION_TITLE_MAX_LENGTH } from "@/entities/suggestion"
import { isValidKitchenUrl } from "@/shared/lib/kitchen-links"
import { Button, Input, Label } from "@ppt/luminis"

type KitchenWishlistFormProps = {
    value: string
    onChange: (value: string) => void
    title: string
    onTitleChange: (value: string) => void
    onSubmit: () => void
    isPending?: boolean
    inputId?: string
    compact?: boolean
}

export function KitchenWishlistForm({
    value,
    onChange,
    title,
    onTitleChange,
    onSubmit,
    isPending = false,
    inputId = "kitchen-link",
    compact = false,
}: KitchenWishlistFormProps) {
    const isValid = isValidKitchenUrl(value)
    const titleId = `${inputId}-title`

    return (
        <div className="space-y-2">
            <div className="space-y-2">
                <Label htmlFor={titleId}>Title (optional)</Label>
                <Input
                    id={titleId}
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="e.g. Trail mix"
                    maxLength={SUGGESTION_TITLE_MAX_LENGTH}
                    className={compact ? "h-8 text-sm" : undefined}
                />
                <Label htmlFor={inputId}>Product link</Label>
                <div className={compact ? "flex gap-2" : "flex flex-col gap-2 sm:flex-row"}>
                    <Input
                        id={inputId}
                        type="url"
                        inputMode="url"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="https://..."
                        className={compact ? "h-8 text-sm" : undefined}
                    />
                    <Button
                        onClick={onSubmit}
                        disabled={!isValid || isPending}
                        size={compact ? "sm" : "default"}
                        className={compact ? undefined : "sm:w-auto"}
                    >
                        Add link
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Title is shown instead of the raw URL when you add one.
                </p>
                {value.trim() && !isValid ? (
                    <p className="text-xs text-destructive">Enter a valid http(s) link.</p>
                ) : null}
            </div>
        </div>
    )
}
