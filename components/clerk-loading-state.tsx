"use client"

import type React from "react"

import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs"

export default function ClerkLoadingState({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ClerkLoading>
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-lg font-medium">Loading authentication...</p>
          </div>
        </div>
      </ClerkLoading>

      <ClerkLoaded>{children}</ClerkLoaded>
    </>
  )
}
