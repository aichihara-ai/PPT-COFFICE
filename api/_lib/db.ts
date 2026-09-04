import { neon } from "@neondatabase/serverless"

import { requireDatabaseUrl } from "./databaseUrl.js"

export function getSql() {
    return neon(requireDatabaseUrl())
}
