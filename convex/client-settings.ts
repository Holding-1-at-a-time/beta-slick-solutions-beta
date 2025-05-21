import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser } from "./lib/auth"
import { ConvexError } from "convex/values"

// Get client settings
export const getClientSettings = query({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId } = getAuthenticatedUser(identity)

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot access other user's settings")
    }

    // Get the user
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), userId))
      .first()

    if (!user) {
      throw new ConvexError("User not found")
    }

    // Get tenant settings
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("_id"), orgId))
      .first()

    // Return user and tenant settings
    return {
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        imageUrl: user.imageUrl,
      },
      tenant: tenant
        ? {
            name: tenant.name,
            branding: tenant.branding || {},
            allowClientBrandingCustomization: tenant.allowClientBrandingCustomization || false,
          }
        : null,
    }
  },
})

// Update client tenant branding preferences
export const updateClientBranding = mutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
    branding: v.object({
      primaryColor: v.optional(v.string()),
      secondaryColor: v.optional(v.string()),
      logo: v.optional(v.string()),
      darkMode: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId } = getAuthenticatedUser(identity)

    // Verify the requested userId matches the authenticated user
    if (args.userId !== userId) {
      throw new ConvexError("Permission denied: Cannot modify other user's settings")
    }

    // Get tenant settings
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("_id"), orgId))
      .first()

    if (!tenant) {
      throw new ConvexError("Tenant not found")
    }

    // Check if client branding customization is allowed
    if (!tenant.allowClientBrandingCustomization) {
      throw new ConvexError("Branding customization is not allowed for this tenant")
    }

    // Get the user's client preferences
    const clientPreferences = await ctx.db
      .query("clientPreferences")
      .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("tenantId"), orgId)))
      .first()

    if (clientPreferences) {
      // Update existing preferences
      await ctx.db.patch(clientPreferences._id, {
        branding: {
          ...clientPreferences.branding,
          ...args.branding,
        },
        updatedAt: Date.now(),
      })
    } else {
      // Create new preferences
      await ctx.db.insert("clientPreferences", {
        userId,
        tenantId: orgId,
        branding: args.branding,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }

    return { success: true }
  },
})
