import { ConvexError, v } from "convex/values"
import type { MutationCtx, QueryCtx, ActionCtx, DatabaseReader } from "./_generated/server"
import type { Id } from "./_generated/dataModel"
import { query } from "./_generated/server"
import { api } from "./_generated/api"
import type { Auth } from "convex/server"

// Define the structure of the Clerk JWT with custom claims
type ClerkJWT = {
  org: {
    id: string
    name: string
    role: string
    slug: string
    image?: string
    metadata?: {
      business_settings?: {
        business_hours?: Record<string, { open: string | null; close: string | null }>
        service_types?: string[]
        deposit_required?: boolean
        deposit_percentage?: number
      }
      [key: string]: any
    }
    permissions?: string[]
  }
  name?: string
  email?: string
  phone?: string
  picture?: string
  app_data?: {
    user_type?: string
    business_settings?: Record<string, any>
    default_vehicle_id?: string
    service_preferences?: {
      preferred_day?: string
      notification_method?: string
      [key: string]: any
    }
  }
  clerk_id: string
  given_name?: string
  family_name?: string
  email_verified?: boolean
  phone_verified?: boolean
  mfa_enabled?: boolean
  last_auth?: string
  created_at?: string
  updated_at?: string
}

// Define the structure of our user object
export type AuthUser = {
  _id: Id<"users">
  clerkId: string
  name: string
  email: string
  phone?: string
  role: string
  tenantId: Id<"tenants">
  createdAt: number
  updatedAt: number
  metadata?: Record<string, any>
}

export type AuthenticatedUser = {
  userId: string
  orgId: string
  orgRole: string
  userType: string
  orgPermissions: string[]
  email?: string
  name?: string
}

export function getAuthenticatedUser(identity: Auth["getUserIdentity"] | null): AuthenticatedUser {
  if (!identity) {
    throw new ConvexError("Unauthenticated")
  }

  // Extract the clerk_id from the JWT token
  const userId = identity.tokenIdentifier.split("|")[1] || identity.subject

  // Extract organization information from the JWT claims
  const orgId = identity.org?.id
  if (!orgId) {
    throw new ConvexError("No organization found in JWT")
  }

  // Extract role and permissions from the JWT
  const orgRole = identity.org?.role || "org:client"
  const orgPermissions = identity.org?.permissions || []

  // Extract user type from app_data
  const userType = identity.app_data?.user_type || "client"

  // Extract optional user information
  const email = identity.email
  const name = identity.name

  return {
    userId,
    orgId,
    orgRole,
    userType,
    orgPermissions,
    email,
    name,
  }
}

export function hasPermission(permissions: string[], requiredPermission: string): boolean {
  return permissions.includes(requiredPermission) || permissions.includes("*")
}

export function requirePermission(
  permissions: string[],
  requiredPermission: string,
  errorMessage = "Permission denied",
): void {
  if (!hasPermission(permissions, requiredPermission)) {
    throw new ConvexError(errorMessage)
  }
}

// Get the authenticated user from the JWT
export async function getUser(ctx: DatabaseReader, tokenIdentifier: string): Promise<AuthUser | null> {
  // Find the user by Clerk ID
  const user = await ctx
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", tokenIdentifier))
    .first()

  return user
}

// Get the tenant ID from the JWT
export function getTenantIdFromJWT(jwt: ClerkJWT): string | null {
  return jwt.org?.id || null
}

// Get business settings from the JWT
export function getBusinessSettings(jwt: ClerkJWT): Record<string, any> {
  return jwt.org?.metadata?.business_settings || {}
}

// Get user preferences from the JWT
export function getUserPreferences(jwt: ClerkJWT): Record<string, any> {
  return jwt.app_data?.service_preferences || {}
}

// Check if the user has the required permission
// export function hasPermission(jwt: ClerkJWT, requiredPermission: string): boolean {
//   // If no permissions are required, allow access
//   if (!requiredPermission) {
//     return true
//   }

//   // If the user is an admin, allow access to everything
//   if (jwt.org?.role === "admin") {
//     return true
//   }

//   // Check if the user has the specific permission
//   const userPermissions = jwt.org?.permissions || []
//   return userPermissions.includes(requiredPermission)
// }

