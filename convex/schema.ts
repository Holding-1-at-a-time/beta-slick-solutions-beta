import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // Existing tables...

  // New tables for invoices, pricing, and notifications
  invoices: defineTable({
    tenantId: v.string(),
    userId: v.string(),
    appointmentId: v.optional(v.id("appointments")),
    assessmentId: v.optional(v.id("assessments")),
    amount: v.number(),
    status: v.string(), // "draft", "sent", "paid", "overdue", "cancelled"
    dueDate: v.number(), // timestamp
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
      }),
    ),
    paidAt: v.optional(v.number()),
    createdAt: v.number(),
  }),

  pricingSettings: defineTable({
    tenantId: v.string(),
    serviceRates: v.object({
      diagnostic: v.number(),
      repair: v.number(),
      maintenance: v.number(),
    }),
    laborRates: v.object({
      standard: v.number(),
      premium: v.number(),
      emergency: v.number(),
    }),
    partsMarkup: v.number(), // percentage markup on parts
    updatedAt: v.number(),
    updatedBy: v.string(), // userId
  }),

  pricingLogs: defineTable({
    tenantId: v.string(),
    changeType: v.string(), // "service_rate", "labor_rate", "parts_markup"
    fieldName: v.string(), // specific field changed
    oldValue: v.number(),
    newValue: v.number(),
    reason: v.optional(v.string()),
    updatedAt: v.number(),
    updatedBy: v.string(), // userId
  }),

  notifications: defineTable({
    tenantId: v.string(),
    userId: v.string(),
    title: v.string(),
    message: v.string(),
    type: v.string(), // "invoice", "appointment", "assessment", "system"
    relatedId: v.optional(v.string()), // ID of related entity
    isRead: v.boolean(),
    createdAt: v.number(),
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
