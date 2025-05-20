import { query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser } from "./lib/auth"
import { ConvexError } from "convex/values"

// Get tenant dashboard data
export const getTenantDashboard = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Permission denied: Cannot access dashboard for this organization")
    }

    // Get tenant settings
    const tenantSettings = await ctx.db
      .query("tenantSettings")
      .filter((q) => q.eq(q.field("tenantId"), args.orgId))
      .first()

    // Get user's role-specific data
    if (orgRole === "org:admin" || orgRole === "org:member") {
      // Admin/staff view
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

      // Get today's appointments
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)

      const todayAppointments = await ctx.db
        .query("appointments")
        .filter((q) =>
          q.and(
            q.eq(q.field("tenantId"), args.orgId),
            q.gte(q.field("date"), startOfDay.getTime()),
            q.lte(q.field("date"), endOfDay.getTime()),
          ),
        )
        .collect()

      // Get recent activities
      const recentActivities = await ctx.db
        .query("activities")
        .filter((q) => q.eq(q.field("tenantId"), args.orgId))
        .order("desc")
        .take(10)

      return {
        role: orgRole,
        tenantSettings,
        stats: {
          vehicleCount,
          appointmentCount,
          userCount,
          todayAppointmentCount: todayAppointments.length,
        },
        todayAppointments,
        recentActivities,
      }
    } else {
      // Client view
      const vehicles = await ctx.db
        .query("vehicles")
        .filter((q) => q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), userId)))
        .collect()

      const appointments = await ctx.db
        .query("appointments")
        .filter((q) => q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), userId)))
        .collect()

      const invoices = await ctx.db
        .query("invoices")
        .filter((q) => q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), userId)))
        .collect()

      // Get upcoming appointments
      const now = Date.now()
      const upcomingAppointments = appointments
        .filter((appointment) => appointment.date > now)
        .sort((a, b) => a.date - b.date)
        .slice(0, 3)

      return {
        role: orgRole,
        tenantSettings,
        stats: {
          vehicleCount: vehicles.length,
          appointmentCount: appointments.length,
          invoiceCount: invoices.length,
        },
        vehicles,
        upcomingAppointments,
      }
    }
  },
})
