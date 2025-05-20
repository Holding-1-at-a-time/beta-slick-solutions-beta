import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create invitation
export const createInvitation = mutation({
  args: {
    clerkInvitationId: v.string(),
    clerkOrgId: v.string(),
    email: v.string(),
    role: v.string(),
    status: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the tenant by Clerk org ID
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_clerk_org_id", (q) => q.eq("clerkOrgId", args.clerkOrgId))
      .first();
    
    // Create the invitation
    return await ctx.db.insert("invitations", {
      clerkInvitationId: args.clerkInvitationId,
      clerkOrgId: args.clerkOrgId,
      tenantId: tenant ? tenant._id : undefined,
      email: args.email,
      role: args.role,
      status: args.status,
      createdAt: args.createdAt,
    });
  },
});

// Update invitation status
export const updateInvitationStatus = mutation({
  args: {
    clerkInvitationId: v.string(),
    status: v.string(),
    acceptedBy: v.optional(v.string()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Find the invitation
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_clerk_invitation_id", (q) => q.eq("clerkInvitationId", args.clerkInvitationId))
      .first();
    
    if (!invitation) {
      throw new Error(`Invitation not found for Clerk invitation ID: ${args.clerkInvitationId}`);
    }
    
    // Update the invitation status
    const updateData: any = {
      status: args.status,
      updatedAt: args.updatedAt,
    };
    
    if (args.acceptedBy) {
      updateData.acceptedBy = args.acceptedBy;
    }
    
    return await ctx.db.patch(invitation._id, updateData);
  },
});
