"use server"

import { auth } from "@clerk/nextjs/server"
import { api } from "@/convex/_generated/api"
import { revalidatePath } from "next/cache"

// Create a payment intent
export async function createPaymentIntent(
  orgId: string,
  appointmentId: string,
  amount: number,
  currency = "USD",
  metadata?: Record<string, any>,
) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await api.payments.createPaymentIntent({
      orgId,
      appointmentId,
      amount,
      currency,
      metadata,
    })

    return result
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw new Error("Failed to create payment intent")
  }
}

// Confirm a payment
export async function confirmPayment(orgId: string, paymentId: string, paymentIntentId: string, status: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await api.payments.confirmPayment({
      orgId,
      paymentId,
      paymentIntentId,
      status,
    })

    revalidatePath(`/${orgId}/dashboard/client/appointments`)
    return result
  } catch (error) {
    console.error("Error confirming payment:", error)
    throw new Error("Failed to confirm payment")
  }
}

// Get payment details
export async function getPayment(orgId: string, paymentId: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await api.payments.getPayment({
      orgId,
      paymentId,
    })

    return result
  } catch (error) {
    console.error("Error getting payment details:", error)
    throw new Error("Failed to get payment details")
  }
}

// List payments
export async function listPayments(orgId: string, page = 1, limit = 10, status?: string) {
  const { userId } = auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  try {
    const result = await api.payments.listPayments({
      orgId,
      page,
      limit,
      status,
    })

    return result
  } catch (error) {
    console.error("Error listing payments:", error)
    throw new Error("Failed to list payments")
  }
}
