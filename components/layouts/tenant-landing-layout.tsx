"use client"

import type React from "react"

import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { OrganizationSwitcher } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { LogOut } from "lucide-react"

export default function TenantLandingLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, signOut } = useAuth()
  const router = useRouter()

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in")
    }
  }, [isLoaded, userId, router])

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!userId) {
    return null // Will redirect to sign-in
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Vehicle Service Platform</h1>
          <div className="flex items-center gap-4">
            <OrganizationSwitcher
              hidePersonal
              appearance={{
                elements: {
                  rootBox: "relative",
                  organizationSwitcherTrigger:
                    "flex justify-between items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none",
                },
              }}
            />
            <UserButton />
            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} Vehicle Service Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
