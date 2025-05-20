import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import ConvexClientProvider from "@/components/ConvexClientProvider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VehicleService - Enterprise Vehicle Service Management Platform",
  description:
    "Streamline your automotive business with our AI-powered vehicle service management platform. Schedule appointments, manage invoices, and delight customers with a seamless digital experience.",
  keywords:
    "vehicle service, automotive business, service management, appointment scheduling, digital invoicing, AI scheduling",
  authors: [{ name: "VehicleService Team" }],
  creator: "VehicleService",
  publisher: "VehicleService",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vehicleservice.com",
    title: "VehicleService - Enterprise Vehicle Service Management Platform",
    description: "Streamline your automotive business with our AI-powered vehicle service management platform.",
    siteName: "VehicleService",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VehicleService Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VehicleService - Enterprise Vehicle Service Management Platform",
    description: "Streamline your automotive business with our AI-powered vehicle service management platform.",
    images: ["/twitter-image.png"],
    creator: "@vehicleservice",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://vehicleservice.com"),
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
