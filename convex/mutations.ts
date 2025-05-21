import { mutation } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser, hasPermission } from "./lib/auth"
import { ConvexError } from "convex/values"

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
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to create vehicles
    if (!hasPermission(orgPermissions, "org:vehicles:write")) {
      throw new ConvexError("Permission denied: Cannot create vehicles")
    }

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
    const { userId, orgId } = getAuthenticatedUser(identity)

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
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to create assessments
    if (!hasPermission(orgPermissions, "org:assessments:write")) {
      throw new ConvexError("Permission denied: Cannot create assessments")
    }

    // Verify the vehicle belongs to this tenant
    const vehicle = await ctx.db.get(args.vehicleId)
    if (!vehicle || vehicle.tenantId !== orgId) {
      throw new ConvexError("Vehicle not found or access denied")
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

// Create an appointment
export const createAppointment = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    date: v.number(),
    serviceType: v.string(),
    assessmentId: v.optional(v.id("assessments")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions, userType } = getAuthenticatedUser(identity)

    // Check if user has permission to create appointments
    if (!hasPermission(orgPermissions, "org:appointments:write")) {
      throw new ConvexError("Permission denied: Cannot create appointments")
    }

    // Verify the vehicle belongs to this tenant
    const vehicle = await ctx.db.get(args.vehicleId)
    if (!vehicle || vehicle.tenantId !== orgId) {
      throw new ConvexError("Vehicle not found or access denied")
    }

    // If assessment ID is provided, verify it belongs to this tenant
    if (args.assessmentId) {
      const assessment = await ctx.db.get(args.assessmentId)
      if (!assessment || assessment.tenantId !== orgId) {
        throw new ConvexError("Assessment not found or access denied")
      }
    }

    return await ctx.db.insert("appointments", {
      vehicleId: args.vehicleId,
      assessmentId: args.assessmentId,
      date: args.date,
      status: "scheduled",
      serviceType: args.serviceType,
      userId,
      tenantId: orgId,
      createdAt: Date.now(),
    })
  },
})
