"use client"

import type React from "react"
import { usePermissions } from "@/hooks/use-permissions"
import type { Permission } from "@/lib/permissions"

type PermissionGuardProps = {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
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
  const { can, canAny, canAll } = usePermissions()

  // Check if the user has the required permissions
  const hasAccess = permission ? can(permission) : requireAll ? canAll(permissions) : canAny(permissions)

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
