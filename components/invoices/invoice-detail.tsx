"use client"

import { useInvoice } from "@/hooks/useInvoice"
import { formatCurrency } from "@/lib/utils/format-currency"
import { formatDate } from "@/lib/utils/format-date"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface InvoiceDetailProps {
  orgId: string
  userId: string
  invoiceId: string
}

export function InvoiceDetail({ orgId, userId, invoiceId }: InvoiceDetailProps) {
  const { invoice, loading, payInvoice } = useInvoice(orgId, userId, invoiceId)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      const paymentIntent = await payInvoice()

      if (paymentIntent) {
        // In a real app, this would redirect to a Stripe checkout page
        // For now, we'll simulate a successful payment after a delay
        setTimeout(() => {
          toast({
            title: "Payment successful",
            description: `Invoice #${invoice?.invoiceNumber} has been paid.`,
          })
          router.refresh()
          setIsProcessing(false)
        }, 2000)
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <LoadingPlaceholder />
  }

  if (!invoice) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Invoice not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold text-lg">Invoice Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span>{formatDate(invoice.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Due Date</span>
              <span>{formatDate(invoice.dueDate)}</span>
            </div>
            {invoice.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Paid Date</span>
                <span>{formatDate(invoice.paidAt)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Vehicle</span>
              <span>
                {invoice.vehicle ? `${invoice.vehicle.make} ${invoice.vehicle.model} (${invoice.vehicle.year})` : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold text-lg">Payment Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatCurrency(invoice.subtotal || invoice.amount)}</span>
            </div>
            {invoice.tax && (
              <div className="flex justify-between">
                <span className="text-gray-500">Tax</span>
                <span>{formatCurrency(invoice.tax)}</span>
              </div>
            )}
            {invoice.discount && (
              <div className="flex justify-between">
                <span className="text-gray-500">Discount</span>
                <span>-{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(invoice.amount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold text-lg">Line Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Quantity</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Unit Price</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoice.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm">{item.description}</td>
                  <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {invoice.status !== "paid" && (
        <div className="flex justify-end">
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      )}
    </div>
  )
}
