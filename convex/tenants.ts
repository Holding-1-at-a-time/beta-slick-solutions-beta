import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Sync tenant from Clerk webhook
export const syncTenantFromClerk = mutation({
  args: {
    clerkOrgId: v.string(),
    name: v.string(),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if tenant already exists
    const existingTenant = await ctx.db
      .query("tenants")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .first();
    
    if (existingTenant) {
      // Update existing tenant
      return await ctx.db.patch(existingTenant._id, {
        name: args.name,
        slug: args.slug,
        logo: args.imageUrl || existingTenant.logo,
        updatedAt: Date.now(),
      });
    } else {
      // Create new tenant
      const tenantId = await ctx.db.insert("tenants", {
        clerkOrgId: args.clerkOrgId,
        name: args.name,
        slug: args.slug,
        logo: args.imageUrl || "",
        contactEmail: "",
        primaryColor: "#3b82f6",
        secondaryColor: "#1e40af",
        requireDeposit: false,
        depositPercentage: 0.2,
        createdAt: args.createdAt || Date.now(),
      });
      
      // If createdBy is provided, update the user with the tenant ID
      if (args.createdBy) {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.createdBy))
          .first();
        
        if (user) {
          await ctx.db.patch(user._id, {
            tenantId: tenantId,
            role: "admin",
            updatedAt: Date.now(),
          });
        }
      }
      
      return tenantId;
    }
  },
});

// Update tenant from Clerk webhook
export const updateTenantFromClerk = mutation({
  args: {
    clerkOrgId: v.string(),
    name: v.string(),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find the tenant
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .first();
    
    if (!tenant) {
      throw new Error(`Tenant not found for Clerk org ID: ${args.clerkOrgId}`);
    }
    
    // Update the tenant
    return await ctx.db.patch(tenant._id, {
      name: args.name,
      slug: args.slug,
      logo: args.imageUrl || tenant.logo,
      updatedAt: args.updatedAt || Date.now(),
    });
  },
});

// Mark tenant as deleted
export const markTenantDeleted = mutation({
  args: {
    clerkOrgId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the tenant
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .first();
    
    if (!tenant) {
      throw new Error(`Tenant not found for Clerk org ID: ${args.clerkOrgId}`);
    }
    
    // Mark the tenant as deleted
    return await ctx.db.patch(tenant._id, {
      isDeleted: true,
      updatedAt: Date.now(),
    });
  },
});
