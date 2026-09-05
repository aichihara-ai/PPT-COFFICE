import type { RoomBooking } from "../model/types"
import type { RoomId } from "../model/types"

export const SCHEDULE_DAY_START_MINUTES = 8 * 60
export const SCHEDULE_DAY_END_MINUTES = 18 * 60
export const SCHEDULE_DAY_SPAN_MINUTES =
    SCHEDULE_DAY_END_MINUTES - SCHEDULE_DAY_START_MINUTES

export function formatBookingTime(value: string) {
    return String(value).slice(0, 5)
}

export function parseTimeToMinutes(value: string) {
    const [hours, minutes] = formatBookingTime(value).split(":").map(Number)
    return hours * 60 + minutes
}

export function sortBookings(bookings: RoomBooking[]) {
    return [...bookings].sort(
        (a, b) =>
            parseTimeToMinutes(a.start_time) - parseTimeToMinutes(b.start_time) ||
            parseTimeToMinutes(a.end_time) - parseTimeToMinutes(b.end_time)
    )
}

export function bookingsForRoom(bookings: RoomBooking[], room: RoomId) {
    return sortBookings(bookings.filter((booking) => booking.room === room))
}

export function formatLocalDate(now: Date = new Date()) {
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

/** Shift a `YYYY-MM-DD` calendar date by whole local days (not UTC). */
export function shiftLocalDate(date: string, days: number) {
    const [year, month, day] = date.split("-").map(Number)
    return formatLocalDate(new Date(year, month - 1, day + days))
}

export function minutesToSchedulePercent(minutes: number) {
    return ((minutes - SCHEDULE_DAY_START_MINUTES) / SCHEDULE_DAY_SPAN_MINUTES) * 100
}

export function hourTickPercent(hour: number) {
    return minutesToSchedulePercent(hour * 60)
}

export function bookingBlockStyle(booking: RoomBooking) {
    const start = parseTimeToMinutes(booking.start_time)
    const end = parseTimeToMinutes(booking.end_time)
    const clampedStart = Math.max(start, SCHEDULE_DAY_START_MINUTES)
    const clampedEnd = Math.min(end, SCHEDULE_DAY_END_MINUTES)

    if (clampedEnd <= clampedStart) {
        return { left: "0%", width: "0%" }
    }

    const left = minutesToSchedulePercent(clampedStart)
    const width =
        ((clampedEnd - clampedStart) / SCHEDULE_DAY_SPAN_MINUTES) * 100

    return {
        left: `${left}%`,
        width: `${Math.max(width, 2)}%`,
    }
}

export function nowMarkerStyle(date: string, now: Date = new Date()) {
    if (date !== formatLocalDate(now)) return null

    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    if (
        nowMinutes < SCHEDULE_DAY_START_MINUTES ||
        nowMinutes > SCHEDULE_DAY_END_MINUTES
    ) {
        return null
    }

    return { left: `${minutesToSchedulePercent(nowMinutes)}%` }
}

export const SCHEDULE_HOUR_LABELS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

export const SCHEDULE_SLOT_MINUTES = 30

export const BOOKING_TIME_SLOTS = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00",
] as const

export function minutesToTimeString(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
}

export function snapMinutesToSlot(minutes: number) {
    const snapped =
        Math.round(minutes / SCHEDULE_SLOT_MINUTES) * SCHEDULE_SLOT_MINUTES
    return Math.min(
        SCHEDULE_DAY_END_MINUTES,
        Math.max(SCHEDULE_DAY_START_MINUTES, snapped)
    )
}

export function minutesFromPointerX(track: HTMLElement, clientX: number) {
    const rect = track.getBoundingClientRect()
    if (rect.width <= 0) return SCHEDULE_DAY_START_MINUTES

    const percent = ((clientX - rect.left) / rect.width) * 100
    const rawMinutes =
        SCHEDULE_DAY_START_MINUTES + (percent / 100) * SCHEDULE_DAY_SPAN_MINUTES

    return snapMinutesToSlot(rawMinutes)
}

export function selectionBlockStyle(startMinutes: number, endMinutes: number) {
    const start = Math.min(startMinutes, endMinutes)
    const end = Math.max(startMinutes, endMinutes)
    const clampedStart = Math.max(start, SCHEDULE_DAY_START_MINUTES)
    const clampedEnd = Math.min(end, SCHEDULE_DAY_END_MINUTES)

    if (clampedEnd <= clampedStart) {
        return {
            left: "0%",
            width: "0%",
            startMinutes: clampedStart,
            endMinutes: clampedEnd,
        }
    }

    const left = minutesToSchedulePercent(clampedStart)
    const width =
        ((clampedEnd - clampedStart) / SCHEDULE_DAY_SPAN_MINUTES) * 100

    return {
        left: `${left}%`,
        width: `${Math.max(width, 2)}%`,
        startMinutes: clampedStart,
        endMinutes: clampedEnd,
    }
}

export function rangeOverlapsBooking(
    startMinutes: number,
    endMinutes: number,
    bookings: RoomBooking[]
) {
    const start = Math.min(startMinutes, endMinutes)
    const end = Math.max(startMinutes, endMinutes)

    return bookings.some((booking) => {
        const bookingStart = parseTimeToMinutes(booking.start_time)
        const bookingEnd = parseTimeToMinutes(booking.end_time)
        return start < bookingEnd && end > bookingStart
    })
}

export function minuteOverlapsBooking(minute: number, bookings: RoomBooking[]) {
    return bookings.some((booking) => {
        const bookingStart = parseTimeToMinutes(booking.start_time)
        const bookingEnd = parseTimeToMinutes(booking.end_time)
        return minute >= bookingStart && minute < bookingEnd
    })
}

