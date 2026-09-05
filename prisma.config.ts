import { loadEnvConfig } from "@next/env"
import { defineConfig } from "prisma/config"

import { resolveDatabaseTarget } from "./src/shared/db/database-target"

loadEnvConfig(process.cwd())

const connectionString = process.env.DATABASE_URL
if (connectionString) {
    resolveDatabaseTarget(process.env)
}

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: connectionString,
    },
})
