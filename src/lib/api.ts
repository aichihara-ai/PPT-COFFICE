import { clearAuthToken, getAuthToken } from "@/lib/authStorage"
import { demoApiFetch } from "@/lib/demoStore"

export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

export const isApiMode =
    import.meta.env.VITE_USE_LOCAL_DEMO === "false" ||
    import.meta.env.VITE_USE_API === "true"

const useLocalDemo = !isApiMode

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

    const token = getAuthToken()
    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`)
    }

    const response = await fetch(path, { ...options, headers })
    const data = (await response.json().catch(() => ({}))) as { error?: string } & T

    if (!response.ok) {
        if (response.status === 401 && token) {
            clearAuthToken()
        }
        throw new ApiError(response.status, data.error ?? "Request failed")
    }

    return data
}
