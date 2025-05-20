import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Sync permission from Clerk webhook
export const syncPermissionFromClerk = mutation({
  args: {
    clerkPermissionId: v.string(),
    clerkOrgId: v.optional(v.string()),
    name: v.string(),
    key: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get the tenant by Clerk org ID if provided
    let tenantId = undefined;
    if (args.clerkOrgId) {
      const tenant = await ctx.db
        .query("tenants")
        .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
        .first();
      
      if (tenant) {
        tenantId = tenant._id;
      }
    }
    
    // Check if permission already exists
    const existingPermission = await ctx.db
      .query("permissions")
      .withIndex("by_clerk_permission_id", (q) => q.eq("clerkPermissionId", args.clerkPermissionId))
      .first();
    
    if (existingPermission) {
      // Update existing permission
      return await ctx.db.patch(existingPermission._id, {
        name: args.name,
        key: args.key,
        description: args.description,
        type: args.type,
        updatedAt: args.updatedAt || Date.now(),
      });
    } else {
      // Create new permission
      return await ctx.db.insert("permissions", {
        clerkPermissionId: args.clerkPermissionId,
        clerkOrgId: args.clerkOrgId,
        tenantId,
        name: args.name,
        key: args.key,
        description: args.description,
        type: args.type,
        createdAt: args.createdAt || Date.now(),
      });
    }
  },
});

// Mark permission as deleted
export const markPermissionDeleted = mutation({
  args: {
    clerkPermissionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the permission
    const permission = await ctx.db
      .query("permissions")
      .withIndex("by_clerk_permission_id", (q) => q.eq("clerkPermissionId", args.clerkPermissionId))
      .first();
    
    if (!permission) {
      throw new Error(`Permission not found for Clerk permission ID: ${args.clerkPermissionId}`);
    }
    
    // Mark the permission as deleted
    return await ctx.db.patch(permission._id, {
      isDeleted: true,
      updatedAt: Date.now(),
    });
  },
});
