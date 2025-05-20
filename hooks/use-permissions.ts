"use client"

import { useOrganization } from "@clerk/nextjs"
import { useMemo } from "react"
import { type Permission, type Role, hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions"

export function usePermissions() {
  const { organization, membership } = useOrganization()

  // Get the user's role in the current organization
  const role = useMemo(() => {
    if (!organization || !membership) return undefined
    return membership.role as Role
  }, [organization, membership])

  // Check if the user has a specific permission
  const can = useMemo(() => {
    return (permission: Permission) => hasPermission(role, permission)
  }, [role])

  // Check if the user has any of the specified permissions
  const canAny = useMemo(() => {
    return (permissions: Permission[]) => hasAnyPermission(role, permissions)
  }, [role])

  // Check if the user has all of the specified permissions
  const canAll = useMemo(() => {
    return (permissions: Permission[]) => hasAllPermissions(role, permissions)
  }, [role])

  return {
    role,
    can,
    canAny,
    canAll,
    isAdmin: role === "org:admin",
    isMember: role === "org:member",
    isClient: role === "org:client",
  }
}
