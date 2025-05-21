import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // Existing tables...

  // New tables for invoices, pricing, and notifications
  invoices: defineTable({
    tenantId: v.string(),
    userId: v.string(),
    vehicleId: v.optional(v.id("vehicles")),
    appointmentId: v.optional(v.id("appointments")),
    invoiceNumber: v.string(),
    description: v.string(),
    amount: v.number(),
    subtotal: v.optional(v.number()),
    tax: v.optional(v.number()),
    discount: v.optional(v.number()),
    status: v.string(), // "pending", "paid", "overdue"
    dueDate: v.number(),
    createdAt: v.number(),
    paidAt: v.optional(v.number()),
    paymentIntentId: v.optional(v.string()),
    items: v.optional(
      v.array(
        v.object({
          description: v.string(),
          quantity: v.number(),
          unitPrice: v.number(),
        }),
      ),
    ),
  }),

  pricingSettings: defineTable({
    tenantId: v.string(),
    baseRates: v.record(v.string(), v.number()),
    laborRate: v.number(),
    markup: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  pricingLogs: defineTable({
    tenantId: v.string(),
    userId: v.string(),
    action: v.string(), // "create", "update"
    settings: v.object({
      baseRates: v.record(v.string(), v.number()),
      laborRate: v.number(),
      markup: v.number(),
    }),
    timestamp: v.number(),
    aiRoute: v.optional(v.string()),
    aiParameters: v.optional(v.any()),
    aiOutput: v.optional(v.any()),
  }),

  notifications: defineTable({
    tenantId: v.string(),
    userId: v.string(),
    type: v.string(), // "appointment_reminder", "invoice_due", "invoice_overdue", "assessment_complete"
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
    entityId: v.optional(v.id("any")),
    entityType: v.optional(v.string()),
    vehicleId: v.optional(v.id("vehicles")),
    metadata: v.optional(v.any()),
  }),

  activities: defineTable({
    tenantId: v.string(),
    userId: v.string(),
    type: v.string(),
    description: v.string(),
    entityId: v.id("any"),
    entityType: v.string(),
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  }),
})
