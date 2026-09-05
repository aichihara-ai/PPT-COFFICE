export class ApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
    }
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const headers = new Headers(options.headers)
    if (!headers.has("Content-Type") && options.body) {
        headers.set("Content-Type", "application/json")
    }

    const response = await fetch(path, {
        ...options,
        headers,
        credentials: "include",
    })
    const data = (await response.json().catch(() => ({}))) as { error?: string } & T

    if (!response.ok) {
        throw new ApiError(response.status, data.error ?? "Request failed")
    }

    return data
}
