import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser } from "./lib/auth"
import { ConvexError } from "convex/values"

// List notifications for the current user with tenant isolation
export const listNotifications = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId } = getAuthenticatedUser(identity)

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot access other user's notifications")
    }

    // Get the notifications for this user and tenant
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("tenantId"), orgId)))
      .order("desc")
      .collect()

    return notifications
  },
})

// Get notification by ID
export const getNotificationById = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId } = getAuthenticatedUser(identity)

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot access other user's notifications")
    }

    // Get the notification
    const notification = await ctx.db.get(args.notificationId)

    // Verify the notification exists and belongs to this user and tenant
    if (!notification || notification.tenantId !== orgId || notification.userId !== userId) {
      throw new ConvexError("Notification not found or access denied")
    }

    // If the notification has a related entity, fetch it
    let relatedEntity = null
    if (notification.entityId && notification.entityType) {
      try {
        relatedEntity = await ctx.db.get(notification.entityId)
      } catch (error) {
        // Entity might not exist anymore
      }
    }

    return {
      ...notification,
      relatedEntity,
    }
  },
})

// Get AI insights for a notification
export const getNotificationInsights = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId } = getAuthenticatedUser(identity)

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot access other user's notifications")
    }

    // Get the notification
    const notification = await ctx.db.get(args.notificationId)

    // Verify the notification exists and belongs to this user and tenant
    if (!notification || notification.tenantId !== orgId || notification.userId !== userId) {
      throw new ConvexError("Notification not found or access denied")
    }

    // Get insights based on notification type
    let insights = {
      summary: "No additional insights available.",
      recommendations: [],
      relatedData: null,
    }

    switch (notification.type) {
      case "appointment_reminder":
        // Get appointment details if available
        if (notification.entityId && notification.entityType === "appointments") {
          const appointment = await ctx.db.get(notification.entityId)
          if (appointment) {
            insights = {
              summary: `This is a reminder for your upcoming appointment on ${new Date(appointment.date).toLocaleDateString()}.`,
              recommendations: ["Arrive 10 minutes early for check-in", "Bring your vehicle documentation"],
              relatedData: {
                appointmentTime: appointment.time,
                serviceType: appointment.serviceType,
              },
            }
          }
        }
        break
      case "invoice_due":
        // Get invoice details if available
        if (notification.entityId && notification.entityType === "invoices") {
          const invoice = await ctx.db.get(notification.entityId)
          if (invoice) {
            insights = {
              summary: `Your invoice of $${invoice.amount.toFixed(2)} is due soon.`,
              recommendations: ["Pay online to avoid late fees", "Contact us if you need payment arrangements"],
              relatedData: {
                amount: invoice.amount,
                dueDate: invoice.dueDate,
              },
            }
          }
        }
        break
      case "assessment_complete":
        // Get assessment details if available
        if (notification.entityId && notification.entityType === "assessments") {
          const assessment = await ctx.db.get(notification.entityId)
          if (assessment) {
            insights = {
              summary: "Your vehicle assessment has been completed.",
              recommendations: ["Review the assessment details", "Schedule service for any identified issues"],
              relatedData: {
                completedAt: assessment.completedAt,
                vehicleId: assessment.vehicleId,
              },
            }
          }
        }
        break
      default:
        // Default insights
        insights = {
          summary: "This notification is informational.",
          recommendations: [],
          relatedData: null,
        }
    }

    return insights
  },
})

// Mark notification as read
export const markNotificationAsRead = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId } = getAuthenticatedUser(identity)

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot modify other user's notifications")
    }

    // Get the notification
    const notification = await ctx.db.get(args.notificationId)

    // Verify the notification exists and belongs to this user and tenant
    if (!notification || notification.tenantId !== orgId || notification.userId !== userId) {
      throw new ConvexError("Notification not found or access denied")
    }

    // Mark the notification as read
    await ctx.db.patch(args.notificationId, {
      read: true,
      readAt: Date.now(),
    })

    return { success: true }
  },
})

// Delete notification
export const deleteNotification = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId } = getAuthenticatedUser(identity)

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot delete other user's notifications")
    }

    // Get the notification
    const notification = await ctx.db.get(args.notificationId)

    // Verify the notification exists and belongs to this user and tenant
    if (!notification || notification.tenantId !== orgId || notification.userId !== userId) {
      throw new ConvexError("Notification not found or access denied")
    }

    // Delete the notification
    await ctx.db.delete(args.notificationId)

    return { success: true }
  },
})

// Mark all notifications as read
export const markAllNotificationsAsRead = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId } = getAuthenticatedUser(identity)

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot modify other user's notifications")
    }

    // Get all unread notifications for this user and tenant
    const unreadNotifications = await ctx.db
      .query("notifications")
      .filter((q) =>
        q.and(q.eq(q.field("userId"), userId), q.eq(q.field("tenantId"), orgId), q.eq(q.field("read"), false)),
      )
      .collect()

    // Mark all as read
    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, {
        read: true,
        readAt: Date.now(),
      })
    }

    return { success: true, count: unreadNotifications.length }
  },
})
