import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"

/**
 * List all users for the current tenant (admin only)
 */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only org:admin may list users
    if (orgRole !== "org:admin") {
      throw new Error("Forbidden: only org:admin can list users")
    }

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Return all users where users.tenantId === tenant._id
    const userTenants = await ctx.db
      .query("userTenants")
      .filter((q) => q.eq(q.field("tenantId"), tenant._id))
      .collect()

    // For each userTenant, fetch the user record
    const users = await Promise.all(
      userTenants.map(async (ut) => {
        const user = await ctx.db.get(ut.userId as Id<"users">)
        if (!user) return null
        return {
          id: ut.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: ut.role,
        }
      }),
    )

    return users.filter(Boolean)
  },
})

/**
 * Create a user record after Clerk invitation
 */
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only org:admin may create users
    if (orgRole !== "org:admin") {
      throw new Error("Forbidden: only org:admin can create users")
    }

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Check if user already exists in this tenant
    const existingUserTenant = await ctx.db
      .query("userTenants")
      .filter((q) => q.and(q.eq(q.field("userId"), args.clerkId), q.eq(q.field("tenantId"), tenant._id)))
      .first()

    if (existingUserTenant) {
      throw new Error("User already exists in this tenant")
    }

    // Create user-tenant relationship
    await ctx.db.insert("userTenants", {
      userId: args.clerkId,
      tenantId: tenant._id,
      role: args.role,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return true
  },
})

/**
 * Update a user's role or profile
 */
export const updateUser = mutation({
  args: {
    userId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only org:admin may update users
    if (orgRole !== "org:admin") {
      throw new Error("Forbidden: only org:admin can update users")
    }

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Find the user-tenant relationship
    const userTenant = await ctx.db
      .query("userTenants")
      .filter((q) => q.and(q.eq(q.field("userId"), args.userId), q.eq(q.field("tenantId"), tenant._id)))
      .first()

    if (!userTenant) {
      throw new Error("User not found in this tenant")
    }

    // Update role if provided
    if (args.role && args.role !== userTenant.role) {
      await ctx.db.patch(userTenant._id, {
        role: args.role,
        updatedAt: Date.now(),
      })
    }

    // Update user profile if firstName or lastName provided
    if (args.firstName || args.lastName) {
      const user = await ctx.db.get(args.userId as Id<"users">)
      if (user) {
        const updates: Record<string, any> = { updatedAt: Date.now() }
        if (args.firstName !== undefined) updates.firstName = args.firstName
        if (args.lastName !== undefined) updates.lastName = args.lastName

        await ctx.db.patch(user._id, updates)
      }
    }

    return true
  },
})

/**
 * List all services for the current tenant
 */
export const listServices = query({
  args: {},
  handler: async (ctx) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId } = identity

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Return all services for this tenant that aren't deleted
    return await ctx.db
      .query("services")
      .filter((q) => q.and(q.eq(q.field("tenantId"), tenant._id), q.neq(q.field("isDeleted"), true)))
      .collect()
  },
})

/**
 * Create a new service
 */
export const createService = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    basePrice: v.number(),
    category: v.string(),
    estimatedDuration: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only admin or member can create services
    if (orgRole !== "org:admin" && orgRole !== "org:member") {
      throw new Error("Forbidden: insufficient permissions")
    }

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Create the service
    await ctx.db.insert("services", {
      name: args.name,
      description: args.description,
      basePrice: args.basePrice,
      category: args.category,
      estimatedDuration: args.estimatedDuration,
      tenantId: tenant._id,
      isActive: true,
      isPackage: false,
      packageItems: [],
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    return true
  },
})

/**
 * Update an existing service
 */
export const updateService = mutation({
  args: {
    serviceId: v.id("services"),
    name: v.string(),
    description: v.string(),
    basePrice: v.number(),
    category: v.string(),
    estimatedDuration: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only admin or member can update services
    if (orgRole !== "org:admin" && orgRole !== "org:member") {
      throw new Error("Forbidden: insufficient permissions")
    }

    // Get the service
    const service = await ctx.db.get(args.serviceId)
    if (!service) {
      throw new Error("Service not found")
    }

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant || service.tenantId !== tenant._id) {
      throw new Error("Not authorized to modify this service")
    }

    // Update the service
    await ctx.db.patch(args.serviceId, {
      name: args.name,
      description: args.description,
      basePrice: args.basePrice,
      category: args.category,
      estimatedDuration: args.estimatedDuration,
      updatedAt: Date.now(),
    })

    return true
  },
})

/**
 * Get tenant settings
 */
export const getTenantSettings = query({
  args: {},
  handler: async (ctx) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId } = identity

    // Find the tenant row matching this orgId
    return await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()
  },
})

/**
 * Update tenant branding
 */
