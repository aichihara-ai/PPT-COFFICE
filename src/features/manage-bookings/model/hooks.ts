import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { RoomBooking, RoomStatus } from "@/entities/booking"
import { apiFetch } from "@/shared/api"

const bookingsKey = (date: string) => ["bookings", date] as const

export function useBookings(date: string) {
    return useQuery({
        queryKey: bookingsKey(date),
        queryFn: () =>
            apiFetch<{
                bookings: RoomBooking[]
                roomStatus: RoomStatus[]
                date: string
            }>(`/api/bookings?date=${date}`),
    })
}

export function useCreateBooking(_date: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body: {
            room: string
            bookingDate: string
            startTime: string
            endTime: string
            title: string
        }) =>
            apiFetch("/api/bookings", {
                method: "POST",
                body: JSON.stringify(body),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
        },
    })
}

export function useDeleteBooking(_date: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) =>
            apiFetch(`/api/bookings?id=${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] })
        },
    })
}
