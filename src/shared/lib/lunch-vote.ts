/** Hard cap: each person may select at most this many lunch options per round. */
export const MAX_LUNCH_VOTES = 3

export function remainingLunchVotes(selectedCount: number) {
    return Math.max(0, MAX_LUNCH_VOTES - selectedCount)
}

/**
 * Exactly one lunch winner.
 *
 * Tie-break (deterministic):
 * 1. Highest vote count
 * 2. Earliest first vote for that restaurant in the round (`MIN(created_at)`)
 * 3. Lower restaurant id
 */
export function pickLunchWinner(
    votes: Array<{ restaurant_id: number; created_at?: string }>
): number | null {
    if (votes.length === 0) return null

    const byRestaurant = new Map<number, { count: number; first: string }>()
    for (const vote of votes) {
        const first = vote.created_at ?? ""
        const current = byRestaurant.get(vote.restaurant_id)
        if (!current) {
            byRestaurant.set(vote.restaurant_id, {
                count: 1,
                first,
            })
            continue
        }
        current.count += 1
        if (first && (current.first === "" || first < current.first)) {
            current.first = first
        }
    }

    const ranked = [...byRestaurant.entries()].sort((a, b) => {
        if (b[1].count !== a[1].count) return b[1].count - a[1].count
        if (a[1].first !== b[1].first) return a[1].first.localeCompare(b[1].first)
        return a[0] - b[0]
    })

    return ranked[0]?.[0] ?? null
}
