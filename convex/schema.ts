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

  // AI Agent related tables
  media: defineTable({
    tenantId: v.string(),
    assessmentId: v.id("assessments"),
    url: v.string(),
    type: v.string(), // "image", "video"
    metadata: v.optional(v.object({})),
    createdAt: v.number(),
  }).index("by_assessment", ["assessmentId", "tenantId"]),

  mediaAnalysis: defineTable({
    tenantId: v.string(),
    mediaId: v.id("media"),
    analysisType: v.string(), // "damage", "part", "condition"
    results: v.object({}),
    embedding: v.array(v.float64()),
    createdAt: v.number(),
  }),

  slots: defineTable({
    tenantId: v.string(),
    start: v.number(), // timestamp
    end: v.number(), // timestamp
    available: v.boolean(),
    createdAt: v.number(),
  }),

  businessInsights: defineTable({
    tenantId: v.string(),
    type: v.string(), // "revenue", "customer", "service"
    period: v.string(), // "daily", "weekly", "monthly", "quarterly", "yearly", "event"
    startDate: v.number(), // timestamp
    endDate: v.number(), // timestamp
    data: v.object({}),
    createdAt: v.number(),
  }),

  agentMemory: defineTable({
    tenantId: v.string(),
    agentName: v.string(),
    content: v.string(),
    embedding: v.optional(v.array(v.float64())),
    timestamp: v.number(),
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536,
    filterFields: ["tenantId", "agentName"],
  }),

  agentTrajectories: defineTable({
    tenantId: v.string(),
    agentName: v.string(),
    contextId: v.string(),
    steps: v.array(v.object({})),
    feedback: v.optional(v.object({})),
    createdAt: v.number(),
  }),
})
