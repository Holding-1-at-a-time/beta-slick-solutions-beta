import { query } from "./_generated/server"
import { v } from "convex/values"

// Get user profile by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first()

    return user
  },
})

// List vehicles for a user with tenant isolation
export const listVehicles = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated")
    }

    const orgId = identity.tokenIdentifier.split("|")[1]

    return await ctx.db
      .query("vehicles")
      .filter((q) => q.and(q.eq(q.field("userId"), args.userId), q.eq(q.field("tenantId"), orgId)))
      .collect()
  },
})

// List test records with tenant isolation
export const listTestRecords = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated")
    }

    const orgId = identity.tokenIdentifier.split("|")[1]

    return await ctx.db
      .query("testRecords")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .order("desc")
      .collect()
  },
})

// Get client dashboard overview
export const getClientOverview = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error("Not authenticated")
    }

    const userId = identity.subject
    const orgId = identity.tokenIdentifier.split("|")[1]

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
