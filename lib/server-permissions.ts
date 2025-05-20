import { auth } from "@clerk/nextjs/server"
import { type Permission, type Role, hasPermission, hasAnyPermission, hasAllPermissions } from "@/lib/permissions"

export function getServerPermissions() {
  const { orgRole } = auth()
  const role = orgRole as Role | undefined

  return {
    role,
    can: (permission: Permission) => hasPermission(role, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(role, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(role, permissions),
    isAdmin: role === "org:admin",
    isMember: role === "org:member",
    isClient: role === "org:client",
  }
}
