export type LunchRoundStatus = "nominating" | "voting" | "closed"

export type LunchPanelData = {
    round: LunchRound | null
    lastClosed: {
        id?: number
        status?: LunchRoundStatus
        closed_at?: string | null
        winner_restaurant_id?: number | null
        winner_name?: string | null
    } | null
    nominations?: Array<{
        user_id: number
        restaurant_id: number
        created_at?: string
        user_name?: string
        restaurant_name?: string
    }>
    nominationCounts: Array<{
        restaurant_id: number
        restaurant_name: string
        count: number
        first_nominated_at?: string
    }>
    candidates: Array<{
        restaurant_id: number
        restaurant_name: string
        nomination_count: number
    }>
    votes: Array<{
        user_id: number
        restaurant_id: number
        user_name?: string
        restaurant_name?: string
    }>
    voteCounts: Array<{
        restaurant_id: number
        restaurant_name: string
        count: number
    }>
    users: Array<{ id: number; name: string }>
    myNomination: { restaurant_id: number } | null
    myVote: { restaurant_id: number } | null
}

export type LunchRound = {
    id: number
    status: LunchRoundStatus
    created_at: string
    created_by: number
    created_by_name: string
    winner_restaurant_id: number | null
    closed_at: string | null
    voting_ends_at: string | null
}
