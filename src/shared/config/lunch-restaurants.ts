import { extractUberEatsMenuDemo } from "@/shared/lib/uber-eats-menu"

export type LunchRestaurantSeed = {
    name: string
    notes: string
    uberEatsUrl: string
}

/** Vancouver office lunch pool (15 spots with Uber Eats links). */
export const LUNCH_RESTAURANT_SEEDS: LunchRestaurantSeed[] = [
    {
        name: "Japadog",
        notes: "Classic Vancouver street food",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/japadog-robson-st/yfgO-fkkQl20VBJgclbA9A",
    },
    {
        name: "Mezze",
        notes: "Mediterranean bowls and wraps",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/mazahr-lebanese-kitchen/lfLZKb6zSWaRiIsrfQlgcA",
    },
    {
        name: "Nuba",
        notes: "Lebanese",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/nuba-in-yaletown/Le9NW_t2SM2UH1Uvz0gzbQ",
    },
    {
        name: "Earls",
        notes: "Casual dining",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/earls-kitchen-+-bar-yaletown/DIRMCZsvX9eCE1BslH_Kbw",
    },
    {
        name: "Cactus Club",
        notes: "West Coast kitchen",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/cactus-club-cafe-west-broadway/ExRp_ZRBVsagkpJTO4GP-w",
    },
    {
        name: "Honest Greens",
        notes: "Salads and warm bowls",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/tractor-foods-marine-building/JEBPOWN4Rz-SFkkn-Jj4tg",
    },
    {
        name: "Tractor Foods",
        notes: "Healthy bowls",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/tractor-foods-marine-building/JEBPOWN4Rz-SFkkn-Jj4tg",
    },
    {
        name: "Chipotle",
        notes: "Quick Mexican",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/chipotle-mexican-grill-818-howe-st/hB07Xm23Ryi4n7PX_aowqg",
    },
    {
        name: "Poké Man",
        notes: "Poke bowls",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/the-poke-guy/bEESrxaVRweGVfoBBgpAqA",
    },
    {
        name: "Banana Leaf",
        notes: "Malaysian",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/lost-banana-leaf-robson/5KE5OtmzREyTv77pJA-yKg",
    },
    {
        name: "Peaceful Restaurant",
        notes: "Northern Chinese",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/peaceful-restaurant-kitsilano/3VW7HEUwU3mR_GJylx5npg",
    },
    {
        name: "Jamjar",
        notes: "Lebanese folk food",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/jamjar-canteen/qsmBQsOOT7KcOtQWSWZGMA",
    },
    {
        name: "Nando's",
        notes: "Peri-peri chicken",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/nandos-davie-%26-howe/6nPYvQjbRsmFCgq5ODZboQ",
    },
    {
        name: "Freshii",
        notes: "Light meals and smoothies",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/freshii-1291-howe-st/-_YvgBeYTreBRPmBBSQcIg",
    },
    {
        name: "Burgers + Fries",
        notes: "Classic burgers",
        uberEatsUrl:
            "https://www.ubereats.com/ca/store/five-guys-635-robson-st-ca/VWwKWYQQXIyn8vAfFj7zfg",
    },
]

export function buildLunchPoolRestaurants(startId = 1) {
    return LUNCH_RESTAURANT_SEEDS.map((seed, index) => ({
        id: startId + index,
        name: seed.name,
        notes: seed.notes,
        active: true,
        uber_eats_url: seed.uberEatsUrl,
        menu_preview: extractUberEatsMenuDemo(seed.uberEatsUrl),
    }))
}
