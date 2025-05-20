import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create waitlist entry
export const createWaitlistEntry = mutation({
  args: {
    clerkWaitlistId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Create waitlist entry
    return await ctx.db.insert("waitlist", {
      clerkWaitlistId: args.clerkWaitlistId,
      email: args.email,
      name: args.name,
      status: "pending",
      createdAt: args.createdAt,
    });
  },
});

// Update waitlist entry
export const updateWaitlistEntry = mutation({
  args: {
    clerkWaitlistId: v.string(),
    status: v.string(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Find the waitlist entry
    const waitlistEntry = await ctx.db
      .query("waitlist")
      .withIndex("by_clerk_waitlist_id", (q) => q.eq("clerkWaitlistId", args.clerkWaitlistId))
      .first();
    
    if (!waitlistEntry) {
      throw new Error(`Waitlist entry not found for Clerk waitlist ID: ${args.clerkWaitlistId}`);
    }
    
    // Update the waitlist entry
    return await ctx.db.patch(waitlistEntry._id, {
      status: args.status,
      updatedAt: args.updatedAt,
    });
  },
});
