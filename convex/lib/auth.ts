import { ConvexError } from "convex/values"

// Type definitions for the JWT claims
export type OrgInfo = {
  id: string
  name: string
  role: string
  slug: string
  image?: string
  metadata?: Record<string, any>
  permissions?: string[]
}

export type AppData = {
  user_type: string
  business_settings?: Record<string, any>
  default_vehicle_id?: string
}

export type UserIdentity = {
  subject: string
  tokenIdentifier: string
  name?: string
  email?: string
  phone?: string
  picture?: string
  given_name?: string
  family_name?: string
  preferred_username?: string
  email_verified?: boolean
  phone_verified?: boolean
  mfa_enabled?: boolean
  org?: OrgInfo
  app_data?: AppData
}

// Helper function to get authenticated user and organization info
export function getAuthenticatedUser(identity: UserIdentity | null) {
  if (!identity) {
    throw new ConvexError("Not authenticated")
  }

  const userId = identity.subject

  // Extract organization info
  const org = identity.org
  if (!org || !org.id) {
    throw new ConvexError("No organization selected")
  }

  return {
    userId,
    orgId: org.id,
    orgRole: org.role,
    orgPermissions: org.permissions || [],
    userType: identity.app_data?.user_type || "client",
    businessSettings: identity.app_data?.business_settings || {},
    defaultVehicleId: identity.app_data?.default_vehicle_id,
  }
}

// Helper function to check if user has a specific permission
export function hasPermission(permissions: string[], requiredPermission: string): boolean {
  return permissions.includes(requiredPermission)
}

// Helper function to check if user has any of the specified permissions
export function hasAnyPermission(permissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some((permission) => permissions.includes(permission))
}
