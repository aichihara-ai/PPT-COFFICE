import { Check } from "lucide-react"

import { cn } from "@/shared/lib/utils"

type LunchFlowStepsProps = {
    isActive: boolean
    hasLastWinner?: boolean
    winnerName?: string | null
    secondWinnerName?: string | null
}

function winnerStepLabel(
    winnerName?: string | null,
    secondWinnerName?: string | null
): string {
    if (!winnerName) return "Winner picked"
    if (secondWinnerName) return `${winnerName} & ${secondWinnerName}`
    return winnerName
}

export function LunchFlowSteps({
    isActive,
    hasLastWinner = false,
    winnerName,
    secondWinnerName,
}: LunchFlowStepsProps) {
    const isComplete = !isActive && hasLastWinner
    const stepTwoLabel = winnerStepLabel(winnerName, secondWinnerName)

    return (
        <ol className="flex items-center gap-2" aria-label="Lunch round progress">
            <li
                className={cn(
                    "flex flex-1 items-center gap-2 rounded-md border px-3 py-2",
                    isActive && "border-primary bg-primary/5",
                    isComplete && "border-border bg-muted/40",
                    !isActive && !isComplete && "border-dashed border-border/80"
                )}
            >
                <span
                    className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        isActive && "bg-primary text-primary-foreground",
                        isComplete && "bg-primary text-primary-foreground",
                        !isActive && !isComplete && "bg-muted text-muted-foreground"
                    )}
                >
                    {isComplete ? <Check className="size-3" /> : "1"}
                </span>
                <span className="text-sm font-medium">Pick 3 spots</span>
            </li>
            <div
                className={cn("h-px w-4 shrink-0", isComplete ? "bg-primary/40" : "bg-border")}
                aria-hidden
            />
            <li
                className={cn(
                    "flex flex-1 items-center gap-2 rounded-md border px-3 py-2",
                    isComplete && "border-primary bg-primary/5",
                    !isComplete && "border-dashed border-border/80 bg-transparent"
                )}
            >
                <span
                    className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                        isComplete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                >
                    {isComplete ? <Check className="size-3" /> : "2"}
                </span>
                <span className="text-sm font-medium">{stepTwoLabel}</span>
            </li>
        </ol>
    )
}
