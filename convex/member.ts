import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"

// Helper function to ensure tenant isolation
const ensureTenant = async (ctx: any, tenantId: string) => {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error("Not authenticated")

  // Verify the user has access to this tenant
  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("clerkId"), identity.subject))
    .first()

  if (!user || !user.tenantId) throw new Error("User not found")

  // Ensure tenant isolation
  if (user.tenantId !== tenantId) throw new Error("Unauthorized access to tenant")

  return { userId: user._id as Id<"users">, user }
}

// Get today's appointments for a staff member
export const getTodayAppointments = query({
  args: { tenantId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await ensureTenant(ctx, args.tenantId)

    // Get current date in UTC midnight-to-next-midnight
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return await ctx.db
      .query("appointments")
      .filter((q) =>
        q.and(
          q.eq(q.field("tenantId"), args.tenantId),
          q.eq(q.field("assignedToId"), userId),
          q.gte(q.field("date"), today.getTime()),
          q.lt(q.field("date"), tomorrow.getTime()),
        ),
      )
      .collect()
  },
})

// Update appointment status
export const updateAppointmentStatus = mutation({
  args: {
    tenantId: v.string(),
    appointmentId: v.id("appointments"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    const appointment = await ctx.db.get(args.appointmentId)
    if (!appointment) throw new Error("Appointment not found")

    // Ensure tenant isolation
    if (appointment.tenantId !== args.tenantId) {
      throw new Error("Unauthorized access to appointment")
    }

    // Update the status
    await ctx.db.patch(args.appointmentId, { status: args.status })

    return { success: true }
  },
})

// Finalize invoice for an appointment
export const finalizeInvoice = mutation({
  args: {
    tenantId: v.string(),
    appointmentId: v.id("appointments"),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    const appointment = await ctx.db.get(args.appointmentId)
    if (!appointment) throw new Error("Appointment not found")

    // Ensure tenant isolation
    if (appointment.tenantId !== args.tenantId) {
      throw new Error("Unauthorized access to appointment")
    }

    // Calculate total amount
    const amount = args.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)

    // Create invoice
    const invoiceId = await ctx.db.insert("invoices", {
      tenantId: args.tenantId,
      userId: appointment.userId,
      appointmentId: args.appointmentId,
      assessmentId: appointment.assessmentId,
      amount,
      status: "sent",
      dueDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // Due in 7 days
      items: args.items,
      createdAt: Date.now(),
    })

    // Update appointment status to completed
    await ctx.db.patch(args.appointmentId, { status: "completed" })

    return { success: true, invoiceId }
  },
})

// Get pending assessments
export const getPendingAssessments = query({
  args: { tenantId: v.string() },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    return await ctx.db
      .query("assessments")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.tenantId), q.eq(q.field("status"), "pending")))
      .collect()
  },
})

// Get assessment details
export const getAssessment = query({
  args: {
    tenantId: v.string(),
    assessmentId: v.id("assessments"),
  },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    const assessment = await ctx.db.get(args.assessmentId)
    if (!assessment) return null

    // Ensure tenant isolation
    if (assessment.tenantId !== args.tenantId) {
      return null
    }

    // Get vehicle information
    const vehicle = await ctx.db.get(assessment.vehicleId)

    // Get customer information
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), assessment.userId))
      .first()

    return {
      ...assessment,
      vehicle,
      customer: user,
    }
  },
})

// Create estimate for assessment
export const createEstimate = mutation({
  args: {
    tenantId: v.string(),
    assessmentId: v.id("assessments"),
    serviceItems: v.array(
      v.object({
        description: v.string(),
        estimatedCost: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    const assessment = await ctx.db.get(args.assessmentId)
    if (!assessment) throw new Error("Assessment not found")

    // Ensure tenant isolation
    if (assessment.tenantId !== args.tenantId) {
      throw new Error("Unauthorized access to assessment")
    }

    // Update assessment with estimate and change status
    await ctx.db.patch(args.assessmentId, {
      estimate: args.serviceItems,
      status: "estimated",
      updatedAt: Date.now(),
    })

    // Create notification for customer
    await ctx.db.insert("notifications", {
      tenantId: args.tenantId,
      userId: assessment.userId,
      title: "Estimate Ready",
      message: "Your vehicle assessment estimate is ready for review.",
      type: "assessment",
      relatedId: args.assessmentId,
      isRead: false,
      createdAt: Date.now(),
    })

    return { success: true }
  },
})

// Get customers list
export const getCustomers = query({
  args: { tenantId: v.string() },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    // Find all users with role "client" for this tenant
    return await ctx.db
      .query("users")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.tenantId), q.eq(q.field("role"), "client")))
      .collect()
  },
})

