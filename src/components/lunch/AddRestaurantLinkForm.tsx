import { isValidUberEatsUrl, normalizeUberEatsUrl } from "@/lib/uberEatsLinks"
import { Button, Input, Label } from "@ppt/luminis"

type AddRestaurantLinkFormProps = {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    isPending?: boolean
    inputId?: string
}

export function AddRestaurantLinkForm({
    value,
    onChange,
    onSubmit,
    isPending = false,
    inputId = "lunch-uber-eats-link",
}: AddRestaurantLinkFormProps) {
    const normalized = normalizeUberEatsUrl(value)
    const isValid = isValidUberEatsUrl(value)

    return (
        <div className="space-y-2">
            <Label htmlFor={inputId}>Add Uber Eats link to pool</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                    id={inputId}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://www.ubereats.com/ca/store/..."
                    className="min-w-0"
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
                    Everyone adds Uber Eats store links — we pull the name and menu preview.
                </p>
            )}
        </div>
    )
}
