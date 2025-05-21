import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

/**
 * List all users for this tenant. Admins only.
 */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only "org:admin" may list all users
    if (orgRole !== "org:admin") {
      throw new Error("Forbidden: must be an organization admin")
    }

    // Fetch the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()
    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Return all `users` where users.tenantId === tenant._id
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tenantId"), tenant._id))
      .collect()
  },
})

/**
 * Create a user record after Clerk invite.
 */
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    if (orgRole !== "org:admin") {
      throw new Error("Forbidden: only admins can add users")
    }

    // Fetch the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()
    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Verify Clerk ID is not already in this tenant
    const existing = await ctx.db
      .query("userTenants")
      .filter((q) => q.and(q.eq(q.field("tenantId"), tenant._id), q.eq(q.field("userId"), args.clerkId)))
      .first()
    if (existing) {
      throw new Error("User already exists in this organization")
    }

    // Insert into userTenants
    await ctx.db.insert("userTenants", {
      userId: args.clerkId,
      tenantId: tenant._id,
      role: args.role,
      createdAt: Date.now(),
    })
    return true
  },
})

/**
 * Update a user's role or profile fields.
 */
export const updateUser = mutation({
  args: {
    userId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    if (orgRole !== "org:admin") {
      throw new Error("Forbidden: only admins can update users")
    }

    // Fetch the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()
    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Verify user is in this tenant
    const ut = await ctx.db
      .query("userTenants")
      .filter((q) => q.and(q.eq(q.field("tenantId"), tenant._id), q.eq(q.field("userId"), args.userId)))
      .first()
    if (!ut) {
      throw new Error("User not found in this organization")
    }

    // Patch role if provided
    if (args.role && args.role !== ut.role) {
      await ctx.db.patch(ut._id, { role: args.role })
    }

    // Update user profile if provided
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.userId))
      .first()

    if (user) {
      const updates: Record<string, any> = {}
      if (args.firstName !== undefined) updates.firstName = args.firstName
      if (args.lastName !== undefined) updates.lastName = args.lastName

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(user._id, updates)
      }
    }

    return true
  },
})

/**
 * List all services for this tenant.
 */
export const listServices = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId } = identity

    // Fetch the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()
    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Return all services for this tenant
    return await ctx.db
      .query("services")
      .filter((q) => q.eq(q.field("tenantId"), tenant._id))
      .collect()
  },
})

/**
 * Create a new service offering.
 */
export const createService = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    basePrice: v.number(),
    category: v.string(),
    estimatedDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only "org:admin" or "org:member" can create services
    if (orgRole !== "org:admin" && orgRole !== "org:member") {
      throw new Error("Forbidden: insufficient permissions")
    }

    // Fetch the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()
    if (!tenant) {
      throw new Error("Tenant not found")
    }

    await ctx.db.insert("services", {
      name: args.name,
      description: args.description,
      basePrice: args.basePrice,
      category: args.category,
      estimatedDuration: args.estimatedDuration,
      tenantId: tenant._id,
      createdAt: Date.now(),
    })
    return true
  },
})

/**
 * Update an existing service.
 */
export const updateService = mutation({
  args: {
    serviceId: v.id("services"),
    name: v.string(),
    description: v.string(),
    basePrice: v.number(),
    category: v.string(),
    estimatedDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    if (orgRole !== "org:admin" && orgRole !== "org:member") {
      throw new Error("Forbidden: insufficient permissions")
    }

    const svc = await ctx.db.get(args.serviceId)
    if (!svc) {
      throw new Error("Service not found")
    }

    // Verify tenant isolation
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()
    if (!tenant || svc.tenantId !== tenant._id) {
      throw new Error("Not authorized to modify this service")
    }

    await ctx.db.patch(args.serviceId, {
      name: args.name,
      description: args.description,
      basePrice: args.basePrice,
      category: args.category,
      estimatedDuration: args.estimatedDuration,
    })
    return true
  },
})

/**
 * Fetch the tenant's settings.
 */
export const getTenantSettings = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId } = identity

    // Fetch the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()
    return tenant || null
  },
})

/**
 * Update branding (logo URL, colors).
 */
export const updateBranding = mutation({
  args: {
    logoUrl: v.string(),
    colors: v.object({
      primary: v.string(),
      secondary: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    if (orgRole !== "org:admin") {
      throw new Error("Forbidden: only admins can update branding")
    }

    // Fetch the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()
    if (!tenant) {
      throw new Error("Tenant not found")
    }

    await ctx.db.patch(tenant._id, {
      imageUrl: args.logoUrl,
      branding: {
        primaryColor: args.colors.primary,
        secondaryColor: args.colors.secondary,
      },
    })
    return true
  },
})

/**
 * Update business rules.
 */
export const updateRules = mutation({
  args: {
    requireDeposit: v.boolean(),
    depositPercentage: v.number(),
    urgencyFeeMultiplier: v.number(),
    stripeAccountId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized: must be signed in");
    }
    const { orgId, orgRole } = identity;

    if (orgRole !== "org:admin") {
