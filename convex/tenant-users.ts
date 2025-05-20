import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser, hasPermission } from "./lib/auth"
import { ConvexError } from "convex/values"

// Get tenant users (admin/staff only)
export const getTenantUsers = query({
  args: {
    orgId: v.string(),
    role: v.optional(v.string()),
    search: v.optional(v.string()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Permission denied: Cannot access users for this organization")
    }

    // Only admins or members with proper permissions can view all users
    if (orgRole !== "org:admin" && !hasPermission(orgPermissions, "org:users:read")) {
      throw new ConvexError("Permission denied: Cannot access user list")
    }

    // Build the query
    let query = ctx.db.query("userTenants").filter((q) => q.eq(q.field("tenantId"), args.orgId))

    // Filter by role if provided
    if (args.role) {
      query = query.filter((q) => q.eq(q.field("role"), args.role))
    }

    // Apply pagination
    const limit = args.limit ?? 10
    if (args.cursor) {
      query = query.cursor(args.cursor)
    }

    // Execute the query
    const userTenants = await query.take(limit + 1)

    // Check if there are more results
    const hasMore = userTenants.length > limit
    const results = hasMore ? userTenants.slice(0, limit) : userTenants

    // Get the next cursor
    const nextCursor = hasMore ? userTenants[limit - 1]._id : null

    // Fetch user details for each userTenant
    const userIds = results.map((ut) => ut.userId)
    const users = await ctx.db
      .query("users")
      .filter((q) => q.in(q.field("clerkId"), userIds))
      .collect()

    // Combine user and userTenant data
    const combinedUsers = results.map((ut) => {
      const user = users.find((u) => u.clerkId === ut.userId)
      return {
        ...ut,
        user: user || null,
      }
    })

    return {
      users: combinedUsers,
      nextCursor: nextCursor ? nextCursor.toString() : null,
      hasMore,
    }
  },
})

// Update user role in tenant (admin only)
export const updateUserRole = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId: userOrgId, orgRole } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Permission denied: Cannot update users for this organization")
    }

    // Only admins can update user roles
    if (orgRole !== "org:admin") {
      throw new ConvexError("Permission denied: Admin access required to update user roles")
    }

    // Find the userTenant record
    const userTenant = await ctx.db
      .query("userTenants")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), args.userId)))
      .first()

    if (!userTenant) {
      throw new ConvexError("User not found in this organization")
    }

    // Update the role
    return await ctx.db.patch(userTenant._id, {
      role: args.role,
      updatedAt: Date.now(),
    })
  },
})

// Remove user from tenant (admin only)
export const removeUserFromTenant = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId: userOrgId, orgRole, userId: currentUserId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Permission denied: Cannot remove users from this organization")
    }

    // Only admins can remove users
    if (orgRole !== "org:admin") {
      throw new ConvexError("Permission denied: Admin access required to remove users")
    }

    // Prevent removing yourself
    if (args.userId === currentUserId) {
      throw new ConvexError("Cannot remove yourself from the organization")
    }

    // Find the userTenant record
    const userTenant = await ctx.db
      .query("userTenants")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), args.userId)))
      .first()

    if (!userTenant) {
      throw new ConvexError("User not found in this organization")
    }

    // Remove the user from the organization
    await ctx.db.delete(userTenant._id)

    // Log the activity
    await ctx.db.insert("activities", {
      tenantId: args.orgId,
      userId: currentUserId,
      type: "user_removed",
      description: `User ${args.userId} was removed from the organization`,
      timestamp: Date.now(),
    })

    return { success: true }
  },
})
