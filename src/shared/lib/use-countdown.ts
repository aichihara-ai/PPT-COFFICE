import { useEffect, useState } from "react"

export function useCountdown(endsAt: string | null | undefined) {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        if (!endsAt) return

        const id = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(id)
    }, [endsAt])

    const remainingMs = endsAt
        ? Math.max(0, new Date(endsAt).getTime() - now)
        : 0

    const totalSeconds = Math.ceil(remainingMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const isExpired = remainingMs <= 0

    return {
        remainingMs,
        isExpired,
        label: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    }
}
