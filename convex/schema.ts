import { defineSchema, defineTable, s } from "convex/schema"

export default defineSchema({
  // Users table with tenant isolation
  users: defineTable({
    clerkId: s.string(),
    email: s.string(),
    firstName: s.string(),
    lastName: s.string(),
    imageUrl: s.string().optional(),
    role: s.string(), // "admin" | "member" | "client"
    isDeleted: s.boolean().optional(),
    deletedAt: s.number().optional(),
    createdAt: s.number(),
  }),

  // Tenants table (organizations)
  tenants: defineTable({
    clerkOrgId: s.string(),
    name: s.string(),
    slug: s.string(),
    imageUrl: s.string().optional(),
    createdAt: s.number(),
  }),

  // User-Tenant relationship table (for many-to-many)
  userTenants: defineTable({
    userId: s.id("users"),
    tenantId: s.string(), // Clerk org ID
    role: s.string(), // "org:admin" | "org:member" | "org:client"
    createdAt: s.number(),
  }),

  // Test records for tenant isolation testing
  testRecords: defineTable({
    message: s.string(),
    userId: s.string(),
    tenantId: s.string(), // Maps to Clerk's orgId
    createdAt: s.number(),
  }),

  // Vehicles table with tenant isolation
  vehicles: defineTable({
    make: s.string(),
    model: s.string(),
    year: s.number(),
    licensePlate: s.string().optional(),
    userId: s.string(), // Owner of the vehicle
    tenantId: s.string(), // Maps to Clerk's orgId
    createdAt: s.number(),
  }),

  // Assessments table with tenant isolation
  assessments: defineTable({
    vehicleId: s.id("vehicles"),
    status: s.string(), // "pending" | "in_progress" | "completed"
    description: s.string(),
    images: s.array(s.string()).optional(),
    userId: s.string(), // User who created the assessment
    assignedToId: s.string().optional(), // Staff member assigned
    tenantId: s.string(), // Maps to Clerk's orgId
    createdAt: s.number(),
  }),

  // Appointments table with tenant isolation
  appointments: defineTable({
    vehicleId: s.id("vehicles"),
    assessmentId: s.id("assessments").optional(),
    date: s.number(), // Timestamp
    status: s.string(), // "scheduled" | "in_progress" | "completed" | "cancelled"
    serviceType: s.string(),
    userId: s.string(), // User who booked the appointment
    assignedToId: s.string().optional(), // Staff member assigned
    tenantId: s.string(), // Maps to Clerk's orgId
    createdAt: s.number(),
  }),

  // Invoices table with tenant isolation
  invoices: defineTable({
    appointmentId: s.id("appointments").optional(),
    assessmentId: s.id("assessments").optional(),
    amount: s.number(),
    status: s.string(), // "draft" | "sent" | "paid" | "overdue"
    dueDate: s.number(), // Timestamp
    items: s.array(
      s.object({
        description: s.string(),
        quantity: s.number(),
        unitPrice: s.number(),
      }),
    ),
    userId: s.string(), // User who the invoice is for
    tenantId: s.string(), // Maps to Clerk's orgId
    createdAt: s.number(),
  }),
})
