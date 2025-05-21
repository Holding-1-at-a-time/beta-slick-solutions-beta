"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/convex"
import { revalidatePath } from "next/cache"

export async function listInvoices(page = 1, filters = {}) {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  try {
    const result = await db.query("listInvoices", {
      orgId,
      userId,
      page,
      limit: 10,
      ...filters,
    })

    return result
  } catch (error) {
    console.error("Error listing invoices:", error)
    throw new Error("Failed to list invoices")
  }
}

export async function getInvoiceDetail(invoiceId) {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  try {
    const invoice = await db.query("getInvoiceDetail", {
      orgId,
      invoiceId,
    })

    return invoice
  } catch (error) {
    console.error("Error getting invoice detail:", error)
    throw new Error("Failed to get invoice detail")
  }
}

export async function createPaymentIntent(invoiceId, amount) {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  try {
    const paymentIntent = await db.mutation("createPaymentIntent", {
      orgId,
      invoiceId,
      amount,
    })

    return paymentIntent
  } catch (error) {
    console.error("Error creating payment intent:", error)
    throw new Error("Failed to create payment intent")
  }
}

export async function confirmPayment(paymentId, paymentIntentId) {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  try {
    const result = await db.mutation("confirmPayment", {
      orgId,
      paymentId,
      paymentIntentId,
    })

    // Revalidate the invoice page
    revalidatePath(`/${orgId}/dashboard/client/invoices`)
    revalidatePath(`/${orgId}/dashboard/client/invoices/${result.invoiceId}`)

    return result
  } catch (error) {
    console.error("Error confirming payment:", error)
    throw new Error("Failed to confirm payment")
  }
}

export async function getInvoiceStatistics(invoiceId) {
  const { userId, orgId } = auth()
  if (!userId || !orgId) {
    throw new Error("Unauthorized: Must be signed in with an organization")
  }

  try {
    const statistics = await db.query("getInvoiceStatistics", {
      orgId,
      invoiceId,
    })

    return statistics
  } catch (error) {
    console.error("Error getting invoice statistics:", error)
    throw new Error("Failed to get invoice statistics")
  }
}
