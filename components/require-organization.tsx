"use client"

import type React from "react"
import { useOrganization } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function RequireOrganization({ children }: { children: React.ReactNode }) {
  const { isLoaded, organization } = useOrganization()
  const router = useRouter()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!organization) {
    // Instead of using RedirectToCreateOrganization, we'll use the router
    router.push("/org/create")
    return null
  }

  return <>{children}</>
}
