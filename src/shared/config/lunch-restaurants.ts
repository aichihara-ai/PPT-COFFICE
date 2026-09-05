export type LunchRestaurantSeed = {
    name: string
    notes: string
}

/** Sample Vancouver office lunch pool (10 spots). */
export const LUNCH_RESTAURANT_SEEDS: LunchRestaurantSeed[] = [
    { name: "Japadog", notes: "Classic Vancouver street food" },
    { name: "Mezze", notes: "Mediterranean bowls and wraps" },
    { name: "Nuba", notes: "Lebanese" },
    { name: "Honest Greens", notes: "Salads and warm bowls" },
    { name: "Chipotle", notes: "Quick Mexican" },
    { name: "Poké Man", notes: "Poke bowls" },
    { name: "Banana Leaf", notes: "Malaysian" },
    { name: "Nando's", notes: "Peri-peri chicken" },
    { name: "Tractor Foods", notes: "Healthy bowls" },
    { name: "Freshii", notes: "Light meals and smoothies" },
]
