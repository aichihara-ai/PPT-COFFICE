export const LUNCH_PICK_LIMIT = 3

export const DEFAULT_LUNCH_DEADLINE_MINUTES = 30

export const LUNCH_DEADLINE_OPTIONS = [15, 30, 45, 60, 90, 120] as const

/** @deprecated use DEFAULT_LUNCH_DEADLINE_MINUTES */
export const LUNCH_ROUND_MINUTES = DEFAULT_LUNCH_DEADLINE_MINUTES

export function isValidDeadlineMinutes(minutes: number): boolean {
    return Number.isFinite(minutes) && minutes >= 5 && minutes <= 480
}

export function formatDeadlineOption(minutes: number): string {
    if (minutes < 60) return `${minutes} minutes`
    if (minutes === 60) return "1 hour"
    if (minutes % 60 === 0) return `${minutes / 60} hours`
    return `${minutes} minutes`
}

export function toDatetimeLocalValue(date: Date): string {
    const pad = (value: number) => String(value).padStart(2, "0")
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function defaultDeadlineInput(from = new Date()): string {
    return toDatetimeLocalValue(
        new Date(from.getTime() + DEFAULT_LUNCH_DEADLINE_MINUTES * 60 * 1000)
    )
}

export function parseDeadlineDatetime(value: string): Date | null {
    const parsed = new Date(value)
    return isValidDeadlineDate(parsed) ? parsed : null
}

export function isValidDeadlineDate(date: Date): boolean {
    if (Number.isNaN(date.getTime())) return false
    if (date.getTime() <= Date.now()) return false
    const maxAheadMs = 24 * 60 * 60 * 1000
    if (date.getTime() > Date.now() + maxAheadMs) return false
    return true
}

export function defaultDeadlineDate(from = new Date()): Date {
    const raw = new Date(from.getTime() + DEFAULT_LUNCH_DEADLINE_MINUTES * 60 * 1000)
    const intervalMs = 15 * 60 * 1000
    return new Date(Math.ceil(raw.getTime() / intervalMs) * intervalMs)
}

export function splitDeadlineParts(deadline: Date): { date: Date; time: string } {
    const pad = (value: number) => String(value).padStart(2, "0")
    return {
        date: new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate()),
        time: `${pad(deadline.getHours())}:${pad(deadline.getMinutes())}`,
    }
}

export function combineDeadlineParts(date: Date, time: string): Date {
    const [hours, minutes] = time.split(":").map(Number)
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        hours,
        minutes,
        0,
        0
    )
}

export function buildTimeOptions(intervalMinutes = 15): string[] {
    const options: string[] = []
    for (let minutes = 0; minutes < 24 * 60; minutes += intervalMinutes) {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        options.push(
            `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
        )
    }
    return options
}

export function formatTimeLabel(time: string): string {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const hour12 = hours % 12 || 12
    return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`
}

export type PickCount = {
    restaurant_id: number
    count: number
}

/** Most picks wins; if top two each land in the 40–60% band, order from both. */
export function resolveLunchWinners(counts: PickCount[]): number[] {
    if (counts.length === 0) return []

    const total = counts.reduce((sum, row) => sum + row.count, 0)
    if (total === 0) return []

    const sorted = [...counts].sort((a, b) => b.count - a.count)
    const top = sorted[0]
    const second = sorted[1]

    const topShare = top.count / total
    const secondShare = second ? second.count / total : 0

    if (topShare >= 0.6 || !second) {
        return [top.restaurant_id]
    }

    if (
        topShare >= 0.4 &&
        topShare <= 0.6 &&
        secondShare >= 0.4 &&
        secondShare <= 0.6
    ) {
        return [top.restaurant_id, second.restaurant_id]
    }

    return [top.restaurant_id]
}

export function formatWinnerNames(names: string[]): string {
    if (names.length === 0) return ""
    if (names.length === 1) return names[0]
    return `${names[0]} & ${names[1]}`
}

export function formatWinnerToast(
    winnerName?: string | null,
    secondWinnerName?: string | null
): string {
    const names = [winnerName, secondWinnerName].filter(
        (name): name is string => Boolean(name)
    )
    if (names.length === 0) return "Round closed"
    if (names.length === 1) return `Winner: ${names[0]}`
    return `Winners: ${formatWinnerNames(names)}`
}

function stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Last Thursday of the given month (month is 0-indexed). */
export function getLastThursdayOfMonth(year: number, month: number): Date {
    const lastDay = new Date(year, month + 1, 0)
    const dayOfWeek = lastDay.getDay()
    const daysBack = (dayOfWeek + 7 - 4) % 7
    return new Date(year, month, lastDay.getDate() - daysBack)
}

export function getNextOfficeLunchDate(from = new Date()): Date {
    const today = stripTime(from)
    const thisMonth = getLastThursdayOfMonth(today.getFullYear(), today.getMonth())
    if (thisMonth.getTime() >= today.getTime()) {
        return thisMonth
    }
    const nextMonth = today.getMonth() + 1
    if (nextMonth > 11) {
        return getLastThursdayOfMonth(today.getFullYear() + 1, 0)
    }
    return getLastThursdayOfMonth(today.getFullYear(), nextMonth)
}

export function isOfficeLunchDay(from = new Date()): boolean {
    const today = stripTime(from)
    const lastThu = getLastThursdayOfMonth(today.getFullYear(), today.getMonth())
    return lastThu.getTime() === today.getTime()
}

export function formatNextOfficeLunchLabel(from = new Date()): string {
    if (isOfficeLunchDay(from)) {
        return "Office lunch today — last Thursday of the month"
    }
    const next = getNextOfficeLunchDate(from)
    const formatted = next.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
    })
    return `Next office lunch: ${formatted}`
}
