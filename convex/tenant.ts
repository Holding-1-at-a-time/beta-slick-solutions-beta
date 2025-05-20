import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser, hasPermission } from "./lib/auth"
import { ConvexError } from "convex/values"

// Get tenant settings
export const getTenantSettings = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Permission denied: Cannot access settings for this organization")
    }

    // Fetch tenant settings
    const tenantSettings = await ctx.db
      .query("tenantSettings")
      .filter((q) => q.eq(q.field("tenantId"), args.orgId))
      .first()

    if (!tenantSettings) {
      // Return default settings if none exist
      return {
        tenantId: args.orgId,
        theme: "light",
        primaryColor: "#00AE98",
        logoUrl: null,
        customDomain: null,
        features: {
          analytics: true,
          appointments: true,
          invoices: true,
        },
      }
    }

    return tenantSettings
  },
})

// Get tenant dashboard summary
export const getTenantDashboardSummary = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Permission denied: Cannot access data for this organization")
    }

    // Get counts with tenant isolation
    const vehicleCount = await ctx.db
      .query("vehicles")
      .filter((q) => q.eq(q.field("tenantId"), args.orgId))
      .count()

    const appointmentCount = await ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("tenantId"), args.orgId))
      .count()

    const userCount = await ctx.db
      .query("userTenants")
      .filter((q) => q.eq(q.field("tenantId"), args.orgId))
      .count()

    // Get recent activities
    const recentActivities = await ctx.db
      .query("activities")
      .filter((q) => q.eq(q.field("tenantId"), args.orgId))
      .order("desc")
      .take(5)

    // Get upcoming appointments (next 7 days)
    const now = Date.now()
    const oneWeekFromNow = now + 7 * 24 * 60 * 60 * 1000

    const upcomingAppointments = await ctx.db
      .query("appointments")
      .filter((q) =>
        q.and(q.eq(q.field("tenantId"), args.orgId), q.gt(q.field("date"), now), q.lt(q.field("date"), oneWeekFromNow)),
      )
      .order("asc")
      .take(5)

    // Return different data based on user role
    if (orgRole === "org:admin" || hasPermission(orgPermissions, "org:insights:read")) {
      // Admin/staff view with more detailed stats
      const invoiceCount = await ctx.db
        .query("invoices")
        .filter((q) => q.eq(q.field("tenantId"), args.orgId))
        .count()

      const pendingInvoiceCount = await ctx.db
        .query("invoices")
        .filter((q) => q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("status"), "pending")))
        .count()

      return {
        vehicleCount,
        appointmentCount,
        userCount,
        invoiceCount,
        pendingInvoiceCount,
        recentActivities,
        upcomingAppointments,
      }
    } else {
      // Client view with limited stats
      return {
        vehicleCount,
        appointmentCount,
        recentActivities,
        upcomingAppointments,
      }
    }
  },
})

// Update tenant settings (admin only)
export const updateTenantSettings = mutation({
  args: {
    orgId: v.string(),
    settings: v.object({
      theme: v.optional(v.string()),
      primaryColor: v.optional(v.string()),
      logoUrl: v.optional(v.union(v.string(), v.null())),
      customDomain: v.optional(v.union(v.string(), v.null())),
      features: v.optional(
        v.object({
          analytics: v.optional(v.boolean()),
          appointments: v.optional(v.boolean()),
          invoices: v.optional(v.boolean()),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId: userOrgId, orgRole } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Permission denied: Cannot update settings for this organization")
    }

    // Only admins can update tenant settings
    if (orgRole !== "org:admin") {
      throw new ConvexError("Permission denied: Admin access required to update tenant settings")
    }

    // Check if settings already exist
    const existingSettings = await ctx.db
      .query("tenantSettings")
      .filter((q) => q.eq(q.field("tenantId"), args.orgId))
      .first()

    if (existingSettings) {
      // Update existing settings
      return await ctx.db.patch(existingSettings._id, {
        ...args.settings,
        updatedAt: Date.now(),
      })
    } else {
      // Create new settings
      return await ctx.db.insert("tenantSettings", {
        tenantId: args.orgId,
        ...args.settings,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }
  },
})

// Log tenant activity
export const logTenantActivity = mutation({
  args: {
    orgId: v.string(),
    type: v.string(),
    description: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Permission denied: Cannot log activity for this organization")
    }

    return await ctx.db.insert("activities", {
      tenantId: args.orgId,
      userId,
      type: args.type,
      description: args.description,
      metadata: args.metadata,
      timestamp: Date.now(),
    })
  },
})
