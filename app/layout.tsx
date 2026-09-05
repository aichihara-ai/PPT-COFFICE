import type { Metadata } from "next"

import { AppChrome } from "@/_app/providers/app-chrome"
import { AppProviders } from "@/_app/providers/app-providers"

import "./globals.css"

export const metadata: Metadata = {
    title: "Office Hub — Vancouver",
    description: "Vancouver office hub",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <AppProviders>
                    <AppChrome>{children}</AppChrome>
                </AppProviders>
            </body>
        </html>
    )
}
