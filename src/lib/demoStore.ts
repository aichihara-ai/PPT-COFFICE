import type { InventoryStatus, RoomId, SuggestionStatus } from "@/types"
import { normalizeKitchenUrl } from "@/lib/kitchenLinks"
import {
    extractUberEatsMenuDemo,
    type MenuPreview,
} from "@/lib/uberEatsMenu"
import { isValidUberEatsUrl, normalizeUberEatsUrl } from "@/lib/uberEatsLinks"

const STORAGE_KEY = "office-hub-demo"

type DemoUser = { id: number; name: string; isAdmin: boolean }

type Booking = {
    id: number
    room: RoomId
    booking_date: string
    start_time: string
    end_time: string
    title: string
    user_name: string
    user_id: number
}

type Suggestion = {
    id: number
    text: string
    status: SuggestionStatus
    created_at: string
    user_name: string
}

type Restaurant = {
    id: number
    name: string
    notes: string | null
    active: boolean
    uber_eats_url?: string | null
    menu_preview?: MenuPreview | null
}

type LunchRound = {
    id: number
    status: "nominating" | "voting" | "closed"
    created_by: number
    created_by_name: string
    winner_restaurant_id: number | null
    closed_at: string | null
    voting_ends_at: string | null
}

type DemoState = {
    nextId: number
    user: DemoUser
    bookings: Booking[]
    suggestions: Suggestion[]
    inventory: Record<"coffee" | "milk", { status: InventoryStatus; updated_at: string; updated_by_name: string }>
    restaurants: Restaurant[]
    lunchRound: LunchRound | null
    nominations: { round_id: number; user_id: number; restaurant_id: number; created_at: string }[]
    candidates: { round_id: number; restaurant_id: number; nomination_count: number }[]
    votes: { round_id: number; user_id: number; restaurant_id: number }[]
    lastClosedWinner: string | null
}

const SEED_RESTAURANTS = [
    "Japadog", "Mezze", "Nuba", "Earls", "Cactus Club", "Honest Greens",
    "Tractor Foods", "Chipotle", "Poké Man", "Banana Leaf", "Peaceful Restaurant",
    "Jamjar", "Nando's", "Freshii", "Burgers + Fries",
]

function defaultState(): DemoState {
    return {
        nextId: 100,
        user: { id: 1, name: "Team", isAdmin: false },
        bookings: [],
        suggestions: [],
        inventory: {
            coffee: { status: "ok", updated_at: new Date().toISOString(), updated_by_name: "Team" },
            milk: { status: "ok", updated_at: new Date().toISOString(), updated_by_name: "Team" },
        },
        restaurants: SEED_RESTAURANTS.map((name, i) => ({
            id: i + 1,
            name,
            notes: null,
            active: true,
            uber_eats_url: null,
            menu_preview: null,
        })),
        lunchRound: null,
        nominations: [],
        candidates: [],
        votes: [],
        lastClosedWinner: null,
    }
}

function load(): DemoState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return defaultState()
        const parsed = JSON.parse(raw) as DemoState
        for (const key of ["coffee", "milk"] as const) {
            const row = parsed.inventory?.[key] as
                | DemoState["inventory"]["coffee"]
                | { level: string; updated_at: string; updated_by_name: string }
                | undefined
            if (row && "level" in row && !("status" in row)) {
                parsed.inventory[key] = {
                    status: row.level === "low" || row.level === "empty" ? "low" : "ok",
                    updated_at: row.updated_at,
                    updated_by_name: row.updated_by_name,
                }
            }
        }
        return { ...defaultState(), ...parsed }
    } catch {
        return defaultState()
    }
}

function save(state: DemoState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function nextId(state: DemoState) {
    state.nextId += 1
    return state.nextId
}

function timesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
    return aStart < bEnd && bStart < aEnd
}

function roomStatus(state: DemoState, date: string) {
    const now = new Date()
    const today = now.toISOString().slice(0, 10)
    const currentTime = now.toTimeString().slice(0, 5)

    return (["room_a", "room_b"] as const).map((room) => {
        const roomBookings = state.bookings.filter(
            (b) => b.room === room && b.booking_date === date
        )
        const active = roomBookings.find(
            (b) =>
                b.booking_date === today &&
                b.start_time.slice(0, 5) <= currentTime &&
                b.end_time.slice(0, 5) > currentTime
        )

        if (active) {
            return {
                room,
                status: "busy" as const,
                until: active.end_time.slice(0, 5),
                title: active.title,
                bookedBy: active.user_name,
            }
        }

        const next = roomBookings.find(
            (b) => b.booking_date === today && b.start_time.slice(0, 5) > currentTime
        )

        return {
            room,
            status: "free" as const,
            nextStart: next ? next.start_time.slice(0, 5) : null,
            nextTitle: next?.title ?? null,
        }
    })
}

