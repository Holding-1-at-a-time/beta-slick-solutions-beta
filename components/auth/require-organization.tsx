"use client"

import type React from "react"
import { useOrganization } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

type RequireOrganizationProps = {
  children: React.ReactNode
  redirectUrl?: string
}

export default function RequireOrganization({ children, redirectUrl = "/org-selection" }: RequireOrganizationProps) {
  const { isLoaded, organization } = useOrganization()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !organization) {
      router.push(redirectUrl)
    }
  }, [isLoaded, organization, router, redirectUrl])

  // Show loading state while checking org
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium">Loading organization...</p>
        </div>
      </div>
    )
  }

  // Don't render children if no organization (will redirect)
  if (!organization) {
    return null
  }

  return <>{children}</>
}
