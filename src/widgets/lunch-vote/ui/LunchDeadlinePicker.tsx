import {
    buildTimeOptions,
    combineDeadlineParts,
    formatTimeLabel,
    splitDeadlineParts,
} from "@/shared/lib/lunch-round"
import {
    DatePicker,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@ppt/luminis"

const TIME_OPTIONS = buildTimeOptions(15)

function nearestTimeOption(time: string): string {
    if (TIME_OPTIONS.includes(time)) return time
    const [hours, minutes] = time.split(":").map(Number)
    const totalMinutes = hours * 60 + minutes
    let nearest = TIME_OPTIONS[0]
    let smallestDiff = Number.POSITIVE_INFINITY
    for (const option of TIME_OPTIONS) {
        const [optionHours, optionMinutes] = option.split(":").map(Number)
        const diff = Math.abs(optionHours * 60 + optionMinutes - totalMinutes)
        if (diff < smallestDiff) {
            smallestDiff = diff
            nearest = option
        }
    }
    return nearest
}

type LunchDeadlinePickerProps = {
    value: Date
    onChange: (deadline: Date) => void
    idPrefix?: string
}

export function LunchDeadlinePicker({
    value,
    onChange,
    idPrefix = "lunch-deadline",
}: LunchDeadlinePickerProps) {
    const { date, time } = splitDeadlineParts(value)
    const timeValue = nearestTimeOption(time)

    return (
        <div className="flex flex-wrap items-end gap-3">
            <DatePicker
                label="Deadline date"
                showLabel
                value={date}
                onValueChange={(nextDate) => {
                    if (nextDate) {
                        onChange(combineDeadlineParts(nextDate, timeValue))
                    }
                }}
                footerConfig={{ show: false }}
                showPresets={false}
                size="sm"
                className="w-[240px]"
                placeholder="Pick a date"
            />
            <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-time`}>Time</Label>
                <Select
                    value={timeValue}
                    onValueChange={(nextTime) => onChange(combineDeadlineParts(date, nextTime))}
                >
                    <SelectTrigger id={`${idPrefix}-time`} className="w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {TIME_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                                {formatTimeLabel(option)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
