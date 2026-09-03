import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"

import "@/index.css"

import App from "@/App.tsx"
import { AuthProvider } from "@/providers/AuthProvider"
import { BrandThemeProvider } from "@/providers/ThemeProvider"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: true,
        },
    },
})

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <BrandThemeProvider>
                    <AuthProvider>
                        <App />
                        <Toaster position="bottom-right" richColors />
                    </AuthProvider>
                </BrandThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
)
