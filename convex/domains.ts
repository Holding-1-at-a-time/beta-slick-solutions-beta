import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create domain
export const createDomain = mutation({
  args: {
    clerkDomainId: v.string(),
    clerkOrgId: v.string(),
    name: v.string(),
    status: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the tenant by Clerk org ID
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .first();
    
    // Create the domain
    return await ctx.db.insert("domains", {
      clerkDomainId: args.clerkDomainId,
      clerkOrgId: args.clerkOrgId,
      tenantId: tenant ? tenant._id : undefined,
      name: args.name,
      status: args.status,
      createdAt: args.createdAt,
    });
  },
});

// Update domain
export const updateDomain = mutation({
  args: {
    clerkDomainId: v.string(),
    status: v.string(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Find the domain
    const domain = await ctx.db
      .query("domains")
      .withIndex("by_clerk_domain_id", (q) => q.eq("clerkDomainId", args.clerkDomainId))
      .first();
    
    if (!domain) {
      throw new Error(`Domain not found for Clerk domain ID: ${args.clerkDomainId}`);
    }
    
    // Update the domain
    return await ctx.db.patch(domain._id, {
      status: args.status,
      updatedAt: args.updatedAt,
    });
  },
});

// Mark domain as deleted
export const markDomainDeleted = mutation({
  args: {
    clerkDomainId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the domain
    const domain = await ctx.db
      .query("domains")
      .withIndex("by_clerk_domain_id", (q) => q.eq("clerkDomainId", args.clerkDomainId))
      .first();
    
    if (!domain) {
      throw new Error(`Domain not found for Clerk domain ID: ${args.clerkDomainId}`);
    }
    
    // Mark the domain as deleted
    return await ctx.db.patch(domain._id, {
      isDeleted: true,
      updatedAt: Date.now(),
    });
  },
});
