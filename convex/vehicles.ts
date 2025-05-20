import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser } from "./lib/auth"

// List vehicles with search, pagination, and sorting
export const listVehicles = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    skip: v.optional(v.number()),
    limit: v.optional(v.number()),
    sortBy: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      return { vehicles: [], total: 0 }
    }

    // Build the query for vehicles
    let vehiclesQuery = ctx.db
      .query("vehicles")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), userId)))

    // Apply search filter if provided
    if (args.search) {
      const search = args.search.toLowerCase()
      vehiclesQuery = vehiclesQuery.filter((q) =>
        q.or(
          q.contains(q.field("make").lower(), search),
          q.contains(q.field("model").lower(), search),
          q.contains(q.field("licensePlate").lower(), search),
          q.contains(q.field("vin").lower(), search),
        ),
      )
    }

    // Get total count for pagination
    const total = await vehiclesQuery.count()

    // Apply sorting
    const sortBy = args.sortBy || "createdAt"
    const sortOrder = args.sortOrder || "desc"
    vehiclesQuery = vehiclesQuery.order(sortOrder, (q) => q.field(sortBy))

    // Apply pagination
    const skip = args.skip || 0
    const limit = args.limit || 10
    vehiclesQuery = vehiclesQuery.skip(skip).take(limit)

    // Execute the query
    const vehicles = await vehiclesQuery.collect()

    return { vehicles, total }
  },
})

// Get vehicle details by ID
export const getVehicleById = query({
  args: {
    orgId: v.string(),
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      return null
    }

    // Get the vehicle
    const vehicle = await ctx.db.get(args.vehicleId)

    // Verify the vehicle exists and belongs to this user and tenant
    if (!vehicle || vehicle.userId !== userId || vehicle.tenantId !== args.orgId) {
      return null
    }

    return vehicle
  },
})

// Create a new vehicle
export const createVehicle = mutation({
  args: {
    orgId: v.string(),
    make: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new Error("Organization ID mismatch")
    }

    // Create the vehicle
    const vehicleId = await ctx.db.insert("vehicles", {
      tenantId: args.orgId,
      userId,
      make: args.make,
      model: args.model,
      year: args.year,
      vin: args.vin || "",
      licensePlate: args.licensePlate || "",
      color: args.color || "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return vehicleId
  },
})

// Update an existing vehicle
export const updateVehicle = mutation({
  args: {
    orgId: v.string(),
    vehicleId: v.id("vehicles"),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    year: v.optional(v.number()),
    vin: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new Error("Organization ID mismatch")
    }

    // Get the vehicle
    const vehicle = await ctx.db.get(args.vehicleId)

    // Verify the vehicle exists and belongs to this user and tenant
    if (!vehicle || vehicle.userId !== userId || vehicle.tenantId !== args.orgId) {
      throw new Error("Vehicle not found or access denied")
    }

    // Update the vehicle
    await ctx.db.patch(args.vehicleId, {
      ...(args.make !== undefined && { make: args.make }),
      ...(args.model !== undefined && { model: args.model }),
      ...(args.year !== undefined && { year: args.year }),
      ...(args.vin !== undefined && { vin: args.vin }),
      ...(args.licensePlate !== undefined && { licensePlate: args.licensePlate }),
      ...(args.color !== undefined && { color: args.color }),
      updatedAt: Date.now(),
    })

    return args.vehicleId
  },
})

// Delete a vehicle
export const deleteVehicle = mutation({
  args: {
    orgId: v.string(),
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new Error("Organization ID mismatch")
    }

    // Get the vehicle
    const vehicle = await ctx.db.get(args.vehicleId)

    // Verify the vehicle exists and belongs to this user and tenant
    if (!vehicle || vehicle.userId !== userId || vehicle.tenantId !== args.orgId) {
      throw new Error("Vehicle not found or access denied")
    }

    // Delete the vehicle
    await ctx.db.delete(args.vehicleId)

    return args.vehicleId
  },
})
