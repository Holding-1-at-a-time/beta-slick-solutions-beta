"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import type { Id } from "@/convex/_generated/dataModel"

// Hook to get the current tenant ID from URL params
export const useTenantId = () => {
  const params = useParams<{ orgId: string }>()
  return params.orgId
}

// Hook to get today's appointments
export const useTodayAppointments = () => {
  const tenantId = useTenantId()
  const appointments = useQuery(api.member.getTodayAppointments, { tenantId })

  return {
    appointments: appointments || [],
    isLoading: appointments === undefined,
  }
}

// Hook to update appointment status
export const useUpdateAppointmentStatus = () => {
  const tenantId = useTenantId()
  const updateStatus = useMutation(api.member.updateAppointmentStatus)

  return async (appointmentId: Id<"appointments">, status: string) => {
    return await updateStatus({ tenantId, appointmentId, status })
  }
}

// Hook to finalize invoice
export const useFinalizeInvoice = () => {
  const tenantId = useTenantId()
  const finalize = useMutation(api.member.finalizeInvoice)

  return async (
    appointmentId: Id<"appointments">,
    items: Array<{ description: string; quantity: number; unitPrice: number }>,
  ) => {
    return await finalize({ tenantId, appointmentId, items })
  }
}

// Hook to get pending assessments
export const usePendingAssessments = () => {
  const tenantId = useTenantId()
  const assessments = useQuery(api.member.getPendingAssessments, { tenantId })

  return {
    assessments: assessments || [],
    isLoading: assessments === undefined,
  }
}

// Hook to get assessment details
export const useAssessment = (assessmentId: Id<"assessments">) => {
  const tenantId = useTenantId()
  const assessment = useQuery(api.member.getAssessment, { tenantId, assessmentId })

  return {
    assessment,
    isLoading: assessment === undefined,
  }
}

// Hook to create estimate
export const useCreateEstimate = () => {
  const tenantId = useTenantId()
  const createEstimate = useMutation(api.member.createEstimate)

  return async (
    assessmentId: Id<"assessments">,
    serviceItems: Array<{ description: string; estimatedCost: number }>,
  ) => {
    return await createEstimate({ tenantId, assessmentId, serviceItems })
  }
}

// Hook to get customers
export const useCustomers = () => {
  const tenantId = useTenantId()
  const customers = useQuery(api.member.getCustomers, { tenantId })

  return {
    customers: customers || [],
    isLoading: customers === undefined,
  }
}

// Hook to get customer details
export const useCustomer = (customerId: Id<"users">) => {
  const tenantId = useTenantId()
  const customer = useQuery(api.member.getCustomer, { tenantId, customerId })

  return {
    customer,
    isLoading: customer === undefined,
  }
}

// Hook to get customer vehicles
export const useCustomerVehicles = (customerId: Id<"users">) => {
  const tenantId = useTenantId()
  const vehicles = useQuery(api.member.getCustomerVehicles, { tenantId, customerId })

  return {
    vehicles: vehicles || [],
    isLoading: vehicles === undefined,
  }
}

// Hook to get customer assessments
export const useCustomerAssessments = (customerId: Id<"users">) => {
  const tenantId = useTenantId()
  const assessments = useQuery(api.member.getCustomerAssessments, { tenantId, customerId })

  return {
    assessments: assessments || [],
    isLoading: assessments === undefined,
  }
}

// Hook to get customer appointments
export const useCustomerAppointments = (customerId: Id<"users">) => {
  const tenantId = useTenantId()
  const appointments = useQuery(api.member.getCustomerAppointments, { tenantId, customerId })

  return {
    appointments: appointments || [],
    isLoading: appointments === undefined,
  }
}

// Hook to get member profile
export const useMemberProfile = () => {
  const tenantId = useTenantId()
  const profile = useQuery(api.member.getMemberProfile, { tenantId })

  return {
    profile,
    isLoading: profile === undefined,
  }
}

// Hook to update member profile
export const useUpdateMemberProfile = () => {
  const tenantId = useTenantId()
  const updateProfile = useMutation(api.member.updateMemberProfile)

  return async (profileData: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    imageUrl?: string
  }) => {
    return await updateProfile({ tenantId, profileData })
  }
}

// Hook to get member notifications
export const useMemberNotifications = () => {
  const tenantId = useTenantId()
  const notifications = useQuery(api.member.getMemberNotifications, { tenantId })

  return {
    notifications: notifications || [],
    isLoading: notifications === undefined,
    unreadCount: notifications?.filter((n) => !n.isRead).length || 0,
  }
}

// Hook to mark notification as read
export const useMarkNotificationRead = () => {
  const tenantId = useTenantId()
  const markRead = useMutation(api.member.markNotificationRead)

  return async (notificationId: Id<"notifications">) => {
    return await markRead({ tenantId, notificationId })
  }
}

// Hook to get member analytics
export const useMemberAnalytics = (period = "week") => {
  const tenantId = useTenantId()
  const analytics = useQuery(api.member.getMemberAnalytics, { tenantId, period })

  return {
    analytics,
    isLoading: analytics === undefined,
  }
}
