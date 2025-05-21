import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthenticatedUser, hasPermission } from "./lib/auth"
import { ConvexError } from "convex/values"
import { paginationOptsValidator } from "./lib/pagination"

// List appointments for a client with pagination
export const listAppointments = query({
  args: {
    orgId: v.string(),
    userId: v.optional(v.string()),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify tenant isolation
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Organization ID mismatch")
    }

    // Determine which user's appointments to fetch
    let targetUserId = userId

    // If a specific userId is provided and the user has permission to view others' appointments
    if (args.userId && args.userId !== userId) {
      if (orgRole === "org:admin" || hasPermission(orgPermissions, "org:appointments:read")) {
        targetUserId = args.userId
      } else {
        throw new ConvexError("Permission denied: Cannot view other users' appointments")
      }
    }

    // Build the query
    let appointmentsQuery = ctx.db.query("appointments").filter((q) => q.eq(q.field("tenantId"), args.orgId))

    // Filter by user ID if not an admin
    if (orgRole !== "org:admin") {
      appointmentsQuery = appointmentsQuery.filter((q) => q.eq(q.field("userId"), targetUserId))
    }

    // Filter by status if provided
    if (args.status) {
      appointmentsQuery = appointmentsQuery.filter((q) => q.eq(q.field("status"), args.status))
    }

    // Apply pagination
    const paginationOpts = paginationOptsValidator.parse({
      page: args.page || 1,
      limit: args.limit || 10,
    })

    const skip = (paginationOpts.page - 1) * paginationOpts.limit

    // Get total count for pagination
    const totalCount = await appointmentsQuery.collect().then((appointments) => appointments.length)

    // Get paginated appointments
    const appointments = await appointmentsQuery.order("desc").skip(skip).take(paginationOpts.limit)

    // Fetch related data for each appointment
    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment) => {
        // Get vehicle details
        const vehicle = await ctx.db.get(appointment.vehicleId)

        // Get invoice if exists
        const invoice = await ctx.db
          .query("invoices")
          .filter((q) => q.eq(q.field("appointmentId"), appointment._id))
          .first()

        // Get staff member details if assigned
        let staffMember = null
        if (appointment.assignedToId) {
          staffMember = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("clerkId"), appointment.assignedToId))
            .first()
        }

        return {
          ...appointment,
          vehicle: vehicle
            ? {
                id: vehicle._id,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                licensePlate: vehicle.licensePlate,
              }
            : null,
          invoice: invoice
            ? {
                id: invoice._id,
                amount: invoice.amount,
                status: invoice.status,
              }
            : null,
          staffMember: staffMember
            ? {
                id: staffMember._id,
                name: staffMember.name,
              }
            : null,
        }
      }),
    )

    return {
      appointments: appointmentsWithDetails,
      pagination: {
        page: paginationOpts.page,
        limit: paginationOpts.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / paginationOpts.limit),
      },
    }
  },
})