export function demoApiFetch<T>(path: string, options: RequestInit = {}): T {
    const state = load()
    const method = (options.method ?? "GET").toUpperCase()
    const url = new URL(path, "http://local")
    const body = options.body ? JSON.parse(options.body as string) : {}

    if (path.startsWith("/api/bookings")) {
        if (method === "GET") {
            const date = url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10)
            const bookings = state.bookings.filter((b) => b.booking_date === date)
            return { bookings, roomStatus: roomStatus(state, date), date } as T
        }
        if (method === "POST") {
            const conflicts = state.bookings.filter(
                (b) => b.room === body.room && b.booking_date === body.bookingDate
            )
            if (
                conflicts.some((b) =>
                    timesOverlap(body.startTime, body.endTime, b.start_time, b.end_time)
                )
            ) {
                throw new Error("Room is already booked for that time")
            }
            const booking: Booking = {
                id: nextId(state),
                room: body.room,
                booking_date: body.bookingDate,
                start_time: body.startTime,
                end_time: body.endTime,
                title: body.title ?? "Meeting",
                user_id: state.user.id,
                user_name: state.user.name,
            }
            state.bookings.push(booking)
            save(state)
            return { booking } as T
        }
        if (method === "DELETE") {
            const id = Number(url.searchParams.get("id"))
            state.bookings = state.bookings.filter((b) => b.id !== id)
            save(state)
            return { ok: true } as T
        }
    }

    if (path === "/api/suggestions") {
        if (method === "GET") {
            return { suggestions: [...state.suggestions].reverse() } as T
        }
        if (method === "POST") {
            const url = normalizeKitchenUrl(String(body.text ?? ""))
            if (!url) {
                throw new Error("Valid product link required (http or https)")
            }
            const suggestion: Suggestion = {
                id: nextId(state),
                text: url,
                status: "open",
                created_at: new Date().toISOString(),
                user_name: state.user.name,
            }
            state.suggestions.push(suggestion)
            save(state)
            return { suggestion } as T
        }
        if (method === "PATCH") {
            const id = Number(url.searchParams.get("id"))
            const s = state.suggestions.find((x) => x.id === id)
            if (s) s.status = body.status
            save(state)
            return { suggestion: s } as T
        }
    }

    if (path === "/api/inventory") {
        if (method === "GET") {
            return {
                inventory: (["coffee", "milk"] as const).map((item) => ({
                    item,
                    status: state.inventory[item].status,
                    updated_at: state.inventory[item].updated_at,
                    updated_by_name: state.inventory[item].updated_by_name,
                })),
            } as T
        }
        if (method === "PATCH") {
            const itemKey = body.item as "coffee" | "milk"
            const status = body.status as InventoryStatus
            if (!itemKey || !status || !["ok", "low"].includes(status)) {
                throw new Error("Valid item and status required")
            }
            if (status === "ok" && !state.user.isAdmin) {
                throw new Error("Admin only")
            }
            state.inventory[itemKey] = {
                status,
                updated_at: new Date().toISOString(),
                updated_by_name: state.user.name,
            }
            save(state)
            return { item: state.inventory[itemKey] } as T
        }
    }

    if (path === "/api/restaurants") {
        if (method === "GET") {
            return { restaurants: state.restaurants.filter((r) => r.active) } as T
        }
        if (method === "POST") {
            const uberEatsUrl = normalizeUberEatsUrl(String(body.uberEatsUrl ?? ""))
            if (!isValidUberEatsUrl(uberEatsUrl)) {
                throw new Error("Valid Uber Eats link required (ubereats.com store URL)")
            }

            const duplicate = state.restaurants.find(
                (r) => r.uber_eats_url === uberEatsUrl || r.name === body.name
            )
            if (duplicate) {
                throw new Error("Restaurant or Uber Eats link already in pool")
            }

            const menuPreview = extractUberEatsMenuDemo(uberEatsUrl)
            const restaurant: Restaurant = {
                id: nextId(state),
                name: menuPreview.storeName,
                notes: null,
                active: true,
                uber_eats_url: uberEatsUrl,
                menu_preview: menuPreview,
            }
            state.restaurants.push(restaurant)
            save(state)
            return { restaurant } as T
        }
    }

    if (path === "/api/lunch") {
        if (method === "GET") {
            const round = state.lunchRound
            if (!round) {
                return {
                    round: null,
                    lastClosed: state.lastClosedWinner
                        ? { winner_name: state.lastClosedWinner }
                        : null,
                    nominationCounts: [],
                    candidates: [],
                    votes: [],
                    voteCounts: [],
                    users: [{ id: state.user.id, name: state.user.name }],
                    myNomination: null,
                    myVote: null,
                } as T
            }

            const noms = state.nominations.filter((n) => n.round_id === round.id)
            const counts = new Map<number, number>()
            for (const n of noms) {
                counts.set(n.restaurant_id, (counts.get(n.restaurant_id) ?? 0) + 1)
            }
            const nominationCounts = [...counts.entries()].map(([restaurant_id, count]) => ({
                restaurant_id,
                restaurant_name:
                    state.restaurants.find((r) => r.id === restaurant_id)?.name ?? "",
                count,
            }))

            const candidates = state.candidates
                .filter((c) => c.round_id === round.id)
                .map((c) => ({
                    restaurant_id: c.restaurant_id,
                    restaurant_name:
                        state.restaurants.find((r) => r.id === c.restaurant_id)?.name ?? "",
                    nomination_count: c.nomination_count,
                }))

            const roundVotes = state.votes.filter((v) => v.round_id === round.id)
            const voteCounts = candidates.map((c) => ({
                restaurant_id: c.restaurant_id,
                restaurant_name: c.restaurant_name,
                count: roundVotes.filter((v) => v.restaurant_id === c.restaurant_id).length,
            }))

            return {
                round,
                lastClosed: null,
                nominations: noms,
                nominationCounts,
                candidates,
                votes: roundVotes.map((v) => ({
                    user_id: v.user_id,
                    restaurant_id: v.restaurant_id,
                    restaurant_name:
                        state.restaurants.find((r) => r.id === v.restaurant_id)?.name ?? "",
                })),
                voteCounts,
                users: [{ id: state.user.id, name: state.user.name }],
                myNomination: noms.find((n) => n.user_id === state.user.id) ?? null,
                myVote: roundVotes.find((v) => v.user_id === state.user.id) ?? null,
            } as T
        }

        if (method === "POST") {
            if (body.action === "start") {
                if (!state.user.isAdmin) {
                    throw new Error("Only HR admin can start a lunch round")
                }
                state.lunchRound = {
                    id: nextId(state),
                    status: "nominating",
                    created_by: state.user.id,
                    created_by_name: state.user.name,
                    winner_restaurant_id: null,
                    closed_at: null,
                    voting_ends_at: null,
                }
                state.nominations = []
                state.candidates = []
                state.votes = []
                save(state)
                return { round: state.lunchRound } as T
            }

            const round = state.lunchRound
            if (!round) throw new Error("No active lunch round")

            if (body.action === "nominate") {
                state.nominations = state.nominations.filter(
                    (n) => !(n.round_id === round.id && n.user_id === state.user.id)
                )
                state.nominations.push({
                    round_id: round.id,
                    user_id: state.user.id,
                    restaurant_id: body.restaurantId,
                    created_at: new Date().toISOString(),
                })
                save(state)
                return { ok: true } as T
            }

            if (body.action === "lock") {
                const counts = new Map<number, number>()
                for (const n of state.nominations.filter((x) => x.round_id === round.id)) {
                    counts.set(n.restaurant_id, (counts.get(n.restaurant_id) ?? 0) + 1)
                }
                const top = [...counts.entries()]
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                state.candidates = top.map(([restaurant_id, nomination_count]) => ({
                    round_id: round.id,
                    restaurant_id,
                    nomination_count,
                }))
                round.status = "voting"
                round.voting_ends_at = new Date(Date.now() + 15 * 60 * 1000).toISOString()
                save(state)
                return { ok: true } as T
            }

            if (body.action === "vote") {
                state.votes = state.votes.filter(
                    (v) => !(v.round_id === round.id && v.user_id === state.user.id)
                )
                state.votes.push({
                    round_id: round.id,
                    user_id: state.user.id,
                    restaurant_id: body.restaurantId,
                })
                save(state)
                return { ok: true } as T
            }

            if (body.action === "close") {
                const roundVotes = state.votes.filter((v) => v.round_id === round.id)
                const tally = new Map<number, number>()
                for (const v of roundVotes) {
                    tally.set(v.restaurant_id, (tally.get(v.restaurant_id) ?? 0) + 1)
                }
                const winnerId =
                    [...tally.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
                state.lastClosedWinner =
                    state.restaurants.find((r) => r.id === winnerId)?.name ?? null
                round.status = "closed"
                round.closed_at = new Date().toISOString()
                state.lunchRound = null
                save(state)
                return { ok: true } as T
            }
        }
    }

    throw new Error(`Demo API: unhandled ${method} ${path}`)
}

export function getDemoUser() {
    return load().user
}

export function setDemoUserRole(isAdmin: boolean) {
    const state = load()
    state.user = {
        ...state.user,
        isAdmin,
        name: "Team",
    }
    save(state)
    return state.user
}
