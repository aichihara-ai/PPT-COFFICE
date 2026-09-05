import { useEffect, useState } from "react"

import { isValidGroupOrderUrl, normalizeGroupOrderUrl } from "@/shared/lib/group-order-links"
import { Button, Input, Label } from "@ppt/luminis"

type LunchGroupOrderFormProps = {
    currentUrl?: string | null
    onSubmit: (url: string) => void
    isPending?: boolean
    inputId?: string
}

export function LunchGroupOrderForm({
    currentUrl,
    onSubmit,
    isPending = false,
    inputId = "lunch-group-order-link",
}: LunchGroupOrderFormProps) {
    const [value, setValue] = useState(currentUrl ?? "")

    useEffect(() => {
        setValue(currentUrl ?? "")
    }, [currentUrl])

    const normalized = normalizeGroupOrderUrl(value)
    const isValid = isValidGroupOrderUrl(value)

    return (
        <div className="space-y-2 rounded-lg border border-dashed border-border/80 bg-muted/20 p-3">
            <Label htmlFor={inputId}>Group order link (HR)</Label>
            <p className="text-xs text-muted-foreground">
                Paste the Uber Eats or DoorDash group cart link — everyone sees it with the
                winners.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                    id={inputId}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="https://..."
                    className="min-w-0"
                />
                <Button
                    size="sm"
                    className="shrink-0"
                    disabled={!isValid || isPending}
                    onClick={() => onSubmit(normalized)}
                >
                    {currentUrl ? "Update link" : "Save link"}
                </Button>
            </div>
            {value.trim() && !isValid ? (
                <p className="text-xs text-destructive">Paste a valid http(s) link.</p>
            ) : null}
        </div>
    )
}
