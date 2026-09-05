import { existsSync, readFileSync } from "node:fs"
import { spawnSync } from "node:child_process"

const requiredPaths = [
    "app/layout.tsx",
    "app/page.tsx",
    "app/api/auth/login/route.ts",
    "src/_app",
    "src/_pages",
    "src/widgets",
    "src/features",
    "src/entities",
    "src/shared",
    "prisma/schema.prisma",
]

const removedPaths = [
    "index.html",
    "vite.config.ts",
    "vercel.json",
    "src/App.tsx",
    "src/main.tsx",
    "src/pages",
    "src/components",
    "src/layout",
    "src/providers",
    "api",
    "db/schema.sql",
    "db/seed.sql",
]

const packageJson = JSON.parse(readFileSync("package.json", "utf8"))

const checks = [
    {
        label: "required Next.js and FSD paths exist",
        pass: requiredPaths.every(existsSync),
    },
    {
        label: "legacy Vite paths are removed",
        pass: removedPaths.every((path) => !existsSync(path)),
    },
    {
        label: "Next.js owns the runtime scripts",
        pass:
            packageJson.scripts?.dev === "next dev" &&
            packageJson.scripts?.build === "next build" &&
            packageJson.scripts?.start === "next start",
    },
    {
        label: "Prisma and Steiger are verification steps",
        pass:
            packageJson.scripts?.["db:generate"] === "prisma generate" &&
            packageJson.scripts?.["lint:fsd"]?.endsWith("steiger ./src"),
    },
]

for (const check of checks) {
    if (!check.pass) {
        console.error(`FAIL ${check.label}`)
        process.exit(1)
    }
    console.log(`PASS ${check.label}`)
}

for (const command of ["db:generate", "lint:fsd", "lint", "build"]) {
    const result = spawnSync("npm", ["run", command], {
        stdio: "inherit",
        shell: process.platform === "win32",
    })
    if (result.status !== 0) {
        process.exit(result.status ?? 1)
    }
}
