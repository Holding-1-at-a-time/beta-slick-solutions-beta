"use server"

import { auth } from "@clerk/nextjs/server"
import { api } from "@/lib/convex"
import { revalidatePath } from "next/cache"

// List appointments for the current user
export async function listAppointments(orgId: string, page = 1, limit = 10, status?: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await api.appointments.listAppointments({
      orgId,
      page,
      limit,
      status,
    })

    return result
  } catch (error) {
    console.error("Error listing appointments:", error)
    throw new Error("Failed to list appointments")
  }
}

// Get appointment details
export async function getAppointmentDetail(orgId: string, appointmentId: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await api.appointments.getAppointmentDetail({
      orgId,
      appointmentId,
    })

    return result
  } catch (error) {
    console.error("Error getting appointment details:", error)
    throw new Error("Failed to get appointment details")
  }
}

// Book an appointment slot
export async function bookAppointment(orgId: string, appointmentId: string, slotId: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await api.appointments.bookAppointment({
      orgId,
      appointmentId,
      slotId,
    })

    revalidatePath(`/${orgId}/dashboard/client/appointments/${appointmentId}`)
    return result
  } catch (error) {
    console.error("Error booking appointment:", error)
    throw new Error("Failed to book appointment")
  }
}

// Get appointment confirmation
export async function getAppointmentConfirmed(orgId: string, appointmentId: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await api.appointments.getAppointmentConfirmed({
      orgId,
      appointmentId,
    })

    return result
  } catch (error) {
    console.error("Error getting appointment confirmation:", error)
    throw new Error("Failed to get appointment confirmation")
  }
}

// Reschedule an appointment
export async function rescheduleAppointment(orgId: string, appointmentId: string, date: number, time: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await api.appointments.rescheduleAppointment({
      orgId,
      appointmentId,
      date,
      time,
    })

    revalidatePath(`/${orgId}/dashboard/client/appointments/${appointmentId}`)
    return result
  } catch (error) {
    console.error("Error rescheduling appointment:", error)
    throw new Error("Failed to reschedule appointment")
  }
}
