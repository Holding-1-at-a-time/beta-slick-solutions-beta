import { query, mutation } from "convex/server"
import { v } from "convex/values"

// List all "today's" (UTC day) appointments assigned to the staff member
export const listTodayAppointments = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId, userId } = args

    // Compute UTC midnight-to-next-midnight
    const now = Date.now()
    const dayStart = new Date(now)
    dayStart.setUTCHours(0, 0, 0, 0)
    const dayEnd = new Date(dayStart)
    dayEnd.setUTCDate(dayStart.getUTCDate() + 1)

    return await ctx.db
      .query("appointments")
      .filter((q) =>
        q
          .eq(q.field("tenantId"), orgId)
          .and(q.eq(q.field("assignedToId"), userId))
          .and(q.gte(q.field("date"), dayStart.getTime()).and(q.lt(q.field("date"), dayEnd.getTime()))),
      )
      .collect()
  },
})

// Update the status of a given appointment
export const updateAppointmentStatus = mutation({
  args: {
    orgId: v.string(),
    appointmentId: v.id("appointments"),
    newStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId, appointmentId, newStatus } = args

    const apt = await ctx.db.get(appointmentId)
    if (!apt || apt.tenantId !== orgId) {
      throw new Error("Not authorized to update this appointment")
    }

    await ctx.db.patch(appointmentId, { status: newStatus })
    return true
  },
})

// List all assessments whose status = "pending"
export const listPendingAssessments = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId } = args

    return await ctx.db
      .query("assessments")
      .filter((q) => q.eq(q.field("tenantId"), orgId).and(q.eq(q.field("status"), "pending")))
      .collect()
  },
})

// Fetch a single assessment by ID
export const getAssessment = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    assessmentId: v.id("assessments"),
  },
  handler: async (ctx, args) => {
    const { orgId, assessmentId } = args

    const assessment = await ctx.db.get(assessmentId)
    if (!assessment || assessment.tenantId !== orgId) return null

    return assessment
  },
})

// Get AI suggestions for an assessment (placeholder)
export const getAISuggestions = query({
  args: {
    orgId: v.string(),
    assessmentId: v.id("assessments"),
  },
  handler: async (ctx, args) => {
    // In a real implementation, this would call an AI service
    // For now, return placeholder data
    return [
      { description: "Front bumper replacement", estimatedCost: 850 },
      { description: "Headlight alignment", estimatedCost: 120 },
      { description: "Touch-up paint for hood scratches", estimatedCost: 75 },
    ]
  },
})

// Create an estimate for an assessment
export const createEstimate = mutation({
  args: {
    orgId: v.string(),
    assessmentId: v.id("assessments"),
    serviceItems: v.array(
      v.object({
        description: v.string(),
        estimatedCost: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { orgId, assessmentId, serviceItems } = args

    const assessment = await ctx.db.get(assessmentId)
    if (!assessment || assessment.tenantId !== orgId) {
      throw new Error("Not authorized to create estimate for this assessment")
    }

    // Update assessment status
    await ctx.db.patch(assessmentId, {
      status: "estimated",
      estimatedItems: serviceItems,
      estimatedTotal: serviceItems.reduce((sum, item) => sum + item.estimatedCost, 0),
      estimatedAt: Date.now(),
    })

    return true
  },
})

// Create an invoice + payment record at the end of an appointment
export const finalizeInvoice = mutation({
  args: {
    orgId: v.string(),
    appointmentId: v.id("appointments"),
    serviceItems: v.array(
      v.object({
        description: v.string(),
        price: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const { orgId, appointmentId, serviceItems } = args

    // We expect that appointment already exists and belongs to this tenant
    const apt = await ctx.db.get(appointmentId)
    if (!apt || apt.tenantId !== orgId) {
      throw new Error("Not authorized to finalize this appointment")
    }

    // Build invoice items array
    const items = serviceItems.map((it) => ({
      description: it.description,
      quantity: 1,
      unitPrice: it.price,
    }))

    const invoiceId = await ctx.db.insert("invoices", {
      appointmentId,
      assessmentId: apt.assessmentId ?? null,
      amount: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
      status: "sent", // defaulting to "sent" once finalized
      dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      items,
      userId: apt.userId, // the client who booked
      tenantId: orgId,
      createdAt: Date.now(),
    })

    // Update appointment status
    await ctx.db.patch(appointmentId, {
      status: "invoiced",
      invoiceId,
    })

    return true
  },
})

// List all customers (users with role "client") for this tenant
export const listCustomers = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId } = args

    // Find all userTenants where tenantId = orgId & role = "client"
    const userTenants = await ctx.db
      .query("userTenants")
      .filter((q) => q.eq(q.field("tenantId"), orgId).and(q.eq(q.field("role"), "client")))
      .collect()

    // Then fetch user record for each userTenant.userId
    const customers = await Promise.all(
      userTenants.map(async (ut) => {
        const user = await ctx.db.get(ut.userId)
        return user && user.tenantId === orgId ? user : null
      }),
    )

    return customers.filter(Boolean)
  },
})

// Fetch a single customer's user-profile by their userId
export const getCustomer = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { orgId, customerId } = args

    const customer = await ctx.db.get(customerId)
    if (!customer) return null

    // Verify this user belongs to this tenant as a "client"
    const userTenant = await ctx.db
      .query("userTenants")
      .filter((q) =>
        q
          .eq(q.field("tenantId"), orgId)
          .and(q.eq(q.field("userId"), customerId))
          .and(q.eq(q.field("role"), "client")),
      )
      .first()

    return userTenant ? customer : null
  },
})

// List vehicles for a given customer
export const listCustomerVehicles = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { orgId, customerId } = args

    return await ctx.db
      .query("vehicles")
      .filter((q) => q.eq(q.field("tenantId"), orgId).and(q.eq(q.field("userId"), customerId)))
      .collect()
  },
})

// List assessments for a given customer
export const listCustomerAssessments = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { orgId, customerId } = args

    return await ctx.db
      .query("assessments")
      .filter((q) => q.eq(q.field("tenantId"), orgId).and(q.eq(q.field("userId"), customerId)))
      .collect()
  },
})

// List appointments for a given customer
export const listCustomerAppointments = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { orgId, customerId } = args

    return await ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("tenantId"), orgId).and(q.eq(q.field("userId"), customerId)))
      .collect()
  },
})

// Get the currently logged-in member's own profile
export const getUserProfile = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId, userId } = args

    const user = await ctx.db.get(userId)
    if (!user || user.tenantId !== orgId) {
      return null
    }

    return user
  },
})

// Update the authenticated user's own profile
export const updateUserProfile = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    data: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      preferences: v.optional(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    const { orgId, userId, data } = args

    const user = await ctx.db.get(userId)
    if (!user || user.tenantId !== orgId) {
      throw new Error("Not authorized to update this profile")
    }

    await ctx.db.patch(userId, {
      ...("firstName" in data ? { firstName: data.firstName } : {}),
      ...("lastName" in data ? { lastName: data.lastName } : {}),
      ...("email" in data ? { email: data.email } : {}),
      ...("phone" in data ? { phone: data.phone } : {}),
      ...("preferences" in data ? { preferences: data.preferences } : {}),
    })

    return true
  },
})
