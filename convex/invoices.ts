import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser, hasPermission } from "./lib/auth"
import { ConvexError } from "convex/values"
import { paginationOptsValidator } from "./lib/pagination"
import type { Id } from "./_generated/dataModel"

// List invoices for the current user with tenant isolation and pagination
export const listInvoices = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    status: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    search: v.optional(v.string()),
    ...paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read invoices
    if (!hasPermission(orgPermissions, "org:invoices:read")) {
      throw new ConvexError("Permission denied: Cannot read invoices")
    }

    // Verify the requested userId matches the authenticated user or the user has admin permissions
    const isAdmin = hasPermission(orgPermissions, "org:admin")
    if (args.userId !== userId && !isAdmin) {
      throw new ConvexError("Permission denied: Cannot access other user's invoices")
    }

    // Build the query
    let invoicesQuery = ctx.db
      .query("invoices")
      .filter((q) => q.and(q.eq(q.field("userId"), args.userId), q.eq(q.field("tenantId"), orgId)))

    // Apply filters if provided
    if (args.status) {
      invoicesQuery = invoicesQuery.filter((q) => q.eq(q.field("status"), args.status))
    }

    if (args.startDate) {
      invoicesQuery = invoicesQuery.filter((q) => q.gte(q.field("createdAt"), args.startDate!))
    }

    if (args.endDate) {
      invoicesQuery = invoicesQuery.filter((q) => q.lte(q.field("createdAt"), args.endDate!))
    }

    if (args.search) {
      // Search by invoice number or description
      invoicesQuery = invoicesQuery.filter((q) =>
        q.or(q.contains(q.field("invoiceNumber"), args.search!), q.contains(q.field("description"), args.search!)),
      )
    }

    // Count total for pagination
    const total = await invoicesQuery.collect()
    const totalCount = total.length
    const totalPages = Math.ceil(totalCount / args.limit)

    // Apply pagination
    const skip = (args.page - 1) * args.limit
    const invoices = await invoicesQuery.order("desc").skip(skip).take(args.limit).collect()

    // Fetch deposit information for each invoice
    const invoicesWithDeposits = await Promise.all(
      invoices.map(async (invoice) => {
        const payments = await ctx.db
          .query("payments")
          .filter((q) => q.and(q.eq(q.field("invoiceId"), invoice._id), q.eq(q.field("tenantId"), orgId)))
          .collect()

        const depositPaid = payments.some((payment) => payment.status === "succeeded")
        const depositAmount = payments.reduce(
          (sum, payment) => sum + (payment.status === "succeeded" ? payment.amount : 0),
          0,
        )

        return {
          ...invoice,
          depositPaid,
          depositAmount,
        }
      }),
    )

    return {
      invoices: invoicesWithDeposits,
      totalPages,
      currentPage: args.page,
      totalCount,
    }
  },
})

// Get invoice by ID with tenant isolation
export const getInvoiceDetail = query({
  args: {
    orgId: v.string(),
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read invoices
    if (!hasPermission(orgPermissions, "org:invoices:read")) {
      throw new ConvexError("Permission denied: Cannot read invoices")
    }

    // Get the invoice
    const invoice = await ctx.db.get(args.invoiceId)

    // Verify the invoice exists and belongs to this tenant
    if (!invoice || invoice.tenantId !== orgId) {
      throw new ConvexError("Invoice not found or access denied")
    }

    // Verify the user has permission to access this invoice
    const isAdmin = hasPermission(orgPermissions, "org:admin")
    if (invoice.userId !== userId && !isAdmin) {
      throw new ConvexError("Permission denied: Cannot access other user's invoices")
    }

    // Get the related appointment if it exists
    let appointment = null
    if (invoice.appointmentId) {
      appointment = await ctx.db.get(invoice.appointmentId)
    }

    // Get the related vehicle if it exists
    let vehicle = null
    if (invoice.vehicleId) {
      vehicle = await ctx.db.get(invoice.vehicleId)
    }

    // Get the related assessment if it exists
    let assessment = null
    if (invoice.assessmentId) {
      assessment = await ctx.db.get(invoice.assessmentId)
    }

    // Get payments related to this invoice
    const payments = await ctx.db
      .query("payments")
      .filter((q) => q.and(q.eq(q.field("invoiceId"), invoice._id), q.eq(q.field("tenantId"), orgId)))
      .collect()

    const depositPaid = payments.some((payment) => payment.status === "succeeded")
    const depositAmount = payments.reduce(
      (sum, payment) => sum + (payment.status === "succeeded" ? payment.amount : 0),
      0,
    )
    const remainingBalance = invoice.amount - depositAmount

    return {
      ...invoice,
      appointment,
      vehicle,
      assessment,
      payments,
      depositPaid,
      depositAmount,
      remainingBalance,
    }
  },
})

