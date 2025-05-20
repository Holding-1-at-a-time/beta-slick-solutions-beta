import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Sync user from Clerk webhook
export const syncUserFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    username: v.optional(v.string()),
    lastSignInAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        username: args.username,
        lastSignInAt: args.lastSignInAt,
        updatedAt: args.updatedAt || Date.now(),
      });
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        username: args.username,
        role: "client", // Default role
        lastSignInAt: args.lastSignInAt,
        createdAt: args.createdAt || Date.now(),
        updatedAt: args.updatedAt,
      });
    }
  },
});

// Mark user as deleted
export const markUserDeleted = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    
    if (!user) {
      throw new Error(`User not found for Clerk ID: ${args.clerkId}`);
    }
    
    // Mark the user as deleted
    return await ctx.db.patch(user._id, {
      isDeleted: true,
      updatedAt: Date.now(),
    });
  },
});

// Sync organization membership
export const syncOrganizationMembership = mutation({
  args: {
    clerkOrgId: v.string(),
    clerkUserId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the tenant by Clerk org ID
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .first();
    
    if (!tenant) {
      throw new Error(`Tenant not found for Clerk org ID: ${args.clerkOrgId}`);
    }
    
    // Get the user by Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!user) {
      throw new Error(`User not found for Clerk user ID: ${args.clerkUserId}`);
    }
    
    // Update user with tenant ID and role
    return await ctx.db.patch(user._id, {
      tenantId: tenant._id,
      role: args.role,
      updatedAt: Date.now(),
    });
  },
});

// Remove organization membership
export const removeOrganizationMembership = mutation({
  args: {
    clerkOrgId: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the user by Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first();
    
    if (!user) {
      throw new Error(`User not found for Clerk user ID: ${args.clerkUserId}`);
    }
    
    // Get the tenant by Clerk org ID
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .first();
    
    if (!tenant) {
      throw new Error(`Tenant not found for Clerk org ID: ${args.clerkOrgId}`);
    }
    
    // Only remove the tenant association if it matches the specified organization
    if (user.tenantId === tenant._id) {
      return await ctx.db.patch(user._id, {
        tenantId: null,
        updatedAt: Date.now(),
      });
    }
    
    return user;
  },
});
