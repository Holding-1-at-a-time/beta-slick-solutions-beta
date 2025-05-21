import { mutation } from "./_generated/server"
import { v } from "convex/values"

// Sync role from Clerk webhook
export const syncRoleFromClerk = mutation({
  args: {
    clerkRoleId: v.string(),
    clerkOrgId: v.optional(v.string()),
    name: v.string(),
    key: v.string(),
    description: v.optional(v.string()),
    permissions: v.array(v.string()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get the tenant by Clerk org ID if provided
    let tenantId = undefined
    if (args.clerkOrgId) {
      const tenant = await ctx.db
        .query("tenants")
        .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
        .first()

      if (tenant) {
        tenantId = tenant._id
      }
    }

    // Check if role already exists
    const existingRole = await ctx.db
      .query("roles")
      .withIndex("by_clerk_role_id", (q) => q.eq("clerkRoleId", args.clerkRoleId))
      .first()

    if (existingRole) {
      // Update existing role
      return await ctx.db.patch(existingRole._id, {
        name: args.name,
        key: args.key,
        description: args.description,
        permissions: args.permissions,
        updatedAt: args.updatedAt || Date.now(),
      })
    } else {
      // Create new role
      return await ctx.db.insert("roles", {
        clerkRoleId: args.clerkRoleId,
        clerkOrgId: args.clerkOrgId,
        tenantId,
        name: args.name,
        key: args.key,
        description: args.description,
        permissions: args.permissions,
        createdAt: args.createdAt || Date.now(),
      })
    }
  },
})

// Mark role as deleted
export const markRoleDeleted = mutation({
  args: {
    clerkRoleId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the role
    const role = await ctx.db
      .query("roles")
      .withIndex("by_clerk_role_id", (q) => q.eq("clerkRoleId", args.clerkRoleId))
      .first()

    if (!role) {
      throw new Error(`Role not found for Clerk role ID: ${args.clerkRoleId}`)
    }

    // Mark the role as deleted
    return await ctx.db.patch(role._id, {
      isDeleted: true,
      updatedAt: Date.now(),
    })
  },
})
