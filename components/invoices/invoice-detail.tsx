"use client"

import { useInvoice } from "@/hooks/useInvoice"
import { formatCurrency } from "@/lib/utils/format-currency"
import { formatDate } from "@/lib/utils/format-date"
import { Badge } from "@/components/ui/badge"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PaymentAgent } from "@/components/invoices/payment-agent"
import { AIInsightsCard } from "@/components/invoices/ai-insights-card"

interface InvoiceDetailProps {
  orgId: string
  userId: string
  invoiceId: string
}

export function InvoiceDetail({ orgId, userId, invoiceId }: InvoiceDetailProps) {
  const { invoice, loading, payInvoice } = useInvoice(orgId, userId, invoiceId)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

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
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  {invoice.vehicle
                    ? `${invoice.vehicle.make} ${invoice.vehicle.model} (${invoice.vehicle.year})`
                    : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(invoice.amount)}</span>
              </div>
              {invoice.depositAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Deposit Paid</span>
                  <span>-{formatCurrency(invoice.depositAmount)}</span>
                </div>
              )}
              {invoice.remainingBalance > 0 && (
                <div className="flex justify-between font-bold">
                  <span>Remaining Balance</span>
                  <span>{formatCurrency(invoice.remainingBalance)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {invoice.remainingBalance > 0 && invoice.status !== "paid" && (
        <PaymentAgent orgId={orgId} userId={userId} invoiceId={invoiceId} remainingBalance={invoice.remainingBalance} />
      )}

      <AIInsightsCard orgId={orgId} userId={userId} invoiceId={invoiceId} />
    </div>
  )
}
