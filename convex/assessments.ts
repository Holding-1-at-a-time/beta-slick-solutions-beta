import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser } from "./lib/auth"

// List assessments for a vehicle
export const listVehicleAssessments = query({
  args: {
    orgId: v.string(),
    vehicleId: v.id("vehicles"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      return []
    }

    // Get the vehicle to verify ownership
    const vehicle = await ctx.db.get(args.vehicleId)
    if (!vehicle || vehicle.userId !== userId || vehicle.tenantId !== args.orgId) {
      return []
    }

    // Get assessments for this vehicle
    const assessments = await ctx.db
      .query("assessments")
      .filter((q) => q.eq(q.field("vehicleId"), args.vehicleId))
      .order("desc", (q) => q.field("createdAt"))
      .collect()

    return assessments
  },
})

// Get assessment details
export const getAssessmentById = query({
  args: {
    orgId: v.string(),
    assessmentId: v.id("assessments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      return null
    }

    // Get the assessment
    const assessment = await ctx.db.get(args.assessmentId)
    if (!assessment) {
      return null
    }

    // Get the vehicle to verify ownership
    const vehicle = await ctx.db.get(assessment.vehicleId)
    if (!vehicle || vehicle.userId !== userId || vehicle.tenantId !== args.orgId) {
      return null
    }

    return {
      ...assessment,
      vehicle,
    }
  },
})

// Create a new assessment
export const createAssessment = mutation({
  args: {
    orgId: v.string(),
    vehicleId: v.id("vehicles"),
    description: v.string(),
    severity: v.string(),
    images: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new Error("Organization ID mismatch")
    }

    // Get the vehicle to verify ownership
    const vehicle = await ctx.db.get(args.vehicleId)
    if (!vehicle || vehicle.userId !== userId || vehicle.tenantId !== args.orgId) {
      throw new Error("Vehicle not found or access denied")
    }

    // Create the assessment
    const assessmentId = await ctx.db.insert("assessments", {
      tenantId: args.orgId,
      userId,
      vehicleId: args.vehicleId,
      description: args.description,
      severity: args.severity,
      images: args.images || [],
      status: "pending", // Initial status
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return assessmentId
  },
})