// Create a payment intent for an invoice
export const createPaymentIntent = mutation({
  args: {
    orgId: v.string(),
    invoiceId: v.id("invoices"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to pay invoices
    if (!hasPermission(orgPermissions, "org:invoices:pay")) {
      throw new ConvexError("Permission denied: Cannot pay invoices")
    }

    // Get the invoice
    const invoice = await ctx.db.get(args.invoiceId)

    // Verify the invoice exists and belongs to this tenant
    if (!invoice || invoice.tenantId !== orgId) {
      throw new ConvexError("Invoice not found or access denied")
    }

    // Verify the user has permission to pay this invoice
    const isAdmin = hasPermission(orgPermissions, "org:admin")
    if (invoice.userId !== userId && !isAdmin) {
      throw new ConvexError("Permission denied: Cannot pay other user's invoices")
    }

    // Verify the invoice is not already paid
    if (invoice.status === "paid") {
      throw new ConvexError("Invoice is already paid")
    }

    // Get existing payments for this invoice
    const existingPayments = await ctx.db
      .query("payments")
      .filter((q) => q.and(q.eq(q.field("invoiceId"), invoice._id), q.eq(q.field("tenantId"), orgId)))
      .collect()

    const paidAmount = existingPayments.reduce(
      (sum, payment) => sum + (payment.status === "succeeded" ? payment.amount : 0),
      0,
    )

    // Verify the payment amount is valid
    if (args.amount <= 0) {
      throw new ConvexError("Payment amount must be greater than zero")
    }

    if (paidAmount + args.amount > invoice.amount) {
      throw new ConvexError("Payment amount exceeds remaining balance")
    }

    // In a real implementation, this would create a payment intent with Stripe
    // For now, we'll just return a mock payment intent
    const paymentIntentId = `pi_${Math.random().toString(36).substring(2, 15)}`

    // Create a payment record
    const paymentId = await ctx.db.insert("payments", {
      tenantId: orgId,
      userId,
      invoiceId: invoice._id,
      amount: args.amount,
      currency: "usd",
      status: "pending",
      paymentMethod: "card",
      paymentIntentId,
      metadata: {
        invoiceNumber: invoice.invoiceNumber,
      },
      createdAt: Date.now(),
    })

    // Create an activity record
    await ctx.db.insert("activities", {
      userId,
      tenantId: orgId,
      type: "payment_initiated",
      description: `Payment initiated for Invoice #${invoice.invoiceNumber}`,
      entityId: invoice._id,
      entityType: "invoices",
      timestamp: Date.now(),
    })

    return {
      paymentIntentId,
      paymentId,
      clientSecret: `${paymentIntentId}_secret_${Math.random().toString(36).substring(2, 15)}`,
      amount: args.amount,
      currency: "usd",
    }
  },
})

// Confirm payment for an invoice
export const confirmPayment = mutation({
  args: {
    orgId: v.string(),
    paymentId: v.id("payments"),
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to pay invoices
    if (!hasPermission(orgPermissions, "org:invoices:pay")) {
      throw new ConvexError("Permission denied: Cannot pay invoices")
    }

    // Get the payment
    const payment = await ctx.db.get(args.paymentId)

    // Verify the payment exists and belongs to this tenant
    if (!payment || payment.tenantId !== orgId) {
      throw new ConvexError("Payment not found or access denied")
    }

    // Verify the payment intent ID matches
    if (payment.paymentIntentId !== args.paymentIntentId) {
      throw new ConvexError("Invalid payment intent ID")
    }

    // Get the invoice
    const invoice = await ctx.db.get(payment.invoiceId as Id<"invoices">)

    // Verify the invoice exists
    if (!invoice) {
      throw new ConvexError("Invoice not found")
    }

    // Update the payment status
    await ctx.db.patch(args.paymentId, {
      status: "succeeded",
    })

    // Get all payments for this invoice
    const payments = await ctx.db
      .query("payments")
      .filter((q) => q.and(q.eq(q.field("invoiceId"), invoice._id), q.eq(q.field("tenantId"), orgId)))
      .collect()

    const totalPaid = payments.reduce((sum, payment) => sum + (payment.status === "succeeded" ? payment.amount : 0), 0)

    // Update the invoice status if fully paid
    if (totalPaid >= invoice.amount) {
      await ctx.db.patch(invoice._id, {
        status: "paid",
        paidAt: Date.now(),
      })
    }

    // Create an activity record
    await ctx.db.insert("activities", {
      userId,
      tenantId: orgId,
      type: "payment_completed",
      description: `Payment completed for Invoice #${invoice.invoiceNumber}`,
      entityId: invoice._id,
      entityType: "invoices",
      timestamp: Date.now(),
    })

    return {
      success: true,
      paymentId: args.paymentId,
      invoiceId: invoice._id,
      amount: payment.amount,
      invoicePaid: totalPaid >= invoice.amount,
    }
  },
})

// Get invoice statistics for AI insights
export const getInvoiceStatistics = query({
  args: {
    orgId: v.string(),
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read invoices
    if (!hasPermission(orgPermissions, "org:invoices:read")) {
      throw new ConvexError("Permission denied: Cannot read invoices")
    }

    // Get the invoice
    const invoice = await ctx.db.get(args.invoiceId)

    // Verify the invoice exists and belongs to this tenant
    if (!invoice || invoice.tenantId !== orgId) {
      throw new ConvexError("Invoice not found or access denied")
    }

    // Verify the user has permission to access this invoice
    const isAdmin = hasPermission(orgPermissions, "org:admin")
    if (invoice.userId !== userId && !isAdmin) {
      throw new ConvexError("Permission denied: Cannot access other user's invoices")
    }

    // Get similar invoices for comparison (same service type or vehicle type)
    const similarInvoices = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .collect()

    // Calculate average amount for similar invoices
    const averageAmount =
      similarInvoices.length > 0
        ? similarInvoices.reduce((sum, inv) => sum + inv.amount, 0) / similarInvoices.length
        : 0

    // Calculate percentage difference from average
    const percentageDifference = averageAmount > 0 ? ((invoice.amount - averageAmount) / averageAmount) * 100 : 0

    // Get historical invoices for this user
    const userInvoices = await ctx.db
      .query("invoices")
      .filter((q) => q.and(q.eq(q.field("userId"), invoice.userId), q.eq(q.field("tenantId"), orgId)))
      .collect()

    // Calculate average amount for user's invoices
    const userAverageAmount =
      userInvoices.length > 0 ? userInvoices.reduce((sum, inv) => sum + inv.amount, 0) / userInvoices.length : 0

    // Calculate percentage difference from user average
    const userPercentageDifference =
      userAverageAmount > 0 ? ((invoice.amount - userAverageAmount) / userAverageAmount) * 100 : 0

    return {
      invoiceAmount: invoice.amount,
      averageAmount,
      percentageDifference,
      userAverageAmount,
      userPercentageDifference,
      invoiceCount: similarInvoices.length,
      userInvoiceCount: userInvoices.length,
    }
  },
})
