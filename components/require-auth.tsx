"use client"

import type React from "react"

import { useAuth } from "@clerk/nextjs"
import { RedirectToSignIn } from "@clerk/nextjs"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!userId) {
    return <RedirectToSignIn />
  }

  return <>{children}</>
}
