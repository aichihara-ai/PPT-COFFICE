"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import {
    getAuthErrorMessage,
    useAuth,
} from "@/features/auth"
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
} from "@ppt/luminis"

export function LoginPage() {
    const { user, login, register } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const requestedPath = searchParams.get("from")
    const redirectTo =
        requestedPath?.startsWith("/") &&
        !requestedPath.startsWith("//") &&
        !requestedPath.includes("://") &&
        !requestedPath.includes("\\")
            ? requestedPath
            : "/"

    useEffect(() => {
        if (user) router.replace(redirectTo)
    }, [redirectTo, router, user])

    if (user) return null

    async function handleSubmit(mode: "login" | "register") {
        if (!name.trim() || !password) {
            toast.error("Name and password required")
            return
        }

        setIsSubmitting(true)
        try {
            if (mode === "login") {
                await login(name.trim(), password)
                toast.success("Signed in")
            } else {
                await register(name.trim(), password)
                toast.success("Account created")
            }
            router.replace(redirectTo)
        } catch (error) {
            toast.error(getAuthErrorMessage(error))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Office Hub</CardTitle>
                    <CardDescription>
                        Sign in to book rooms, update inventory, and join lunch votes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            autoComplete="username"
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            className="flex-1"
                            disabled={isSubmitting}
                            onClick={() => void handleSubmit("login")}
                        >
                            Sign in
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            disabled={isSubmitting}
                            onClick={() => void handleSubmit("register")}
                        >
                            Register
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
