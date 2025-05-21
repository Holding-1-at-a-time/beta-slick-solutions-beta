import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser, hasPermission } from "./lib/auth"
import { ConvexError } from "convex/values"
import { paginationOptsValidator } from "./lib/pagination"

// Create a payment intent for deposits
export const createPaymentIntent = mutation({
  args: {
    orgId: v.string(),
    appointmentId: v.id("appointments"),
    amount: v.number(),
    currency: v.string(),
    metadata: v.optional(v.object({})),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify tenant isolation
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Organization ID mismatch")
    }

    // Get the appointment
    const appointment = await ctx.db.get(args.appointmentId)

    if (!appointment) {
      throw new ConvexError("Appointment not found")
    }

    // Verify tenant isolation at the record level
    if (appointment.tenantId !== args.orgId) {
      throw new ConvexError("Appointment not found in this organization")
    }

    // Check if user has permission to create a payment for this appointment
    const canCreatePayment =
      appointment.userId === userId || orgRole === "org:admin" || hasPermission(orgPermissions, "org:payments:write")

    if (!canCreatePayment) {
      throw new ConvexError("Permission denied: Cannot create payment for this appointment")
    }

    // In a real implementation, you would call Stripe API here to create a payment intent
    // For this example, we'll simulate it
    const paymentIntentId = `pi_${Math.random().toString(36).substring(2, 15)}`

    // Create a payment record
    const paymentId = await ctx.db.insert("payments", {
      tenantId: args.orgId,
      userId,
      appointmentId: args.appointmentId,
      amount: args.amount,
      currency: args.currency,
      status: "pending",
      paymentMethod: "card",
      paymentIntentId,
      metadata: args.metadata,
      createdAt: Date.now(),
    })

    // Create an activity record
    await ctx.db.insert("activities", {
      userId,
      tenantId: args.orgId,
      type: "payment_intent_created",
      description: `Payment intent created for ${args.amount} ${args.currency}`,
      entityId: paymentId,
      entityType: "payments",
      timestamp: Date.now(),
    })

    return {
      paymentId,
      paymentIntentId,
      clientSecret: `${paymentIntentId}_secret_${Math.random().toString(36).substring(2, 15)}`,
    }
  },
})

// Confirm a payment after processing
export const confirmPayment = mutation({
  args: {
    orgId: v.string(),
    paymentId: v.id("payments"),
    paymentIntentId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify tenant isolation
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Organization ID mismatch")
    }

    // Get the payment
    const payment = await ctx.db.get(args.paymentId)

    if (!payment) {
      throw new ConvexError("Payment not found")
    }

    // Verify tenant isolation at the record level
    if (payment.tenantId !== args.orgId) {
      throw new ConvexError("Payment not found in this organization")
    }

    // Verify payment intent ID
    if (payment.paymentIntentId !== args.paymentIntentId) {
      throw new ConvexError("Payment intent ID mismatch")
    }

    // Check if user has permission to confirm this payment
    const canConfirmPayment =
      payment.userId === userId || orgRole === "org:admin" || hasPermission(orgPermissions, "org:payments:write")

    if (!canConfirmPayment) {
      throw new ConvexError("Permission denied: Cannot confirm this payment")
    }

    // Update the payment status
    const updatedPayment = await ctx.db.patch(args.paymentId, {
      status: args.status,
    })

    // If payment was successful and for an appointment, update the appointment
    if (args.status === "succeeded" && payment.appointmentId) {
      const appointment = await ctx.db.get(payment.appointmentId)

      if (appointment) {
        // Update appointment to indicate deposit paid
        await ctx.db.patch(payment.appointmentId, {
          depositPaid: true,
        })

        // Create a notification for the staff member
        if (appointment.assignedToId) {
          await ctx.db.insert("notifications", {
            tenantId: args.orgId,
            userId: appointment.assignedToId,
            title: "Deposit Paid",
            message: `Deposit of ${payment.amount} ${payment.currency} has been paid for appointment on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`,
            type: "payment",
            relatedId: payment.appointmentId,
            isRead: false,
            createdAt: Date.now(),
          })
        }
      }
    }

    // Create an activity record
    await ctx.db.insert("activities", {
      userId,
      tenantId: args.orgId,
      type: "payment_confirmed",
      description: `Payment of ${payment.amount} ${payment.currency} confirmed with status: ${args.status}`,
      entityId: args.paymentId,
      entityType: "payments",
      timestamp: Date.now(),
    })

    return updatedPayment
  },
})

