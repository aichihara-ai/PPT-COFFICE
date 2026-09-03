import { demoApiFetch } from "@/lib/demoStore"

export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

const useLocalDemo =
    import.meta.env.VITE_USE_LOCAL_DEMO !== "false" &&
    import.meta.env.VITE_USE_API !== "true"

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    if (useLocalDemo) {
        try {
            return demoApiFetch<T>(path, options)
        } catch (error) {
            throw new ApiError(400, error instanceof Error ? error.message : "Request failed")
        }
    }

    const headers = new Headers(options.headers)
    if (!headers.has("Content-Type") && options.body) {
        headers.set("Content-Type", "application/json")
    }

    const response = await fetch(path, { ...options, headers })
    const data = (await response.json().catch(() => ({}))) as { error?: string } & T

    if (!response.ok) {
        throw new ApiError(response.status, data.error ?? "Request failed")
    }

    return data
}
