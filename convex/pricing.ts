import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser, hasPermission } from "./lib/auth"
import { ConvexError } from "convex/values"
import { paginationOptsValidator } from "./lib/pagination"

// Get pricing settings for the current tenant
export const getPricingSettings = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read pricing settings
    if (!hasPermission(orgPermissions, "org:pricing:read")) {
      throw new ConvexError("Permission denied: Cannot read pricing settings")
    }

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot access pricing settings")
    }

    // Get the pricing settings for this tenant
    const settings = await ctx.db
      .query("pricingSettings")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .first()

    // If no settings exist, return default settings
    if (!settings) {
      return {
        baseRates: {
          diagnostic: 100,
          oil_change: 50,
          tire_rotation: 75,
          brake_service: 150,
          engine_repair: 500,
        },
        laborRate: 125,
        markup: 1.2,
      }
    }

    return settings
  },
})

// Update pricing settings for the current tenant
export const updatePricingSettings = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    settings: v.object({
      baseRates: v.record(v.string(), v.number()),
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

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot update pricing settings")
    }

    // Get the existing pricing settings for this tenant
    const existingSettings = await ctx.db
      .query("pricingSettings")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .first()

    // If settings exist, update them
    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, {
        baseRates: args.settings.baseRates,
        laborRate: args.settings.laborRate,
        markup: args.settings.markup,
        updatedAt: Date.now(),
      })
    } else {
      // Otherwise, create new settings
      await ctx.db.insert("pricingSettings", {
        tenantId: orgId,
        baseRates: args.settings.baseRates,
        laborRate: args.settings.laborRate,
        markup: args.settings.markup,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }

    // Create a pricing log entry
    await ctx.db.insert("pricingLogs", {
      tenantId: orgId,
      userId,
      action: existingSettings ? "update" : "create",
      settings: args.settings,
      timestamp: Date.now(),
    })

    return { success: true }
  },
})

// List pricing logs for the current tenant with pagination
export const listPricingLogs = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    search: v.optional(v.string()),
    ...paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read pricing logs
    if (!hasPermission(orgPermissions, "org:pricing:read")) {
      throw new ConvexError("Permission denied: Cannot read pricing logs")
    }

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot access pricing logs")
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
    userId: v.string(),
    logId: v.id("pricingLogs"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read pricing logs
    if (!hasPermission(orgPermissions, "org:pricing:read")) {
      throw new ConvexError("Permission denied: Cannot read pricing logs")
    }

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot access pricing logs")
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

    return {
      ...log,
      user: user ? { name: user.name, email: user.email } : null,
    }
  },
})
