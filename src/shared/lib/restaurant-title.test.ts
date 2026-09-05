import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
    LEGACY_SEEDED_RESTAURANT_NAMES,
    normalizeRestaurantTitle,
    resolveRestaurantName,
    restaurantDisplayTitle,
    withoutUnlinkedPoolRestaurants,
} from "./restaurant-title.ts"

describe("normalizeRestaurantTitle", () => {
    it("returns null for empty or whitespace titles", () => {
        assert.equal(normalizeRestaurantTitle(""), null)
        assert.equal(normalizeRestaurantTitle("   "), null)
        assert.equal(normalizeRestaurantTitle(null), null)
        assert.equal(normalizeRestaurantTitle(undefined), null)
    })

    it("trims and caps length", () => {
        assert.equal(normalizeRestaurantTitle("  Guu  "), "Guu")
        assert.equal(normalizeRestaurantTitle("x".repeat(90))?.length, 80)
    })
})

describe("resolveRestaurantName", () => {
    const url = "https://www.ubereats.com/ca/store/guu-thurlow/abc123"

    it("prefers a user title over the scraped store name", () => {
        assert.equal(
            resolveRestaurantName({
                title: "Guu Garden",
                scrapedName: "Guu Thurlow",
                uberEatsUrl: url,
            }),
            "Guu Garden"
        )
    })

    it("falls back to the scraped store name when title is blank", () => {
        assert.equal(
            resolveRestaurantName({
                title: "  ",
                scrapedName: "Guu Thurlow",
                uberEatsUrl: url,
            }),
            "Guu Thurlow"
        )
    })

    it("falls back to the Uber Eats slug when title and scrape are missing", () => {
        assert.equal(
            resolveRestaurantName({
                title: "",
                scrapedName: "",
                uberEatsUrl: url,
            }),
            "Guu Thurlow"
        )
    })
})

describe("restaurantDisplayTitle", () => {
    it("shows the stored name when present", () => {
        assert.equal(
            restaurantDisplayTitle(
                "Guu Garden",
                "https://www.ubereats.com/ca/store/guu-thurlow/abc123"
            ),
            "Guu Garden"
        )
    })

    it("falls back to the link slug when the stored name is empty", () => {
        assert.equal(
            restaurantDisplayTitle(
                "",
                "https://www.ubereats.com/ca/store/guu-thurlow/abc123"
            ),
            "Guu Thurlow"
        )
    })
})

describe("withoutUnlinkedPoolRestaurants", () => {
    it("drops baked-in url-less seeds and keeps user-added Uber Eats rows", () => {
        const kept = withoutUnlinkedPoolRestaurants([
            { name: "Japadog", uber_eats_url: null },
            { name: "Mezze", uber_eats_url: undefined },
            {
                name: "Guu Garden",
                uber_eats_url: "https://www.ubereats.com/ca/store/guu-thurlow/abc123",
            },
        ])

        assert.equal(kept.length, 1)
        assert.equal(kept[0]?.name, "Guu Garden")
        assert.ok(LEGACY_SEEDED_RESTAURANT_NAMES.includes("Japadog"))
        assert.ok(LEGACY_SEEDED_RESTAURANT_NAMES.includes("Mezze"))
    })
})
