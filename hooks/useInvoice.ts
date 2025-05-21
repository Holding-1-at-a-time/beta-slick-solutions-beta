"use client"

import { useState, useEffect } from "react"
import { getInvoiceDetail, createPaymentIntent, confirmPayment } from "@/app/actions/invoices"

export function useInvoice(orgId: string, userId: string, invoiceId: string) {
  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInvoice()
  }, [orgId, userId, invoiceId])

  const fetchInvoice = async () => {
    try {
      setLoading(true)
      const result = await getInvoiceDetail(invoiceId)
      setInvoice(result)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching invoice:", error)
      setError("Failed to load invoice")
      setLoading(false)
    }
  }

  const payInvoice = async (amount?: number) => {
    try {
      const paymentAmount = amount || invoice.remainingBalance
      const paymentIntent = await createPaymentIntent(invoiceId, paymentAmount)
      return paymentIntent
    } catch (error) {
      console.error("Error creating payment intent:", error)
      throw new Error("Failed to create payment intent")
    }
  }

  const confirmInvoicePayment = async (paymentId: string, paymentIntentId: string) => {
    try {
      const result = await confirmPayment(paymentId, paymentIntentId)
      await fetchInvoice() // Refresh invoice data
      return result
    } catch (error) {
      console.error("Error confirming payment:", error)
      throw new Error("Failed to confirm payment")
    }
  }

  return {
    invoice,
    loading,
    error,
    payInvoice,
    confirmInvoicePayment,
    refreshInvoice: fetchInvoice,
  }
}
