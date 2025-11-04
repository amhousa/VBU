import type React from "react"
import { Inter, Permanent_Marker } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { ViewProvider } from "@/components/ui/view-provider"

const inter = Inter({ subsets: ["latin"] })
const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
})

export const metadata = {
  title: "VBU (Verce Blob upload)",
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
      </head>
      <body className={`${inter.className} ${permanentMarker.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
          <ViewProvider>
            {children}
          </ViewProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