// Get detailed information about a specific appointment
export const getAppointmentDetail = query({
  args: {
    orgId: v.string(),
    appointmentId: v.id("appointments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify tenant isolation
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Organization ID mismatch")
    }

    // Get the appointment
    const appointment = await ctx.db.get(args.appointmentId)

    if (!appointment) {
      throw new ConvexError("Appointment not found")
    }

    // Verify tenant isolation at the record level
    if (appointment.tenantId !== args.orgId) {
      throw new ConvexError("Appointment not found in this organization")
    }

    // Check if user has permission to view this appointment
    if (
      appointment.userId !== userId &&
      orgRole !== "org:admin" &&
      !hasPermission(orgPermissions, "org:appointments:read")
    ) {
      throw new ConvexError("Permission denied: Cannot view this appointment")
    }

    // Get vehicle details
    const vehicle = await ctx.db.get(appointment.vehicleId)

    // Get invoice if exists
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("appointmentId"), appointment._id))
      .first()

    // Get staff member details if assigned
    let staffMember = null
    if (appointment.assignedToId) {
      staffMember = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("clerkId"), appointment.assignedToId))
        .first()
    }

    // Get client details
    const client = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), appointment.userId))
      .first()

    // Get assessment if exists
    let assessment = null
    if (appointment.assessmentId) {
      assessment = await ctx.db.get(appointment.assessmentId)
    }

    // Get payment information
    const payments = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("appointmentId"), appointment._id))
      .collect()

    return {
      ...appointment,
      vehicle: vehicle
        ? {
            id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            licensePlate: vehicle.licensePlate,
          }
        : null,
      invoice: invoice
        ? {
            id: invoice._id,
            amount: invoice.amount,
            status: invoice.status,
            items: invoice.items,
            dueDate: invoice.dueDate,
          }
        : null,
      staffMember: staffMember
        ? {
            id: staffMember._id,
            name: staffMember.name,
          }
        : null,
      client: client
        ? {
            id: client._id,
            name: client.name,
            email: client.email,
          }
        : null,
      assessment: assessment
        ? {
            id: assessment._id,
            status: assessment.status,
          }
        : null,
      payments: payments.map((payment) => ({
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt,
      })),
    }
  },
})

// Reschedule an appointment
export const rescheduleAppointment = mutation({
  args: {
    orgId: v.string(),
    appointmentId: v.id("appointments"),
    date: v.number(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify tenant isolation
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Organization ID mismatch")
    }

    // Get the appointment
    const appointment = await ctx.db.get(args.appointmentId)

    if (!appointment) {
      throw new ConvexError("Appointment not found")
    }

    // Verify tenant isolation at the record level
    if (appointment.tenantId !== args.orgId) {
      throw new ConvexError("Appointment not found in this organization")
    }

    // Check if user has permission to reschedule this appointment
    const canReschedule =
      appointment.userId === userId ||
      orgRole === "org:admin" ||
      hasPermission(orgPermissions, "org:appointments:write")

    if (!canReschedule) {
      throw new ConvexError("Permission denied: Cannot reschedule this appointment")
    }

    // Check if the appointment is in a state that can be rescheduled
    if (appointment.status === "completed" || appointment.status === "cancelled") {
      throw new ConvexError(`Cannot reschedule a ${appointment.status} appointment`)
    }

    // Update the appointment
    const updatedAppointment = await ctx.db.patch(args.appointmentId, {
      date: args.date,
      time: args.time,
      status: "rescheduled",
    })

    // Create a notification for the staff member
    if (appointment.assignedToId) {
      await ctx.db.insert("notifications", {
        tenantId: args.orgId,
        userId: appointment.assignedToId,
        title: "Appointment Rescheduled",
        message: `Appointment for ${appointment.serviceType} has been rescheduled to ${new Date(args.date).toLocaleDateString()} at ${args.time}`,
        type: "appointment",
        relatedId: appointment._id,
        isRead: false,
        createdAt: Date.now(),
      })
    }

    // Create an activity record
    await ctx.db.insert("activities", {
      userId,
      tenantId: args.orgId,
      type: "appointment_rescheduled",
      description: `Appointment for ${appointment.serviceType} rescheduled to ${new Date(args.date).toLocaleDateString()} at ${args.time}`,
      entityId: appointment._id,
      entityType: "appointments",
      timestamp: Date.now(),
    })

    return updatedAppointment
  },
})

