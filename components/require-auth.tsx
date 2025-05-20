"use client"

import type React from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!userId) {
    // Instead of using RedirectToSignIn, we'll use the router
    router.push("/sign-in")
    return null
  }

  return <>{children}</>
}
