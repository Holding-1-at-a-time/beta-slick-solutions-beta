import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { paginationOptsValidator } from "./lib/pagination"

// List invoices for the authenticated user with pagination
export const listInvoices = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    status: v.optional(v.string()),
    paginationOpts: v.optional(paginationOptsValidator),
  },
  handler: async (ctx, args) => {
    const { orgId, userId, status, paginationOpts } = args

    // Start with tenant isolation filter
    let invoicesQuery = ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .filter((q) => q.eq(q.field("userId"), userId))

    // Add status filter if provided
    if (status) {
      invoicesQuery = invoicesQuery.filter((q) => q.eq(q.field("status"), status))
    }

    // Add sorting by creation date (newest first)
    invoicesQuery = invoicesQuery.order("desc")

    // Apply pagination if provided
    if (paginationOpts) {
      const { limit, cursor } = paginationOpts
      if (cursor) {
        invoicesQuery = invoicesQuery.paginate({ cursor, limit })
      } else {
        invoicesQuery = invoicesQuery.paginate({ limit })
      }

      const paginationResult = await invoicesQuery
      return {
        invoices: paginationResult.page,
        continueCursor: paginationResult.continueCursor,
      }
    }

    // If no pagination, return all results
    const invoices = await invoicesQuery.collect()
    return { invoices, continueCursor: null }
  },
})

// Get a single invoice by ID
export const getInvoice = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    invoiceId: v.id("invoices"),
  },
  handler: async (ctx, args) => {
    const { orgId, userId, invoiceId } = args

    const invoice = await ctx.db.get(invoiceId)

    // Ensure tenant isolation and user access
    if (!invoice || invoice.tenantId !== orgId || invoice.userId !== userId) {
      return null
    }

    return invoice
  },
})

// Pay an invoice
export const payInvoice = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    invoiceId: v.id("invoices"),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId, userId, invoiceId, paymentMethod } = args

    const invoice = await ctx.db.get(invoiceId)

    // Ensure tenant isolation and user access
    if (!invoice || invoice.tenantId !== orgId || invoice.userId !== userId) {
      throw new Error("Invoice not found or access denied")
    }

    // Update invoice status to paid
    await ctx.db.patch(invoiceId, {
      status: "paid",
      paidAt: Date.now(),
    })

    // Create a notification for the payment
    await ctx.db.insert("notifications", {
      tenantId: orgId,
      userId,
      title: "Payment Successful",
      message: `Your payment of $${invoice.amount.toFixed(2)} has been processed successfully.`,
      type: "invoice",
      relatedId: invoiceId,
      isRead: false,
      createdAt: Date.now(),
    })

    return { success: true }
  },
})

// Search invoices
export const searchInvoices = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    searchTerm: v.string(),
    paginationOpts: v.optional(paginationOptsValidator),
  },
  handler: async (ctx, args) => {
    const { orgId, userId, searchTerm, paginationOpts } = args

    // Get all invoices for the user (tenant isolation)
    const allInvoices = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect()

    // Client-side search (Convex doesn't have full-text search yet)
    const filteredInvoices = allInvoices.filter((invoice) => {
      // Search in invoice items descriptions
      const itemsMatch = invoice.items.some((item) => item.description.toLowerCase().includes(searchTerm.toLowerCase()))

      // Search in invoice ID (as string)
      const idMatch = invoice._id.toString().includes(searchTerm)

      // Search in status
      const statusMatch = invoice.status.toLowerCase().includes(searchTerm.toLowerCase())

      return itemsMatch || idMatch || statusMatch
    })

    // Apply pagination if provided
    if (paginationOpts && paginationOpts.limit) {
      const { limit } = paginationOpts
      const startIndex = paginationOpts.cursor ? Number.parseInt(paginationOpts.cursor) : 0
      const endIndex = startIndex + limit

      const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex)
      const continueCursor = endIndex < filteredInvoices.length ? endIndex.toString() : null

      return {
        invoices: paginatedInvoices,
        continueCursor,
      }
    }

    return {
      invoices: filteredInvoices,
      continueCursor: null,
    }
  },
})
