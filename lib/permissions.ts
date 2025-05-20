// Permission types based on the provided RBAC strategy
export type PermissionAction = "READ" | "WRITE" | "MANAGE" | "DELETE"
export type PermissionDomain =
  | "vehicles"
  | "assessments"
  | "media"
  | "appointments"
  | "invoices"
  | "payments"
  | "services"
  | "users"
  | "tenants"
  | "insights"
  | "notifications"

export type Permission = `org:${PermissionDomain}:${PermissionAction}`

// Role definitions
export type Role = "org:admin" | "org:member" | "org:client"

// Permission mappings for each role
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  "org:admin": [
    // Vehicles
    "org:vehicles:read",
    "org:vehicles:write",
    "org:vehicles:delete",
    // Assessments
    "org:assessments:read",
    "org:assessments:write",
    "org:assessments:manage",
    // Media
    "org:media:read",
    "org:media:write",
    "org:media:delete",
    // Appointments
    "org:appointments:read",
    "org:appointments:write",
    "org:appointments:manage",
    // Invoices
    "org:invoices:read",
    "org:invoices:write",
    "org:invoices:manage",
    // Payments
    "org:payments:read",
    "org:payments:write",
    // Services
    "org:services:read",
    "org:services:write",
    // Users
    "org:users:read",
    "org:users:manage",
    // Tenants
    "org:tenants:manage",
    // Insights
    "org:insights:read",
    // Notifications
    "org:notifications:manage",
  ],
  "org:member": [
    // Vehicles
    "org:vehicles:read",
    // Assessments
    "org:assessments:read",
    "org:assessments:write",
    "org:assessments:manage",
    // Media
    "org:media:read",
    "org:media:write",
    // Appointments
    "org:appointments:read",
    "org:appointments:manage",
    // Invoices
    "org:invoices:read",
    "org:invoices:write",
    // Payments
    "org:payments:read",
    "org:payments:write",
    // Services
    "org:services:read",
    // Insights
    "org:insights:read",
    // Notifications
    "org:notifications:manage",
  ],
  "org:client": [
    // Vehicles
    "org:vehicles:read",
    "org:vehicles:write",
    // Assessments
    "org:assessments:read",
    "org:assessments:write",
    // Media
    "org:media:read",
    "org:media:write",
    // Appointments
    "org:appointments:read",
    "org:appointments:write",
    // Invoices
    "org:invoices:read",
    // Payments
    "org:payments:read",
    "org:payments:write",
    // Services
    "org:services:read",
    // Notifications
    "org:notifications:manage",
  ],
}

// Helper function to check if a role has a specific permission
export function hasPermission(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[role].includes(permission)
}

// Helper function to check if a role has any of the specified permissions
export function hasAnyPermission(role: Role | undefined, permissions: Permission[]): boolean {
  if (!role) return false
  return permissions.some((permission) => ROLE_PERMISSIONS[role].includes(permission))
}

// Helper function to check if a role has all of the specified permissions
export function hasAllPermissions(role: Role | undefined, permissions: Permission[]): boolean {
  if (!role) return false
  return permissions.every((permission) => ROLE_PERMISSIONS[role].includes(permission))
}
