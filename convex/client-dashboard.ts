import { query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser } from "./lib/auth"

// Get client's vehicles with optional limit
export const getClientVehicles = query({
  args: {
    orgId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      return []
    }

    // Query vehicles for this user in this tenant
    let vehiclesQuery = ctx.db
      .query("vehicles")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), userId)))
      .order("desc", (q) => q.field("createdAt"))

    // Apply limit if provided
    if (args.limit !== undefined) {
      vehiclesQuery = vehiclesQuery.take(args.limit)
    }

    return await vehiclesQuery.collect()
  },
})

// Get client's upcoming appointments with optional limit
export const getClientUpcomingAppointments = query({
  args: {
    orgId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      return []
    }

    const now = Date.now()

    // Query upcoming appointments for this user in this tenant
    let appointmentsQuery = ctx.db
      .query("appointments")
      .filter((q) =>
        q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), userId), q.gt(q.field("date"), now)),
      )
      .order("asc", (q) => q.field("date"))

    // Apply limit if provided
    if (args.limit !== undefined) {
      appointmentsQuery = appointmentsQuery.take(args.limit)
    }

    const appointments = await appointmentsQuery.collect()

    // Fetch vehicle details for each appointment
    const appointmentsWithVehicles = await Promise.all(
      appointments.map(async (appointment) => {
        const vehicle = await ctx.db.get(appointment.vehicleId)
        return {
          ...appointment,
          vehicle,
        }
      }),
    )

    return appointmentsWithVehicles
  },
})

// Get client's outstanding invoices with optional limit
export const getClientOutstandingInvoices = query({
  args: {
    orgId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      return []
    }

    // Query outstanding invoices for this user in this tenant
    // Outstanding = status is "sent" or "overdue"
    let invoicesQuery = ctx.db
      .query("invoices")
      .filter((q) =>
        q.and(
          q.eq(q.field("tenantId"), args.orgId),
          q.eq(q.field("userId"), userId),
          q.or(q.eq(q.field("status"), "sent"), q.eq(q.field("status"), "overdue")),
        ),
      )
      .order("asc", (q) => q.field("dueDate"))

    // Apply limit if provided
    if (args.limit !== undefined) {
      invoicesQuery = invoicesQuery.take(args.limit)
    }

    return await invoicesQuery.collect()
  },
})

// Get client dashboard summary (all data needed for the dashboard)
export const getClientDashboardSummary = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId } = getAuthenticatedUser(identity)

    // Verify the requested orgId matches the user's current orgId
    if (args.orgId !== userOrgId) {
      return {
        vehicles: [],
        upcomingAppointments: [],
        outstandingInvoices: [],
        stats: {
          totalVehicles: 0,
          upcomingAppointments: 0,
          outstandingInvoices: 0,
        },
      }
    }

    const now = Date.now()

    // Get recent vehicles (limit 3)
    const vehicles = await ctx.db
      .query("vehicles")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), userId)))
      .order("desc", (q) => q.field("createdAt"))
      .take(3)
      .collect()

    // Get upcoming appointments (limit 3)
    const appointments = await ctx.db
      .query("appointments")
      .filter((q) =>
        q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), userId), q.gt(q.field("date"), now)),
      )
      .order("asc", (q) => q.field("date"))
      .take(3)
      .collect()

    // Get appointment vehicles
    const appointmentsWithVehicles = await Promise.all(
      appointments.map(async (appointment) => {
        const vehicle = await ctx.db.get(appointment.vehicleId)
        return {
          ...appointment,
          vehicle,
        }
      }),
    )

    // Get outstanding invoices (limit 3)
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) =>
        q.and(
          q.eq(q.field("tenantId"), args.orgId),
          q.eq(q.field("userId"), userId),
          q.or(q.eq(q.field("status"), "sent"), q.eq(q.field("status"), "overdue")),
        ),
      )
      .order("asc", (q) => q.field("dueDate"))
      .take(3)
      .collect()

    // Get counts for stats
    const totalVehicles = await ctx.db
      .query("vehicles")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), userId)))
      .count()

    const totalUpcomingAppointments = await ctx.db
      .query("appointments")
      .filter((q) =>
        q.and(q.eq(q.field("tenantId"), args.orgId), q.eq(q.field("userId"), userId), q.gt(q.field("date"), now)),
      )
      .count()

    const totalOutstandingInvoices = await ctx.db
      .query("invoices")
      .filter((q) =>
        q.and(
          q.eq(q.field("tenantId"), args.orgId),
          q.eq(q.field("userId"), userId),
          q.or(q.eq(q.field("status"), "sent"), q.eq(q.field("status"), "overdue")),
        ),
      )
      .count()

    return {
      vehicles,
      upcomingAppointments: appointmentsWithVehicles,
      outstandingInvoices: invoices,
      stats: {
        totalVehicles,
        upcomingAppointments: totalUpcomingAppointments,
        outstandingInvoices: totalOutstandingInvoices,
      },
    }
  },
})
