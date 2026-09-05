import { ExternalLink, Trophy } from "lucide-react"

import { Button } from "@ppt/luminis"

type LunchWinnersProps = {
    winnerName: string
    secondWinnerName?: string | null
    groupOrderUrl?: string | null
    compact?: boolean
    hidePendingMessage?: boolean
}

export function LunchWinners({
    winnerName,
    secondWinnerName,
    groupOrderUrl,
    compact = false,
    hidePendingMessage = false,
}: LunchWinnersProps) {
    const hasDualWinners = Boolean(secondWinnerName)

    return (
        <div
            className={
                compact
                    ? "rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"
                    : "rounded-xl border border-primary/30 bg-primary/5 px-4 py-4"
            }
        >
            <div className="flex items-start gap-3">
                <span
                    className={
                        compact
                            ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                            : "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary"
                    }
                >
                    <Trophy className={compact ? "size-4" : "size-5"} />
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                    <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {hasDualWinners ? "Winners" : "Winner"}
                        </p>
                        <p
                            className={
                                compact
                                    ? "font-semibold leading-snug"
                                    : "text-lg font-semibold leading-snug"
                            }
                        >
                            {winnerName}
                            {secondWinnerName ? (
                                <>
                                    <span className="text-muted-foreground"> & </span>
                                    {secondWinnerName}
                                </>
                            ) : null}
                        </p>
                        {hasDualWinners ? (
                            <p className="text-xs text-muted-foreground">
                                Close split — order lunch from both spots.
                            </p>
                        ) : null}
                    </div>
                    {groupOrderUrl ? (
                        <Button
                            size="sm"
                            className="h-8 gap-1.5 bg-warning text-warning-foreground hover:bg-warning/90"
                            asChild
                        >
                            <a href={groupOrderUrl} target="_blank" rel="noopener noreferrer">
                                Join group order
                                <ExternalLink className="size-3.5" />
                            </a>
                        </Button>
                    ) : hidePendingMessage ? null : (
                        <p className="text-xs text-muted-foreground">
                            Group order link coming soon from HR.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