// Wrapper for queries that require tenant access
export function withTenantAccess<Args extends Record<string, unknown>, Return>(
  requiredPermission: string,
  queryFn: (ctx: QueryCtx, args: Args, user: AuthUser, tenantId: Id<"tenants">) => Promise<Return>,
) {
  return async (ctx: QueryCtx, args: Args) => {
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Unauthorized: Not authenticated")
    }

    // Extract the JWT
    const jwt = identity.tokenIdentifier.split("|")[1]
    const decodedJwt = JSON.parse(atob(jwt.split(".")[1])) as ClerkJWT

    // Get the tenant ID from the JWT
    const tenantIdFromJWT = getTenantIdFromJWT(decodedJwt)
    if (!tenantIdFromJWT) {
      throw new ConvexError("Unauthorized: No organization context")
    }

    // Check if the user has the required permission
    if (!hasPermission(decodedJwt.org?.permissions || [], requiredPermission)) {
      throw new ConvexError(`Unauthorized: Missing required permission: ${requiredPermission}`)
    }

    // Get the user from the database
    const user = await getUser(ctx.db, identity.tokenIdentifier)
    if (!user) {
      throw new ConvexError("Unauthorized: User not found")
    }

    // Ensure the user belongs to the tenant from the JWT
    if (user.tenantId !== tenantIdFromJWT) {
      throw new ConvexError("Unauthorized: User does not belong to this tenant")
    }

    // Call the query function with the user and tenant ID
    return queryFn(ctx, args, user, user.tenantId)
  }
}

// Wrapper for mutations that require tenant access
export function withTenantMutation<Args extends Record<string, unknown>, Return>(
  requiredPermission: string,
  mutationFn: (ctx: MutationCtx, args: Args, user: AuthUser, tenantId: Id<"tenants">) => Promise<Return>,
) {
  return async (ctx: MutationCtx, args: Args) => {
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Unauthorized: Not authenticated")
    }

    // Extract the JWT
    const jwt = identity.tokenIdentifier.split("|")[1]
    const decodedJwt = JSON.parse(atob(jwt.split(".")[1])) as ClerkJWT

    // Get the tenant ID from the JWT
    const tenantIdFromJWT = getTenantIdFromJWT(decodedJwt)
    if (!tenantIdFromJWT) {
      throw new ConvexError("Unauthorized: No organization context")
    }

    // Check if the user has the required permission
    if (!hasPermission(decodedJwt.org?.permissions || [], requiredPermission)) {
      throw new ConvexError(`Unauthorized: Missing required permission: ${requiredPermission}`)
    }

    // Get the user from the database
    const user = await getUser(ctx.db, identity.tokenIdentifier)
    if (!user) {
      throw new ConvexError("Unauthorized: User not found")
    }

    // Ensure the user belongs to the tenant from the JWT
    if (user.tenantId !== tenantIdFromJWT) {
      throw new ConvexError("Unauthorized: User does not belong to this tenant")
    }

    // Call the mutation function with the user and tenant ID
    return mutationFn(ctx, args, user, user.tenantId)
  }
}

// Wrapper for actions that require tenant access
export function withTenantAction<Args extends Record<string, unknown>, Return>(
  requiredPermission: string,
  actionFn: (ctx: ActionCtx, args: Args, user: AuthUser, tenantId: Id<"tenants">) => Promise<Return>,
) {
  return async (ctx: ActionCtx, args: Args) => {
    // Get the authenticated user
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new ConvexError("Unauthorized: Not authenticated")
    }

    // Extract the JWT
    const jwt = identity.tokenIdentifier.split("|")[1]
    const decodedJwt = JSON.parse(atob(jwt.split(".")[1])) as ClerkJWT

    // Get the tenant ID from the JWT
    const tenantIdFromJWT = getTenantIdFromJWT(decodedJwt)
    if (!tenantIdFromJWT) {
      throw new ConvexError("Unauthorized: No organization context")
    }

    // Check if the user has the required permission
    if (!hasPermission(decodedJwt.org?.permissions || [], requiredPermission)) {
      throw new ConvexError(`Unauthorized: Missing required permission: ${requiredPermission}`)
    }

    // Get the user from the database
    const user = await ctx.runQuery(api.internal.getUserByClerkId, {
      clerkId: identity.tokenIdentifier,
    })

    if (!user) {
      throw new ConvexError("Unauthorized: User not found")
    }

    // Ensure the user belongs to the tenant from the JWT
    if (user.tenantId !== tenantIdFromJWT) {
      throw new ConvexError("Unauthorized: User does not belong to this tenant")
    }

    // Call the action function with the user and tenant ID
    return actionFn(ctx, args, user, user.tenantId)
  }
}

// Get JWT claims for the current user
export function getJWTClaims(identity: any): ClerkJWT | null {
  if (!identity) return null

  try {
    const jwt = identity.tokenIdentifier.split("|")[1]
    return JSON.parse(atob(jwt.split(".")[1])) as ClerkJWT
  } catch (error) {
    console.error("Error parsing JWT:", error)
    return null
  }
}

// Internal query to get user by Clerk ID
export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first()
  },
  internal: true,
})
