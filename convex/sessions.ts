import { mutation } from "./_generated/server"
import { v } from "convex/values"

// Track session
export const trackSession = mutation({
  args: {
    clerkSessionId: v.string(),
    clerkUserId: v.string(),
    status: v.string(),
    lastActiveAt: v.number(),
    createdAt: v.number(),
    deviceInfo: v.object({
      userAgent: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
      browser: v.optional(v.string()),
      os: v.optional(v.string()),
      deviceType: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Get the user by Clerk user ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkUserId))
      .first()

    // Check if session already exists
    const existingSession = await ctx.db
      .query("sessions")
      .withIndex("by_clerk_session_id", (q) => q.eq("clerkSessionId", args.clerkSessionId))
      .first()

    if (existingSession) {
      // Update existing session
      return await ctx.db.patch(existingSession._id, {
        status: args.status,
        lastActiveAt: args.lastActiveAt,
        updatedAt: Date.now(),
      })
    } else {
      // Create new session
      return await ctx.db.insert("sessions", {
        clerkSessionId: args.clerkSessionId,
        clerkUserId: args.clerkUserId,
        userId: user ? user._id : undefined,
        status: args.status,
        lastActiveAt: args.lastActiveAt,
        deviceInfo: args.deviceInfo,
        createdAt: args.createdAt,
      })
    }
  },
})

// Update session status
export const updateSessionStatus = mutation({
  args: {
    clerkSessionId: v.string(),
    status: v.string(),
    lastActiveAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Find the session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_clerk_session_id", (q) => q.eq("clerkSessionId", args.clerkSessionId))
      .first()

    if (!session) {
      throw new Error(`Session not found for Clerk session ID: ${args.clerkSessionId}`)
    }

    // Update the session status
    return await ctx.db.patch(session._id, {
      status: args.status,
      lastActiveAt: args.lastActiveAt,
      updatedAt: Date.now(),
    })
  },
})
