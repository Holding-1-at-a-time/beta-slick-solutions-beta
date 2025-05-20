import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser } from "./lib/auth"

// Get detailed assessment information including AI-detected issues
export const getAssessmentDetails = query({
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

    // Get AI-detected issues
    const issues = await ctx.db
      .query("assessmentIssues")
      .filter((q) => q.eq(q.field("assessmentId"), args.assessmentId))
      .collect()

    // Get estimate if available
    const estimate = await ctx.db
      .query("estimates")
      .filter((q) => q.eq(q.field("assessmentId"), args.assessmentId))
      .first()

    return {
      assessment,
      vehicle,
      issues,
      estimate,
    }
  },
})

// Get estimate details for an assessment
export const getEstimateDetails = query({
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

    // Get the estimate
    const estimate = await ctx.db
      .query("estimates")
      .filter((q) => q.eq(q.field("assessmentId"), args.assessmentId))
      .first()

    if (!estimate) {
      return null
    }

    // Get line items
    const lineItems = await ctx.db
      .query("estimateLineItems")
      .filter((q) => q.eq(q.field("estimateId"), estimate._id))
      .collect()

    return {
      assessment,
      vehicle,
      estimate,
      lineItems,
    }
  },
})

// Request a revision to an estimate
export const requestEstimateRevision = mutation({
  args: {
    orgId: v.string(),
    assessmentId: v.id("assessments"),
    revisionNotes: v.string(),
    issueAdjustments: v.array(
      v.object({
        issueId: v.id("assessmentIssues"),
        newSeverity: v.optional(v.string()),
        remove: v.optional(v.boolean()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new Error("Organization ID mismatch")
    }

    // Get the assessment
    const assessment = await ctx.db.get(args.assessmentId)
    if (!assessment) {
      throw new Error("Assessment not found")
    }

    // Get the vehicle to verify ownership
    const vehicle = await ctx.db.get(assessment.vehicleId)
    if (!vehicle || vehicle.userId !== userId || vehicle.tenantId !== args.orgId) {
      throw new Error("Vehicle not found or access denied")
    }

    // Get the estimate
    const estimate = await ctx.db
      .query("estimates")
      .filter((q) => q.eq(q.field("assessmentId"), args.assessmentId))
      .first()

    if (!estimate) {
      throw new Error("Estimate not found")
    }

    // Create a revision record
    const revisionId = await ctx.db.insert("estimateRevisions", {
      tenantId: args.orgId,
      userId,
      estimateId: estimate._id,
      assessmentId: args.assessmentId,
      revisionNotes: args.revisionNotes,
      status: "pending",
      createdAt: Date.now(),
    })

    // Process issue adjustments
    for (const adjustment of args.issueAdjustments) {
      // Verify the issue belongs to this assessment
      const issue = await ctx.db.get(adjustment.issueId)
      if (!issue || issue.assessmentId !== args.assessmentId) {
        continue
      }

      await ctx.db.insert("revisionAdjustments", {
        tenantId: args.orgId,
        revisionId,
        issueId: adjustment.issueId,
        originalSeverity: issue.severity,
        newSeverity: adjustment.newSeverity,
        remove: adjustment.remove || false,
      })
    }

    // Update assessment status
    await ctx.db.patch(args.assessmentId, {
      status: "revision_requested",
      updatedAt: Date.now(),
    })

    // Update estimate status
    await ctx.db.patch(estimate._id, {
      status: "revision_requested",
      updatedAt: Date.now(),
    })

    return revisionId
  },
})

// Approve an estimate
export const approveEstimate = mutation({
  args: {
    orgId: v.string(),
    assessmentId: v.id("assessments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new Error("Organization ID mismatch")
    }

    // Get the assessment
    const assessment = await ctx.db.get(args.assessmentId)
    if (!assessment) {
      throw new Error("Assessment not found")
    }

    // Get the vehicle to verify ownership
    const vehicle = await ctx.db.get(assessment.vehicleId)
    if (!vehicle || vehicle.userId !== userId || vehicle.tenantId !== args.orgId) {
      throw new Error("Vehicle not found or access denied")
    }

    // Get the estimate
    const estimate = await ctx.db
      .query("estimates")
      .filter((q) => q.eq(q.field("assessmentId"), args.assessmentId))
      .first()

    if (!estimate) {
      throw new Error("Estimate not found")
    }

    // Update assessment status
    await ctx.db.patch(args.assessmentId, {
      status: "estimate_approved",
      updatedAt: Date.now(),
    })

    // Update estimate status
    await ctx.db.patch(estimate._id, {
      status: "approved",
      approvedAt: Date.now(),
      updatedAt: Date.now(),
    })

    return estimate._id
  },
})