// Book an appointment slot
export const bookAppointment = mutation({
  args: {
    orgId: v.string(),
    appointmentId: v.id("appointments"),
    slotId: v.id("slots"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify tenant isolation
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Organization ID mismatch")
    }

    // Get the appointment
    const appointment = await ctx.db.get(args.appointmentId)

    if (!appointment) {
      throw new ConvexError("Appointment not found")
    }

    // Verify tenant isolation at the record level
    if (appointment.tenantId !== args.orgId) {
      throw new ConvexError("Appointment not found in this organization")
    }

    // Check if user has permission to book this appointment
    const canBook =
      appointment.userId === userId ||
      orgRole === "org:admin" ||
      hasPermission(orgPermissions, "org:appointments:write")

    if (!canBook) {
      throw new ConvexError("Permission denied: Cannot book this appointment")
    }

    // Get the slot
    const slot = await ctx.db.get(args.slotId)

    if (!slot) {
      throw new ConvexError("Slot not found")
    }

    // Verify tenant isolation for the slot
    if (slot.tenantId !== args.orgId) {
      throw new ConvexError("Slot not found in this organization")
    }

    // Check if the slot is available
    if (!slot.available) {
      throw new ConvexError("This slot is no longer available")
    }

    // Update the slot to be unavailable
    await ctx.db.patch(args.slotId, {
      available: false,
    })

    // Update the appointment with the new date and time
    const updatedAppointment = await ctx.db.patch(args.appointmentId, {
      date: slot.start,
      time: new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "scheduled",
    })

    // Create a notification for the staff member
    if (appointment.assignedToId) {
      await ctx.db.insert("notifications", {
        tenantId: args.orgId,
        userId: appointment.assignedToId,
        title: "Appointment Booked",
        message: `Appointment for ${appointment.serviceType} has been booked for ${new Date(slot.start).toLocaleDateString()} at ${new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        type: "appointment",
        relatedId: appointment._id,
        isRead: false,
        createdAt: Date.now(),
      })
    }

    // Create an activity record
    await ctx.db.insert("activities", {
      userId,
      tenantId: args.orgId,
      type: "appointment_booked",
      description: `Appointment for ${appointment.serviceType} booked for ${new Date(slot.start).toLocaleDateString()} at ${new Date(slot.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      entityId: appointment._id,
      entityType: "appointments",
      timestamp: Date.now(),
    })

    return updatedAppointment
  },
})

// Get appointment confirmation details
export const getAppointmentConfirmed = query({
  args: {
    orgId: v.string(),
    appointmentId: v.id("appointments"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const { userId, orgId: userOrgId, orgRole, orgPermissions } = getAuthenticatedUser(identity)

    // Verify tenant isolation
    if (args.orgId !== userOrgId) {
      throw new ConvexError("Organization ID mismatch")
    }

    // Get the appointment
    const appointment = await ctx.db.get(args.appointmentId)

    if (!appointment) {
      throw new ConvexError("Appointment not found")
    }

    // Verify tenant isolation at the record level
    if (appointment.tenantId !== args.orgId) {
      throw new ConvexError("Appointment not found in this organization")
    }

    // Check if user has permission to view this appointment
    if (
      appointment.userId !== userId &&
      orgRole !== "org:admin" &&
      !hasPermission(orgPermissions, "org:appointments:read")
    ) {
      throw new ConvexError("Permission denied: Cannot view this appointment")
    }

    // Get vehicle details
    const vehicle = await ctx.db.get(appointment.vehicleId)

    // Get payment information
    const payments = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("appointmentId"), appointment._id))
      .collect()

    // Get invoice if exists
    const invoice = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("appointmentId"), appointment._id))
      .first()

    // Calculate deposit status
    const depositPaid = payments.some((payment) => payment.status === "succeeded")
    const depositAmount = payments.reduce(
      (total, payment) => total + (payment.status === "succeeded" ? payment.amount : 0),
      0,
    )

    return {
      appointment: {
        id: appointment._id,
        date: appointment.date,
        time: appointment.time,
        serviceType: appointment.serviceType,
        status: appointment.status,
      },
      vehicle: vehicle
        ? {
            id: vehicle._id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            licensePlate: vehicle.licensePlate,
          }
        : null,
      deposit: {
        paid: depositPaid,
        amount: depositAmount,
      },
      invoice: invoice
        ? {
            id: invoice._id,
            amount: invoice.amount,
            status: invoice.status,
          }
        : null,
    }
  },
})
