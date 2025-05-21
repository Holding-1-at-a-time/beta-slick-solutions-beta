import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { paginationOptsValidator } from "./lib/pagination"

// Get pricing settings for the tenant
export const getPricingSettings = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId } = args

    // Get the most recent pricing settings for this tenant
    const settings = await ctx.db
      .query("pricingSettings")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .order("desc")
      .first()

    // If no settings exist, return default values
    if (!settings) {
      return {
        serviceRates: {
          diagnostic: 75,
          repair: 95,
          maintenance: 65,
        },
        laborRates: {
          standard: 85,
          premium: 110,
          emergency: 150,
        },
        partsMarkup: 15, // 15% markup
        updatedAt: Date.now(),
        updatedBy: "system",
      }
    }

    return settings
  },
})

// Update pricing settings
export const updatePricingSettings = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    serviceRates: v.object({
      diagnostic: v.number(),
      repair: v.number(),
      maintenance: v.number(),
    }),
    laborRates: v.object({
      standard: v.number(),
      premium: v.number(),
      emergency: v.number(),
    }),
    partsMarkup: v.number(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { orgId, userId, serviceRates, laborRates, partsMarkup, reason } = args

    // Get current settings to log changes
    const currentSettings = await ctx.db
      .query("pricingSettings")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .order("desc")
      .first()

    // Insert new settings
    await ctx.db.insert("pricingSettings", {
      tenantId: orgId,
      serviceRates,
      laborRates,
      partsMarkup,
      updatedAt: Date.now(),
      updatedBy: userId,
    })

    // Log changes if there are existing settings
    if (currentSettings) {
      // Log service rate changes
      for (const [key, newValue] of Object.entries(serviceRates)) {
        const oldValue = currentSettings.serviceRates[key]
        if (oldValue !== newValue) {
          await ctx.db.insert("pricingLogs", {
            tenantId: orgId,
            changeType: "service_rate",
            fieldName: key,
            oldValue,
            newValue,
            reason,
            updatedAt: Date.now(),
            updatedBy: userId,
          })
        }
      }

      // Log labor rate changes
      for (const [key, newValue] of Object.entries(laborRates)) {
        const oldValue = currentSettings.laborRates[key]
        if (oldValue !== newValue) {
          await ctx.db.insert("pricingLogs", {
            tenantId: orgId,
            changeType: "labor_rate",
            fieldName: key,
            oldValue,
            newValue,
            reason,
            updatedAt: Date.now(),
            updatedBy: userId,
          })
        }
      }

      // Log parts markup changes
      if (currentSettings.partsMarkup !== partsMarkup) {
        await ctx.db.insert("pricingLogs", {
          tenantId: orgId,
          changeType: "parts_markup",
          fieldName: "markup_percentage",
          oldValue: currentSettings.partsMarkup,
          newValue: partsMarkup,
          reason,
          updatedAt: Date.now(),
          updatedBy: userId,
        })
      }
    }

    return { success: true }
  },
})

// Get pricing change logs
export const getPricingLogs = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    paginationOpts: v.optional(paginationOptsValidator),
  },
  handler: async (ctx, args) => {
    const { orgId, paginationOpts } = args

    // Query with tenant isolation
    let logsQuery = ctx.db
      .query("pricingLogs")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .order("desc")

    // Apply pagination if provided
    if (paginationOpts) {
      const { limit, cursor } = paginationOpts
      if (cursor) {
        logsQuery = logsQuery.paginate({ cursor, limit })
      } else {
        logsQuery = logsQuery.paginate({ limit })
      }

      const paginationResult = await logsQuery
      return {
        logs: paginationResult.page,
        continueCursor: paginationResult.continueCursor,
      }
    }

    // If no pagination, return all results
    const logs = await logsQuery.collect()
    return { logs, continueCursor: null }
  },
})

// Get a specific pricing log
export const getPricingLog = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    logId: v.id("pricingLogs"),
  },
  handler: async (ctx, args) => {
    const { orgId, logId } = args

    const log = await ctx.db.get(logId)

    // Ensure tenant isolation
    if (!log || log.tenantId !== orgId) {
      return null
    }

    return log
  },
})
