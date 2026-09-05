import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { formatTimeValue } from "./types.ts"

describe("formatTimeValue", () => {
    it("formats Prisma @db.Time values as HH:MM instead of Date.toString()", () => {
        const start = new Date("1970-01-01T10:00:00.000Z")
        const end = new Date("1970-01-01T11:30:00.000Z")

        assert.equal(formatTimeValue(start), "10:00")
        assert.equal(formatTimeValue(end), "11:30")
        assert.notEqual(formatTimeValue(start), "Thu J")
    })

    it("keeps existing HH:MM strings unchanged", () => {
        assert.equal(formatTimeValue("14:30"), "14:30")
        assert.equal(formatTimeValue("09:00:00"), "09:00")
    })
})
