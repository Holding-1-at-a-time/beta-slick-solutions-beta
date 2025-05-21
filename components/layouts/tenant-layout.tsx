"use client"

import type React from "react"

import { useOrganization, useUser, UserButton, OrganizationSwitcher } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Sidebar from "@/components/tenant/sidebar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface TenantLayoutProps {
  children: React.ReactNode
  orgId: string
}

export default function TenantLayout({ children, orgId }: TenantLayoutProps) {
  const { isLoaded: isOrgLoaded, organization } = useOrganization()
  const { isLoaded: isUserLoaded, user, signOut } = useUser()
  const router = useRouter()

  // Redirect if org doesn't match or user isn't loaded
  useEffect(() => {
    if (isOrgLoaded && isUserLoaded) {
      if (!organization) {
        router.push("/org-selection")
      } else if (organization.id !== orgId) {
        router.push(`/org/${organization.id}/dashboard`)
      }
    }
  }, [isOrgLoaded, isUserLoaded, organization, orgId, router])

  if (!isOrgLoaded || !isUserLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!organization || organization.id !== orgId) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 lg:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary hidden md:block">{organization.name}</h1>
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
          </div>
          <div className="flex items-center gap-4">
            <UserButton />
            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        <Sidebar orgId={orgId} />
        <main className="flex-1 p-4 lg:p-6 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
