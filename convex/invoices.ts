import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser, hasPermission } from "./lib/auth"
import { ConvexError } from "convex/values"
import { paginationOptsValidator } from "./lib/pagination"

// List invoices for the current user with tenant isolation and pagination
export const listClientInvoices = query({
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

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot access other user's invoices")
    }

    // Build the query
    let invoicesQuery = ctx.db
      .query("invoices")
      .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("tenantId"), orgId)))

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

    return {
      invoices,
      totalPages,
      currentPage: args.page,
      totalCount,
    }
  },
})

// Get invoice by ID with tenant isolation
export const getInvoiceById = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to read invoices
    if (!hasPermission(orgPermissions, "org:invoices:read")) {
      throw new ConvexError("Permission denied: Cannot read invoices")
    }

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot access other user's invoices")
    }

    // Get the invoice
    const invoice = await ctx.db.get(args.invoiceId)

    // Verify the invoice exists and belongs to this tenant and user
    if (!invoice || invoice.tenantId !== orgId || invoice.userId !== userId) {
      throw new ConvexError("Invoice not found or access denied")
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

    return {
      ...invoice,
      appointment,
      vehicle,
    }
  },
})

// Initiate payment for an invoice
export const initiateInvoicePayment = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to pay invoices
    if (!hasPermission(orgPermissions, "org:invoices:pay")) {
      throw new ConvexError("Permission denied: Cannot pay invoices")
    }

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot pay other user's invoices")
    }

    // Get the invoice
    const invoice = await ctx.db.get(args.invoiceId)

    // Verify the invoice exists and belongs to this tenant and user
    if (!invoice || invoice.tenantId !== orgId || invoice.userId !== userId) {
      throw new ConvexError("Invoice not found or access denied")
    }

    // Verify the invoice is not already paid
    if (invoice.status === "paid") {
      throw new ConvexError("Invoice is already paid")
    }

    // In a real implementation, this would create a payment intent with Stripe
    // For now, we'll just return a mock payment intent
    const paymentIntent = {
      id: `pi_${Math.random().toString(36).substring(2, 15)}`,
      amount: invoice.amount,
      currency: "usd",
      status: "requires_payment_method",
    }

    // Update the invoice with the payment intent ID
    await ctx.db.patch(args.invoiceId, {
      paymentIntentId: paymentIntent.id,
      status: "processing",
    })

    return paymentIntent
  },
})

// Confirm payment for an invoice
export const confirmInvoicePayment = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    invoiceId: v.id("invoices"),
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId, orgPermissions } = getAuthenticatedUser(identity)

    // Check if user has permission to pay invoices
    if (!hasPermission(orgPermissions, "org:invoices:pay")) {
      throw new ConvexError("Permission denied: Cannot pay invoices")
    }

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot pay other user's invoices")
    }

    // Get the invoice
    const invoice = await ctx.db.get(args.invoiceId)

    // Verify the invoice exists and belongs to this tenant and user
    if (!invoice || invoice.tenantId !== orgId || invoice.userId !== userId) {
      throw new ConvexError("Invoice not found or access denied")
    }

    // Verify the payment intent ID matches
    if (invoice.paymentIntentId !== args.paymentIntentId) {
      throw new ConvexError("Invalid payment intent ID")
    }

    // In a real implementation, this would verify the payment intent with Stripe
    // For now, we'll just update the invoice status
    await ctx.db.patch(args.invoiceId, {
      status: "paid",
      paidAt: Date.now(),
    })

    // Create an activity record
    await ctx.db.insert("activities", {
      userId,
      tenantId: orgId,
      type: "invoice_paid",
      description: `Invoice #${invoice.invoiceNumber} paid`,
      entityId: args.invoiceId,
      entityType: "invoices",
      timestamp: Date.now(),
    })

    return { success: true }
  },
})
