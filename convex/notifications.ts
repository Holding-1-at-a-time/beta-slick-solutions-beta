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
