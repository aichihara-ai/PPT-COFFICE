import { spawnSync } from "node:child_process"
import { setTimeout as sleep } from "node:timers/promises"

const COMPOSE_FILE = "docker-compose.dev.yml"

function run(command, args) {
    const result = spawnSync(command, args, { stdio: "inherit" })
    if (result.status !== 0) {
        process.exit(result.status ?? 1)
    }
}

async function waitForPostgres() {
    for (let attempt = 0; attempt < 30; attempt += 1) {
        const ready = spawnSync(
            "docker",
            [
                "compose",
                "-f",
                COMPOSE_FILE,
                "exec",
                "-T",
                "postgres",
                "pg_isready",
                "-U",
                "office",
                "-d",
                "office_hub",
            ],
            { encoding: "utf8" },
        )
        if (ready.status === 0) {
            return
        }
        await sleep(2000)
    }
    console.error("postgres not ready after compose up")
    process.exit(1)
}

run("docker", ["compose", "-f", COMPOSE_FILE, "up", "-d"])
await waitForPostgres()
run("npm", ["run", "db:migrate"])
