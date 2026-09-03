import { isValidKitchenUrl } from "@/lib/kitchenLinks"
import { Button, Input, Label } from "@ppt/luminis"

type KitchenWishlistFormProps = {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    isPending?: boolean
    inputId?: string
    compact?: boolean
}

export function KitchenWishlistForm({
    value,
    onChange,
    onSubmit,
    isPending = false,
    inputId = "kitchen-link",
    compact = false,
}: KitchenWishlistFormProps) {
    const isValid = isValidKitchenUrl(value)

    return (
        <div className="space-y-2">
            <div className="space-y-2">
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
                <p className="text-xs text-muted-foreground">Paste a product link only.</p>
                {value.trim() && !isValid ? (
                    <p className="text-xs text-destructive">Enter a valid http(s) link.</p>
                ) : null}
            </div>
        </div>
    )
}
