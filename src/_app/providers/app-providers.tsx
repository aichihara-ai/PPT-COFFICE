"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"
import { Toaster } from "sonner"

import { AuthProvider } from "@/features/auth"
import { BrandThemeProvider } from "@/_app/providers/theme-provider"

export function AppProviders({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30_000,
                        refetchOnWindowFocus: true,
                    },
                },
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <BrandThemeProvider>
                <AuthProvider>
                    {children}
                    <Toaster position="bottom-right" richColors />
                </AuthProvider>
            </BrandThemeProvider>
        </QueryClientProvider>
    )
}
