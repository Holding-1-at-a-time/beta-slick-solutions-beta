import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import { useMutation } from "convex/react"

export function useInvoice(orgId: string, userId: string, invoiceId: string) {
  const invoice = useQuery(api.invoices.getInvoiceById, { orgId, userId, invoiceId })
  const loading = invoice === undefined

  const initiatePayment = useMutation(api.invoices.initiateInvoicePayment)
  const confirmPayment = useMutation(api.invoices.confirmInvoicePayment)

  const payInvoice = async () => {
    if (!invoice) return null

    const paymentIntent = await initiatePayment({ orgId, userId, invoiceId })
    return paymentIntent
  }

  const completePayment = async (paymentIntentId: string) => {
    await confirmPayment({ orgId, userId, invoiceId, paymentIntentId })
  }

  return {
    invoice,
    loading,
    payInvoice,
    completePayment,
  }
}
