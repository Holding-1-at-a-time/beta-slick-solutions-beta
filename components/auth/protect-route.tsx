"use client"

import type React from "react"
import { useAuth, useOrganization } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { Permission, Role } from "@/lib/permissions"
import { usePermissions } from "@/hooks/use-permissions"

type ProtectRouteProps = {
  children: React.ReactNode
  requireAuth?: boolean
  requireOrganization?: boolean
  requiredRole?: Role
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAllPermissions?: boolean
  signInRedirectUrl?: string
  orgSelectionRedirectUrl?: string
  unauthorizedRedirectUrl?: string
}

export default function ProtectRoute({
  children,
  requireAuth = true,
  requireOrganization = false,
  requiredRole,
  requiredPermission,
  requiredPermissions = [],
  requireAllPermissions = false,
  signInRedirectUrl = "/sign-in",
  orgSelectionRedirectUrl = "/org-selection",
  unauthorizedRedirectUrl = "/",
}: ProtectRouteProps) {
  const { isLoaded: isAuthLoaded, userId } = useAuth()
  const { isLoaded: isOrgLoaded, organization } = useOrganization()
  const { role, can, canAny, canAll } = usePermissions()
  const router = useRouter()

  useEffect(() => {
    // Wait for both auth and org to load if needed
    const authReady = requireAuth ? isAuthLoaded : true
    const orgReady = requireOrganization ? isOrgLoaded : true

    if (!authReady || !orgReady) return

    // Check authentication
    if (requireAuth && !userId) {
      const currentPath = window.location.pathname
      const searchParams = new URLSearchParams()
      searchParams.set("redirect_url", currentPath)
      router.push(`${signInRedirectUrl}?${searchParams.toString()}`)
      return
    }

    // Check organization
    if (requireOrganization && !organization) {
      router.push(orgSelectionRedirectUrl)
      return
    }

    // Check role if specified
    if (requiredRole && role !== requiredRole) {
      router.push(unauthorizedRedirectUrl)
      return
    }

    // Check permissions
    let hasPermission = true
    if (requiredPermission) {
      hasPermission = can(requiredPermission)
    } else if (requiredPermissions.length > 0) {
      hasPermission = requireAllPermissions ? canAll(requiredPermissions) : canAny(requiredPermissions)
    }

    if (!hasPermission) {
      router.push(unauthorizedRedirectUrl)
    }
  }, [
    isAuthLoaded,
    isOrgLoaded,
    userId,
    organization,
    role,
    can,
    canAny,
    canAll,
    requireAuth,
    requireOrganization,
    requiredRole,
    requiredPermission,
    requiredPermissions,
    requireAllPermissions,
    router,
    signInRedirectUrl,
    orgSelectionRedirectUrl,
    unauthorizedRedirectUrl,
  ])

  // Show loading state while checking permissions
  const isLoading = (requireAuth && !isAuthLoaded) || (requireOrganization && !isOrgLoaded)
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium">Checking permissions...</p>
        </div>
      </div>
    )
  }

  // Don't render if conditions aren't met (will redirect)
  const isAuthenticated = !requireAuth || userId
  const hasOrganization = !requireOrganization || organization
  const hasRole = !requiredRole || role === requiredRole

  let hasPermission = true
  if (requiredPermission) {
    hasPermission = can(requiredPermission)
  } else if (requiredPermissions.length > 0) {
    hasPermission = requireAllPermissions ? canAll(requiredPermissions) : canAny(requiredPermissions)
  }

  if (!isAuthenticated || !hasOrganization || !hasRole || !hasPermission) {
    return null
  }

  return <>{children}</>
}