// Get details about a specific payment
export const getPayment = query({
  args: {
    orgId: v.string(),
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify tenant isolation
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Organization ID mismatch")
    }

    // Get the payment
    const payment = await ctx.db.get(args.paymentId)

    if (!payment) {
      throw new ConvexError("Payment not found")
    }

    // Verify tenant isolation at the record level
    if (payment.tenantId !== args.orgId) {
      throw new ConvexError("Payment not found in this organization")
    }

    // Check if user has permission to view this payment
    const canViewPayment =
      payment.userId === userId || orgRole === "org:admin" || hasPermission(orgPermissions, "org:payments:read")

    if (!canViewPayment) {
      throw new ConvexError("Permission denied: Cannot view this payment")
    }

    // Get related appointment if exists
    let appointment = null
    if (payment.appointmentId) {
      appointment = await ctx.db.get(payment.appointmentId)
    }

    // Get related invoice if exists
    let invoice = null
    if (payment.invoiceId) {
      invoice = await ctx.db.get(payment.invoiceId)
    }

    return {
      ...payment,
      appointment: appointment
        ? {
            id: appointment._id,
            date: appointment.date,
            time: appointment.time,
            serviceType: appointment.serviceType,
          }
        : null,
      invoice: invoice
        ? {
            id: invoice._id,
            amount: invoice.amount,
            status: invoice.status,
          }
        : null,
    }
  },
})

// List payments for a user with pagination
export const listPayments = query({
  args: {
    orgId: v.string(),
    userId: v.optional(v.string()),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify tenant isolation
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Organization ID mismatch")
    }

    // Determine which user's payments to fetch
    let targetUserId = userId

    // If a specific userId is provided and the user has permission to view others' payments
    if (args.userId && args.userId !== userId) {
      if (orgRole === "org:admin" || hasPermission(orgPermissions, "org:payments:read")) {
        targetUserId = args.userId
      } else {
        throw new ConvexError("Permission denied: Cannot view other users' payments")
      }
    }

    // Build the query
    let paymentsQuery = ctx.db.query("payments").filter((q) => q.eq(q.field("tenantId"), args.orgId))

    // Filter by user ID if not an admin
    if (orgRole !== "org:admin") {
      paymentsQuery = paymentsQuery.filter((q) => q.eq(q.field("userId"), targetUserId))
    }

    // Filter by status if provided
    if (args.status) {
      paymentsQuery = paymentsQuery.filter((q) => q.eq(q.field("status"), args.status))
    }

    // Apply pagination
    const paginationOpts = paginationOptsValidator.parse({
      page: args.page || 1,
      limit: args.limit || 10,
    })

    const skip = (paginationOpts.page - 1) * paginationOpts.limit

    // Get total count for pagination
    const totalCount = await paymentsQuery.collect().then((payments) => payments.length)

    // Get paginated payments
    const payments = await paymentsQuery.order("desc").skip(skip).take(paginationOpts.limit)

    // Fetch related data for each payment
    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        // Get appointment if exists
        let appointment = null
        if (payment.appointmentId) {
          appointment = await ctx.db.get(payment.appointmentId)
        }

        // Get invoice if exists
        let invoice = null
        if (payment.invoiceId) {
          invoice = await ctx.db.get(payment.invoiceId)
        }

        return {
          ...payment,
          appointment: appointment
            ? {
                id: appointment._id,
                date: appointment.date,
                time: appointment.time,
                serviceType: appointment.serviceType,
              }
            : null,
          invoice: invoice
            ? {
                id: invoice._id,
                amount: invoice.amount,
                status: invoice.status,
              }
            : null,
        }
      }),
    )

    return {
      payments: paymentsWithDetails,
      pagination: {
        page: paginationOpts.page,
        limit: paginationOpts.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / paginationOpts.limit),
      },
    }
  },
})
