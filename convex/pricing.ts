import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser, hasPermission } from "./lib/auth"
import { ConvexError } from "convex/values"
import { paginationOptsValidator } from "./lib/pagination"

// Get pricing parameters for the current tenant
export const getPricingParams = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read pricing settings
    if (!hasPermission(orgPermissions, "org:pricing:read")) {
      throw new ConvexError("Permission denied: Cannot read pricing settings")
    }

    // Verify the requested orgId matches the authenticated user's orgId
    if (args.orgId !== orgId) {
      throw new ConvexError("Permission denied: Cannot access pricing settings for other organizations")
    }

    // Get the pricing settings for this tenant
    const settings = await ctx.db
      .query("pricingSettings")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .first()

    // If no settings exist, return default settings
    if (!settings) {
      return {
        tenantBasePrice: {
          diagnostic: 100,
          oil_change: 50,
          tire_rotation: 75,
          brake_service: 150,
          engine_repair: 500,
        },
        urgencyMultipliers: {
          standard: 1.0,
          expedited: 1.25,
          emergency: 1.5,
        },
        discountRules: {
          loyalty: {
            enabled: true,
            threshold: 3, // Number of previous services
            discountPercentage: 10,
          },
          seasonal: {
            enabled: true,
            months: [1, 2, 7, 8], // January, February, July, August
            discountPercentage: 15,
          },
          bundle: {
            enabled: true,
            threshold: 2, // Number of services in one appointment
            discountPercentage: 5,
          },
        },
        laborRate: 125,
        markup: 1.2,
      }
    }

    return settings
  },
})

// Update pricing parameters for the current tenant
export const updatePricingParams = mutation({
  args: {
    orgId: v.string(),
    settings: v.object({
      tenantBasePrice: v.record(v.string(), v.number()),
      urgencyMultipliers: v.record(v.string(), v.number()),
      discountRules: v.object({
        loyalty: v.object({
          enabled: v.boolean(),
          threshold: v.number(),
          discountPercentage: v.number(),
        }),
        seasonal: v.object({
          enabled: v.boolean(),
          months: v.array(v.number()),
          discountPercentage: v.number(),
        }),
        bundle: v.object({
          enabled: v.boolean(),
          threshold: v.number(),
          discountPercentage: v.number(),
        }),
      }),
      laborRate: v.number(),
      markup: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions, orgRole } = getAuthenticatedUser(identity)

    // Only allow admins to update pricing settings
    if (orgRole !== "org:admin" && !hasPermission(orgPermissions, "org:pricing:write")) {
      throw new ConvexError("Permission denied: Cannot update pricing settings")
    }

    // Verify the requested orgId matches the authenticated user's orgId
    if (args.orgId !== orgId) {
      throw new ConvexError("Permission denied: Cannot update pricing settings for other organizations")
    }

    // Get the existing pricing settings for this tenant
    const existingSettings = await ctx.db
      .query("pricingSettings")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .first()

    // If settings exist, update them
    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, {
        tenantBasePrice: args.settings.tenantBasePrice,
        urgencyMultipliers: args.settings.urgencyMultipliers,
        discountRules: args.settings.discountRules,
        laborRate: args.settings.laborRate,
        markup: args.settings.markup,
        updatedAt: Date.now(),
      })
    } else {
      // Otherwise, create new settings
      await ctx.db.insert("pricingSettings", {
        tenantId: orgId,
        tenantBasePrice: args.settings.tenantBasePrice,
        urgencyMultipliers: args.settings.urgencyMultipliers,
        discountRules: args.settings.discountRules,
        laborRate: args.settings.laborRate,
        markup: args.settings.markup,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }

    // Create a pricing log entry
    const logId = await ctx.db.insert("pricingLogs", {
      tenantId: orgId,
      userId,
      action: existingSettings ? "update" : "create",
      settings: args.settings,
      timestamp: Date.now(),
      aiRoute: "dynamicPricingAgent",
      aiParameters: {
        action: "updatePricingSettings",
        previousSettings: existingSettings || null,
        newSettings: args.settings,
      },
      aiOutput: null, // Will be updated by the AI agent
    })

    // Create an activity record
    await ctx.db.insert("activities", {
      userId,
      tenantId: orgId,
      type: "pricing_settings_updated",
      description: "Pricing settings updated",
      entityId: logId,
      entityType: "pricingLogs",
      timestamp: Date.now(),
    })

    return { success: true, logId }
  },
})

// List pricing logs for the current tenant with pagination
export const listPricingLogs = query({
  args: {
    orgId: v.string(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    search: v.optional(v.string()),
    ...paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read pricing logs
    if (!hasPermission(orgPermissions, "org:pricing:read")) {
      throw new ConvexError("Permission denied: Cannot read pricing logs")
    }

    // Verify the requested orgId matches the authenticated user's orgId
    if (args.orgId !== orgId) {
      throw new ConvexError("Permission denied: Cannot access pricing logs for other organizations")
    }

    // Build the query
    let logsQuery = ctx.db.query("pricingLogs").filter((q) => q.eq(q.field("tenantId"), orgId))

    // Apply filters if provided
    if (args.startDate) {
      logsQuery = logsQuery.filter((q) => q.gte(q.field("timestamp"), args.startDate!))
    }

    if (args.endDate) {
      logsQuery = logsQuery.filter((q) => q.lte(q.field("timestamp"), args.endDate!))
    }

    // Count total for pagination
    const total = await logsQuery.collect()
    const totalCount = total.length
    const totalPages = Math.ceil(totalCount / args.limit)

    // Apply pagination
    const skip = (args.page - 1) * args.limit
    const logs = await logsQuery.order("desc").skip(skip).take(args.limit).collect()

    // Fetch user information for each log
    const logsWithUsers = await Promise.all(
      logs.map(async (log) => {
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("clerkId"), log.userId))
          .first()

        return {
          ...log,
          user: user ? { name: user.name, email: user.email } : null,
        }
      }),
    )

    return {
      logs: logsWithUsers,
      totalPages,
      currentPage: args.page,
      totalCount,
    }
  },
})