// Get customer details
export const getCustomer = query({
  args: {
    tenantId: v.string(),
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    const customer = await ctx.db.get(args.customerId)
    if (!customer) return null

    // Ensure tenant isolation
    if (customer.tenantId !== args.tenantId || customer.role !== "client") {
      return null
    }

    return customer
  },
})

// Get customer's vehicles
export const getCustomerVehicles = query({
  args: {
    tenantId: v.string(),
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    return await ctx.db
      .query("vehicles")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.tenantId), q.eq(q.field("userId"), args.customerId)))
      .collect()
  },
})

// Get customer's assessments
export const getCustomerAssessments = query({
  args: {
    tenantId: v.string(),
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    return await ctx.db
      .query("assessments")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.tenantId), q.eq(q.field("userId"), args.customerId)))
      .collect()
  },
})

// Get customer's appointments
export const getCustomerAppointments = query({
  args: {
    tenantId: v.string(),
    customerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    return await ctx.db
      .query("appointments")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.tenantId), q.eq(q.field("userId"), args.customerId)))
      .collect()
  },
})

// Get member profile
export const getMemberProfile = query({
  args: { tenantId: v.string() },
  handler: async (ctx, args) => {
    const { user } = await ensureTenant(ctx, args.tenantId)
    return user
  },
})

// Update member profile
export const updateMemberProfile = mutation({
  args: {
    tenantId: v.string(),
    profileData: v.object({
      firstName: v.optional(v.string()),
      lastName: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const { userId } = await ensureTenant(ctx, args.tenantId)

    await ctx.db.patch(userId, {
      ...args.profileData,
      updatedAt: Date.now(),
    })

    return { success: true }
  },
})

// Get member notifications
export const getMemberNotifications = query({
  args: { tenantId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = await ensureTenant(ctx, args.tenantId)

    return await ctx.db
      .query("notifications")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.tenantId), q.eq(q.field("userId"), userId)))
      .order("desc")
      .collect()
  },
})

// Mark notification as read
export const markNotificationRead = mutation({
  args: {
    tenantId: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ensureTenant(ctx, args.tenantId)

    const notification = await ctx.db.get(args.notificationId)
    if (!notification) throw new Error("Notification not found")

    // Ensure tenant isolation
    if (notification.tenantId !== args.tenantId) {
      throw new Error("Unauthorized access to notification")
    }

    await ctx.db.patch(args.notificationId, { isRead: true })

    return { success: true }
  },
})

// Get analytics data for member
export const getMemberAnalytics = query({
  args: {
    tenantId: v.string(),
    period: v.string(), // "day", "week", "month"
  },
  handler: async (ctx, args) => {
    const { userId } = await ensureTenant(ctx, args.tenantId)

    // Calculate date range based on period
    const now = Date.now()
    let startDate: number

    switch (args.period) {
      case "day":
        startDate = now - 24 * 60 * 60 * 1000 // 1 day ago
        break
      case "week":
        startDate = now - 7 * 24 * 60 * 60 * 1000 // 7 days ago
        break
      case "month":
        startDate = now - 30 * 24 * 60 * 60 * 1000 // 30 days ago
        break
      default:
        startDate = now - 7 * 24 * 60 * 60 * 1000 // Default to week
    }

    // Get appointments in the period
    const appointments = await ctx.db
      .query("appointments")
      .filter((q) =>
        q.and(
          q.eq(q.field("tenantId"), args.tenantId),
          q.eq(q.field("assignedToId"), userId),
          q.gte(q.field("date"), startDate),
        ),
      )
      .collect()

    // Get completed appointments
    const completed = appointments.filter((apt) => apt.status === "completed")

    // Calculate completion rate
    const completionRate = appointments.length > 0 ? (completed.length / appointments.length) * 100 : 0

    // Get invoices related to these appointments
    const appointmentIds = completed.map((apt) => apt._id)
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.and(q.eq(q.field("tenantId"), args.tenantId), q.in(q.field("appointmentId"), appointmentIds)))
      .collect()

    // Calculate total revenue
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0)

    return {
      totalAppointments: appointments.length,
      completedAppointments: completed.length,
      completionRate,
      totalRevenue,
      averageInvoice: completed.length > 0 ? totalRevenue / completed.length : 0,
    }
  },
})
