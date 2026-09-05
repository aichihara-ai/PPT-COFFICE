import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { hourTickPercent, nowMarkerStyle } from "./room-schedule.ts"

describe("nowMarkerStyle axis", () => {
    it("places 9:21 on the same 8a–6p axis as the 9a and 10a ticks", () => {
        const now = new Date("2026-09-05T16:21:00.000Z")
        const style = nowMarkerStyle("2026-09-05", now)

        assert.ok(style, "marker should show on the local calendar day")
        assert.equal(now.getHours(), 9)
        assert.equal(now.getMinutes(), 21)

        const left = Number.parseFloat(style.left)
        const nine = hourTickPercent(9)
        const ten = hourTickPercent(10)

        assert.equal(nine, 10)
        assert.equal(ten, 20)
        assert.equal(left, 13.5)
        assert.ok(left > nine && left < ten)
        assert.equal((left - nine) / (ten - nine), 0.35)
    })

    it("compares the viewed date to the local calendar day, not the UTC date", () => {
        const fiveTwentyOnePmPt = new Date("2026-09-06T00:21:00.000Z")
        assert.equal(fiveTwentyOnePmPt.toISOString().slice(0, 10), "2026-09-06")
        assert.equal(fiveTwentyOnePmPt.getHours(), 17)
        assert.equal(fiveTwentyOnePmPt.getMinutes(), 21)

        const style = nowMarkerStyle("2026-09-05", fiveTwentyOnePmPt)
        assert.ok(style, "17:21 America/Vancouver is still Sep 5 locally")
        assert.equal(Number.parseFloat(style.left), 93.5)
        assert.equal(nowMarkerStyle("2026-09-06", fiveTwentyOnePmPt), null)
    })
})
