"use client"

import type React from "react"
import { useAuthInfo } from "@/hooks/use-auth-info"

type PermissionGuardProps = {
  children: React.ReactNode
  permission?: string
  permissions?: string[]
  requireAll?: boolean
  fallback?: React.ReactNode
}

export default function PermissionGuard({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { authInfo } = useAuthInfo()

  if (!authInfo) {
    return <>{fallback}</>
  }

  const { orgPermissions, orgRole } = authInfo

  // Admin role always has access
  if (orgRole === "org:admin") {
    return <>{children}</>
  }

  // Check permissions
  let hasAccess = false

  if (permission) {
    hasAccess = orgPermissions.includes(permission)
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? permissions.every((p) => orgPermissions.includes(p))
      : permissions.some((p) => orgPermissions.includes(p))
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
