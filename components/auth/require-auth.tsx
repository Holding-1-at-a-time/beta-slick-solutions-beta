"use client"

import type React from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type RequireAuthProps = {
  children: React.ReactNode
  redirectUrl?: string
}

export default function RequireAuth({ children, redirectUrl = "/sign-in" }: RequireAuthProps) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !userId) {
      // Add the current URL as a redirect_url parameter
      const currentPath = window.location.pathname
      const searchParams = new URLSearchParams()
      searchParams.set("redirect_url", currentPath)

      router.push(`${redirectUrl}?${searchParams.toString()}`)
    }
  }, [isLoaded, userId, router, redirectUrl])

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated (will redirect)
  if (!userId) {
    return null
  }

  return <>{children}</>
}
