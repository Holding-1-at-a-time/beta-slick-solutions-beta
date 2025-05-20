import { mutation } from "./_generated/server"
import { v } from "convex/values"

// Create a new user
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      imageUrl: args.imageUrl,
      role: args.role,
      createdAt: Date.now(),
    })
  },
})

// Create a new vehicle
export const createVehicle = mutation({
  args: {
    make: v.string(),
    model: v.string(),
    year: v.number(),
    licensePlate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated")
    }

    const userId = identity.subject
    const orgId = identity.tokenIdentifier.split("|")[1]

    return await ctx.db.insert("vehicles", {
      make: args.make,
      model: args.model,
      year: args.year,
      licensePlate: args.licensePlate,
      userId,
      tenantId: orgId,
      createdAt: Date.now(),
    })
  },
})

// Create a test record for tenant isolation testing
export const createTestRecord = mutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated")
    }

    const userId = identity.subject
    const orgId = identity.tokenIdentifier.split("|")[1]

    return await ctx.db.insert("testRecords", {
      message: args.message,
      userId,
      tenantId: orgId,
      createdAt: Date.now(),
    })
  },
})

// Create a new assessment
export const createAssessment = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    description: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated")
    }

    const userId = identity.subject
    const orgId = identity.tokenIdentifier.split("|")[1]

    // Verify the vehicle belongs to this tenant
    const vehicle = await ctx.db.get(args.vehicleId)
    if (!vehicle || vehicle.tenantId !== orgId) {
      throw new Error("Vehicle not found or access denied")
    }

    return await ctx.db.insert("assessments", {
      vehicleId: args.vehicleId,
      status: "pending",
      description: args.description,
      images: args.images,
      userId,
      tenantId: orgId,
      createdAt: Date.now(),
    })
  },
})

// Update a user
export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    const updates: any = {}
    if (args.email !== undefined) updates.email = args.email
    if (args.firstName !== undefined) updates.firstName = args.firstName
    if (args.lastName !== undefined) updates.lastName = args.lastName
    if (args.imageUrl !== undefined) updates.imageUrl = args.imageUrl

    return await ctx.db.patch(user._id, updates)
  },
})

// Mark a user as deleted
export const markUserDeleted = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    // Instead of actually deleting, mark as deleted
    return await ctx.db.patch(user._id, {
      isDeleted: true,
      deletedAt: Date.now(),
    })
  },
})

// Create a tenant (organization)
export const createTenant = mutation({
  args: {
    clerkOrgId: v.string(),
    name: v.string(),
    slug: v.string(),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tenants", {
      clerkOrgId: args.clerkOrgId,
      name: args.name,
      slug: args.slug,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    })
  },
})

// Add a user to a tenant
export const addUserToTenant = mutation({
  args: {
    clerkUserId: v.string(),
    clerkOrgId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkUserId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    return await ctx.db.insert("userTenants", {
      userId: user._id,
      tenantId: args.clerkOrgId,
      role: args.role,
      createdAt: Date.now(),
    })
  },
})
