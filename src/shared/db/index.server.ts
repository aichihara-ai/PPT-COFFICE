import "server-only"

import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "../../../generated/prisma/client"

import { resolveDatabaseTarget } from "./database-target"

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

function createPrismaClient() {
    const target = resolveDatabaseTarget(process.env)

    const adapter =
        target.kind === "local-tcp"
            ? new PrismaPg({ connectionString: target.connectionString })
            : new PrismaNeon({ connectionString: target.connectionString })

    return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}
