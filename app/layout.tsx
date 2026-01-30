import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { ViewProvider } from "@/components/ui/view-provider"

export const metadata = {
  title: "VBU (Vercel Blob upload)",
  description: "A file upload center built with Vercel Blob",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.svg",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon: auto-switch based on user's prefers-color-scheme */}
        <link rel="icon" href="/favicon-light.svg" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/favicon-dark.svg" media="(prefers-color-scheme: dark)" />
        {/* Fallbacks */}
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0f1724" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Permanent+Marker&display=swap" rel="stylesheet" />*/}
      </head>
      <body className={`antialiased min-h-screen bg-background font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange>
          <ViewProvider>
            {children}
          </ViewProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
