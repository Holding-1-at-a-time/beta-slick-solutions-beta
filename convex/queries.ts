import { query } from "./_generated/server"
import { getAuthenticatedUser, hasPermission } from "./lib/auth"
import { ConvexError } from "convex/values"
import { v } from "convex/values"

// Get user profile
export const getUserProfile = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgRole, userType } = getAuthenticatedUser(identity)

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), userId))
      .first()

    return {
      ...user,
      orgRole,
      userType,
    }
  },
})

// List vehicles for the current user with tenant isolation
export const listVehiclesForCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read vehicles
    if (!hasPermission(orgPermissions, "org:vehicles:read")) {
      throw new ConvexError("Permission denied: Cannot read vehicles")
    }

    return await ctx.db
      .query("vehicles")
      .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("tenantId"), orgId)))
      .collect()
  },
})

// List all vehicles for the organization (admin/staff only)
export const listAllVehicles = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Only allow admins or members with proper permissions
    if (orgRole !== "org:admin" && !hasPermission(orgPermissions, "org:vehicles:read")) {
      throw new ConvexError("Permission denied: Cannot read all vehicles")
    }

    return await ctx.db
      .query("vehicles")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .collect()
  },
})

// Get client dashboard overview
export const getClientOverview = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId } = getAuthenticatedUser(identity)

    const vehicles = await ctx.db
      .query("vehicles")
      .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("tenantId"), orgId)))
      .collect()

    const appointments = await ctx.db
      .query("appointments")
      .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("tenantId"), orgId)))
      .collect()

    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("tenantId"), orgId)))
      .collect()

    return {
      vehicleCount: vehicles.length,
      appointmentCount: appointments.length,
      invoiceCount: invoices.length,
    }
  },
})

// Get admin dashboard overview
export const getAdminOverview = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    const { orgId, orgRole } = getAuthenticatedUser(identity)

    // Only allow admins
    if (orgRole !== "org:admin") {
      throw new ConvexError("Permission denied: Admin access required")
    }

    const vehicles = await ctx.db
      .query("vehicles")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .collect()

    const appointments = await ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .collect()

    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .collect()

    // Count users by role
    const userTenants = await ctx.db
      .query("userTenants")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .collect()

    const adminCount = userTenants.filter((ut) => ut.role === "org:admin").length
    const memberCount = userTenants.filter((ut) => ut.role === "org:member").length
    const clientCount = userTenants.filter((ut) => ut.role === "org:client").length

    return {
      vehicleCount: vehicles.length,
      appointmentCount: appointments.length,
      invoiceCount: invoices.length,
      adminCount,
      memberCount,
      clientCount,
      totalUsers: userTenants.length,
    }
  },
})

// Add this query to your existing queries
export const getDashboardData = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not authenticated")
    }

    // Get user's vehicles
    const vehicles = await ctx.db
      .query("vehicles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect()

    // Get user's appointments
    const appointments = await ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect()

    // Get user's invoices
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect()

    // Get recent activities
    const activities = await ctx.db
      .query("activities")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .take(5)

    // Format upcoming appointments
    const upcomingAppointments = appointments
      .filter((appointment) => new Date(appointment.date) > new Date())
      .slice(0, 3)
      .map((appointment) => ({
        id: appointment._id,
        vehicleName:
          vehicles.find((v) => v._id === appointment.vehicleId)?.make +
            " " +
            vehicles.find((v) => v._id === appointment.vehicleId)?.model || "Unknown Vehicle",
        serviceName: appointment.serviceType,
        date: new Date(appointment.date).toLocaleDateString(),
        time: appointment.time,
      }))

    // Format recent activities
    const recentActivities = activities.map((activity) => ({
      id: activity._id,
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp,
    }))

    return {
      vehicleCount: vehicles.length,
      appointmentCount: appointments.length,
      invoiceCount: invoices.length,
      upcomingAppointments,
      recentActivities,
    }
  },
})
