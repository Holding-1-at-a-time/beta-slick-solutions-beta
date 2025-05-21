import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // Existing tables...

  // Member-related tables
  appointments: defineTable({
    tenantId: v.string(),
    userId: v.string(), // client user ID
    assignedToId: v.string(), // staff member ID
    vehicleId: v.id("vehicles"),
    assessmentId: v.optional(v.id("assessments")),
    date: v.number(), // timestamp
    time: v.string(),
    duration: v.number(), // in minutes
    serviceType: v.string(),
    status: v.string(), // "scheduled", "in_progress", "completed", "cancelled"
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }),

  invoices: defineTable({
    tenantId: v.string(),
    userId: v.string(), // client user ID
    appointmentId: v.id("appointments"),
    assessmentId: v.optional(v.id("assessments")),
    amount: v.number(),
    status: v.string(), // "draft", "sent", "paid", "overdue"
    dueDate: v.number(), // timestamp
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
      }),
    ),
    createdAt: v.number(),
  }),

  // For storing pricing settings history
  pricingLogs: defineTable({
    tenantId: v.string(),
    updatedBy: v.string(), // userId who made the change
    serviceRates: v.array(
      v.object({
        name: v.string(),
        rate: v.number(),
      }),
    ),
    laborRate: v.number(),
    partsMarkup: v.number(), // percentage
    createdAt: v.number(),
  }),

  // For member notifications
  notifications: defineTable({
    tenantId: v.string(),
    userId: v.string(), // staff member ID
    title: v.string(),
    message: v.string(),
    type: v.string(), // "appointment", "assessment", "invoice", "system"
    relatedId: v.optional(v.id("appointments")), // ID of related item
    isRead: v.boolean(),
    createdAt: v.number(),
  }),
})
