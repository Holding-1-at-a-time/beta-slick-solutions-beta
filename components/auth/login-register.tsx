"use client"

import { useEffect } from "react"
import { SignIn, SignUp, useAuth } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"

type LoginRegisterProps = {
  mode: "sign-in" | "sign-up"
  redirectUrl?: string
}

export default function LoginRegister({ mode, redirectUrl = "/dashboard" }: LoginRegisterProps) {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get the redirect URL from query params if available
  const redirectUrlFromQuery = searchParams.get("redirect_url")
  const finalRedirectUrl = redirectUrlFromQuery || redirectUrl

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (isLoaded && userId) {
      router.push(finalRedirectUrl)
    }
  }, [isLoaded, userId, router, finalRedirectUrl])

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render the auth UI if already signed in (will redirect)
  if (userId) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {mode === "sign-in" ? "Sign in to your account" : "Create a new account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === "sign-in" ? "Or " : "Already have an account? "}
            <a
              href={mode === "sign-in" ? "/sign-up" : "/sign-in"}
              className="font-medium text-primary hover:text-primary/80"
            >
              {mode === "sign-in" ? "create a new account" : "sign in"}
            </a>
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {mode === "sign-in" ? (
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              redirectUrl={finalRedirectUrl}
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  card: "shadow-none border-none p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  footerAction: "hidden",
                },
              }}
            />
          ) : (
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              redirectUrl={finalRedirectUrl}
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  card: "shadow-none border-none p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  footerAction: "hidden",
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
