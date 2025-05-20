"use client"

import type React from "react"

import { useOrganization } from "@clerk/nextjs"
import { RedirectToCreateOrganization } from "@clerk/nextjs"

export default function RequireOrganization({ children }: { children: React.ReactNode }) {
  const { isLoaded, organization } = useOrganization()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!organization) {
    return <RedirectToCreateOrganization />
  }

  return <>{children}</>
}