// Get pricing log by ID
export const getPricingLogById = query({
  args: {
    orgId: v.string(),
    logId: v.id("pricingLogs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read pricing logs
    if (!hasPermission(orgPermissions, "org:pricing:read")) {
      throw new ConvexError("Permission denied: Cannot read pricing logs")
    }

    // Verify the requested orgId matches the authenticated user's orgId
    if (args.orgId !== orgId) {
      throw new ConvexError("Permission denied: Cannot access pricing logs for other organizations")
    }

    // Get the pricing log
    const log = await ctx.db.get(args.logId)

    // Verify the log exists and belongs to this tenant
    if (!log || log.tenantId !== orgId) {
      throw new ConvexError("Pricing log not found or access denied")
    }

    // Get the user who created the log
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), log.userId))
      .first()

    // Get the RL/HER data if available
    let rlData = null
    if (log.aiParameters && log.aiParameters.rlTrainingId) {
      const rlTraining = await ctx.db.get(log.aiParameters.rlTrainingId)
      if (rlTraining) {
        rlData = {
          iterations: rlTraining.iterations,
          reward: rlTraining.reward,
          policy: rlTraining.policy,
        }
      }
    }

    return {
      ...log,
      user: user ? { name: user.name, email: user.email } : null,
      rlData,
    }
  },
})

// Get pricing log steps for streaming UI
export const getPricingLogSteps = query({
  args: {
    orgId: v.string(),
    logId: v.id("pricingLogs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read pricing logs
    if (!hasPermission(orgPermissions, "org:pricing:read")) {
      throw new ConvexError("Permission denied: Cannot read pricing logs")
    }

    // Verify the requested orgId matches the authenticated user's orgId
    if (args.orgId !== orgId) {
      throw new ConvexError("Permission denied: Cannot access pricing logs for other organizations")
    }

    // Get the pricing log
    const log = await ctx.db.get(args.logId)

    // Verify the log exists and belongs to this tenant
    if (!log || log.tenantId !== orgId) {
      throw new ConvexError("Pricing log not found or access denied")
    }

    // If the log has AI output, return the steps
    if (log.aiOutput && log.aiOutput.steps) {
      return log.aiOutput.steps
    }

    // Otherwise, return default steps
    return [
      {
        id: "base_pricing",
        title: "Base Pricing Calculation",
        description: "Calculating base price based on service type and tenant settings",
        data: {
          basePrice: log.settings.tenantBasePrice || {},
          laborRate: log.settings.laborRate || 125,
        },
      },
      {
        id: "urgency_multiplier",
        title: "Urgency Multiplier",
        description: "Applying urgency multiplier based on appointment timing",
        data: {
          urgencyMultipliers: log.settings.urgencyMultipliers || {
            standard: 1.0,
            expedited: 1.25,
            emergency: 1.5,
          },
          selectedUrgency: "standard",
          multiplier: 1.0,
        },
      },
      {
        id: "discount_rules",
        title: "Discount Rules",
        description: "Checking for applicable discounts",
        data: {
          discountRules: log.settings.discountRules || {
            loyalty: {
              enabled: true,
              threshold: 3,
              discountPercentage: 10,
            },
            seasonal: {
              enabled: true,
              months: [1, 2, 7, 8],
              discountPercentage: 15,
            },
            bundle: {
              enabled: true,
              threshold: 2,
              discountPercentage: 5,
            },
          },
          appliedDiscounts: [],
        },
      },
      {
        id: "final_price",
        title: "Final Price Calculation",
        description: "Calculating final price after all adjustments",
        data: {
          basePrice: 100,
          afterUrgency: 100,
          afterDiscounts: 100,
          finalPrice: 100,
        },
      },
    ]
  },
})
