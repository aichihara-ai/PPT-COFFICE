import { useEffect, useState } from "react"

export function useCountdown(endsAt: string | null | undefined) {
    const [remainingMs, setRemainingMs] = useState(() =>
        endsAt ? Math.max(0, new Date(endsAt).getTime() - Date.now()) : 0
    )

    useEffect(() => {
        if (!endsAt) {
            setRemainingMs(0)
            return
        }

        const tick = () => {
            setRemainingMs(Math.max(0, new Date(endsAt).getTime() - Date.now()))
        }

        tick()
        const id = window.setInterval(tick, 1000)
        return () => window.clearInterval(id)
    }, [endsAt])

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
