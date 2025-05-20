"use client"

import { useEffect, useState } from "react"
import { AuthenticateWithRedirectCallback, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function AuthenticateCallback() {
  const { isReady } = useClerk()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  // Handle errors that might occur during the authentication process
  useEffect(() => {
    if (!isReady) return

    // Check for error in URL
    const url = new URL(window.location.href)
    const errorParam = url.searchParams.get("error")
    const errorDescriptionParam = url.searchParams.get("error_description")

    if (errorParam) {
      setError(errorDescriptionParam || "An error occurred during authentication")
    }
  }, [isReady])

  // If there's an error, show it
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="mb-4 text-xl font-bold text-red-700">Authentication Error</h1>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/sign-in")}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <AuthenticateWithRedirectCallback afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard" />
        <div className="mt-8 flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium">Completing authentication...</p>
        </div>
      </div>
    </div>
  )
}