export const updateBranding = mutation({
  args: {
    logoUrl: v.string(),
    colors: v.object({
      primary: v.string(),
      secondary: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only admin can update branding
    if (orgRole !== "org:admin") {
      throw new Error("Forbidden: only org:admin can update branding")
    }

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Update branding
    await ctx.db.patch(tenant._id, {
      imageUrl: args.logoUrl,
      branding: {
        primaryColor: args.colors.primary,
        secondaryColor: args.colors.secondary,
      },
      updatedAt: Date.now(),
    })

    return true
  },
})

/**
 * Update tenant business rules
 */
export const updateRules = mutation({
  args: {
    requireDeposit: v.boolean(),
    depositPercentage: v.number(),
    urgencyFeeMultiplier: v.number(),
    stripeAccountId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only admin can update rules
    if (orgRole !== "org:admin") {
      throw new Error("Forbidden: only org:admin can update rules")
    }

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Update rules
    await ctx.db.patch(tenant._id, {
      requireDeposit: args.requireDeposit,
      depositPercentage: args.depositPercentage,
      urgencyFeeMultiplier: args.urgencyFeeMultiplier,
      stripeAccountId: args.stripeAccountId,
      updatedAt: Date.now(),
    })

    return true
  },
})

/**
 * Get revenue by month
 */
export const getRevenueByMonth = query({
  args: {},
  handler: async (ctx) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only admin or member can view revenue
    if (orgRole !== "org:admin" && orgRole !== "org:member") {
      throw new Error("Forbidden: insufficient permissions")
    }

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Get all paid invoices for this tenant
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.and(q.eq(q.field("tenantId"), tenant._id), q.eq(q.field("status"), "paid")))
      .collect()

    // Group by month and sum totals
    const revenueByMonth: Record<string, number> = {}

    invoices.forEach((invoice) => {
      const date = new Date(invoice.issueDate)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!revenueByMonth[month]) {
        revenueByMonth[month] = 0
      }

      revenueByMonth[month] += invoice.total
    })

    // Convert to array format
    return Object.entries(revenueByMonth).map(([month, total]) => ({
      month,
      total,
    }))
  },
})

/**
 * Get customer acquisition metrics
 */
export const getCustomerAcquisitionMetrics = query({
  args: {},
  handler: async (ctx) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only admin or member can view customer metrics
    if (orgRole !== "org:admin" && orgRole !== "org:member") {
      throw new Error("Forbidden: insufficient permissions")
    }

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Get all client users for this tenant
    const clientUsers = await ctx.db
      .query("userTenants")
      .filter((q) => q.and(q.eq(q.field("tenantId"), tenant._id), q.eq(q.field("role"), "org:client")))
      .collect()

    // Get all appointments for this tenant
    const appointments = await ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("tenantId"), tenant._id))
      .collect()

    // Build map of last activity by user
    const lastActivityByUser: Record<string, number> = {}

    appointments.forEach((appointment) => {
      const userId = appointment.customerId.toString()
      const appointmentTime = appointment.startTime

      if (!lastActivityByUser[userId] || lastActivityByUser[userId] < appointmentTime) {
        lastActivityByUser[userId] = appointmentTime
      }
    })

    // Group users by month of creation
    const metrics: Record<string, { newCustomers: number; retained: number; churned: number }> = {}
    const now = Date.now()

    clientUsers.forEach((user) => {
      const createdAt = user.createdAt
      const date = new Date(createdAt)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!metrics[month]) {
        metrics[month] = { newCustomers: 0, retained: 0, churned: 0 }
      }

      // Count as new customer
      metrics[month].newCustomers += 1

      // Check if retained or churned
      const userId = user.userId.toString()
      const lastActivity = lastActivityByUser[userId] || 0

      if (lastActivity > 0) {
        const lastActivityDate = new Date(lastActivity)
        const lastActivityMonth = `${lastActivityDate.getFullYear()}-${String(lastActivityDate.getMonth() + 1).padStart(2, "0")}`

        if (lastActivityMonth === month) {
          metrics[month].retained += 1
        } else {
          metrics[month].churned += 1
        }
      } else {
        // No activity - consider churned if older than 30 days
        if (now - createdAt > 30 * 24 * 60 * 60 * 1000) {
          metrics[month].churned += 1
        }
      }
    })

    // Convert to array format
    return Object.entries(metrics).map(([month, data]) => ({
      month,
      ...data,
    }))
  },
})

/**
 * Get service usage metrics
 */
export const getServiceUsageMetrics = query({
  args: {},
  handler: async (ctx) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only admin or member can view service metrics
    if (orgRole !== "org:admin" && orgRole !== "org:member") {
      throw new Error("Forbidden: insufficient permissions")
    }

    // Find the tenant row matching this orgId
    const tenant = await ctx.db
      .query("tenants")
      .filter((q) => q.eq(q.field("clerkOrgId"), orgId))
      .first()

    if (!tenant) {
      throw new Error("Tenant not found")
    }

    // Get all appointments for this tenant
    const appointments = await ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("tenantId"), tenant._id))
      .collect()

    // Count service usage
    const serviceUsage: Record<string, number> = {}

    for (const appointment of appointments) {
      // Assuming appointments have serviceIds array
      if (appointment.serviceIds && Array.isArray(appointment.serviceIds)) {
        for (const serviceId of appointment.serviceIds) {
          const service = await ctx.db.get(serviceId as Id<"services">)
          if (service && service.tenantId === tenant._id) {
            const serviceName = service.name
            if (!serviceUsage[serviceName]) {
              serviceUsage[serviceName] = 0
            }
            serviceUsage[serviceName] += 1
          }
        }
      }
    }

    // Convert to array format
    return Object.entries(serviceUsage).map(([serviceName, usageCount]) => ({
      serviceName,
      usageCount,
    }))
  },
})

/**
 * Get AI insights and recommendations
 */
export const insightsAgent = query({
  args: {},
  handler: async (ctx) => {
    // Get the authenticated identity
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Unauthorized: must be signed in")
    }
    const { orgId, orgRole } = identity

    // Only admin or member can view insights
    if (orgRole !== "org:admin" && orgRole !== "org:member") {
      throw new Error("Forbidden: insufficient permissions")
    }

    // In a real implementation, this would call an AI service with actual data
    // For now, return static insights
    return `• Total revenue increased 12% month-over-month.
• New customer signups are up 8%.
• "Oil Change" remains the most frequent service with 120 bookings.
• Consider implementing a loyalty discount to reduce churn.
• Urgent service requests have increased by 15% - consider adding more staff.`
  },
})
