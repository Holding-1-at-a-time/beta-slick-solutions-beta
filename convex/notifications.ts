import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { paginationOptsValidator } from "./lib/pagination"

// Get notifications for the user
export const getNotifications = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    paginationOpts: v.optional(paginationOptsValidator),
    unreadOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { orgId, userId, paginationOpts, unreadOnly } = args

    // Start with tenant isolation and user filter
    let notificationsQuery = ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .filter((q) => q.eq(q.field("userId"), userId))

    // Filter by read status if requested
    if (unreadOnly) {
      notificationsQuery = notificationsQuery.filter((q) => q.eq(q.field("isRead"), false))
    }

    // Sort by creation date (newest first)
    notificationsQuery = notificationsQuery.order("desc")

    // Apply pagination if provided
    if (paginationOpts) {
      const { limit, cursor } = paginationOpts
      if (cursor) {
        notificationsQuery = notificationsQuery.paginate({ cursor, limit })
      } else {
        notificationsQuery = notificationsQuery.paginate({ limit })
      }

      const paginationResult = await notificationsQuery
      return {
        notifications: paginationResult.page,
        continueCursor: paginationResult.continueCursor,
      }
    }

    // If no pagination, return all results
    const notifications = await notificationsQuery.collect()
    return { notifications, continueCursor: null }
  },
})

// Get a single notification
export const getNotification = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const { orgId, userId, notificationId } = args

    const notification = await ctx.db.get(notificationId)

    // Ensure tenant isolation and user access
    if (!notification || notification.tenantId !== orgId || notification.userId !== userId) {
      return null
    }

    return notification
  },
})

// Mark a notification as read
export const markNotificationRead = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const { orgId, userId, notificationId } = args

    const notification = await ctx.db.get(notificationId)

    // Ensure tenant isolation and user access
    if (!notification || notification.tenantId !== orgId || notification.userId !== userId) {
      throw new Error("Notification not found or access denied")
    }

    // Update notification status
    await ctx.db.patch(notificationId, {
      isRead: true,
    })

    return { success: true }
  },
})

// Mark all notifications as read
export const markAllNotificationsRead = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId, userId } = args

    // Get all unread notifications for this user
    const unreadNotifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect()

    // Update each notification
    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
      })
    }

    return { success: true, count: unreadNotifications.length }
  },
})

// Get unread notification count
export const getUnreadNotificationCount = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { orgId, userId } = args

    // Count unread notifications
    const unreadNotifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("tenantId"), orgId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect()

    return { count: unreadNotifications.length }
  },
})
