"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useAuth } from "@clerk/nextjs"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { formatCurrency } from "@/lib/utils/format-currency"
import { formatDate } from "@/lib/utils/format-date"

export function InvoiceDetail({ orgId, invoiceId }: { orgId: string; invoiceId: string }) {
  const { userId } = useAuth()
  const { data: invoice, isLoading } = useQuery(api.invoices.getInvoice, orgId, userId as string, invoiceId)
  const payInvoice = useMutation(api.invoices.payInvoice)

  const handlePayInvoice = async () => {
    await payInvoice(orgId, userId as string, invoiceId, "credit_card")
  }

  if (isLoading) {
    return <LoadingPlaceholder />
  }

  if (!invoice) {
    return <div className="text-center py-8">Invoice not found</div>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold">Invoice #{invoiceId.slice(-6).toUpperCase()}</h2>
          <p className="text-gray-600">Created: {formatDate(invoice.createdAt)}</p>
          <p className="text-gray-600">Due: {formatDate(invoice.dueDate)}</p>
        </div>
        <div>
          <span
            className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
              invoice.status === "paid"
                ? "bg-green-100 text-green-800"
                : invoice.status === "overdue"
                  ? "bg-red-100 text-red-800"
                  : invoice.status === "sent"
                    ? "bg-blue-100 text-blue-800"
                    : invoice.status === "draft"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Service Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="font-medium">Subtotal:</span>
            <span>{formatCurrency(invoice.amount)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200">
            <span className="font-bold">Total:</span>
            <span className="font-bold">{formatCurrency(invoice.amount)}</span>
          </div>
        </div>
      </div>

      {(invoice.status === "sent" || invoice.status === "overdue") && (
        <div className="flex justify-end">
          <button onClick={handlePayInvoice} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Pay Now
          </button>
        </div>
      )}

      {invoice.status === "paid" && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">
            <span className="font-semibold">Payment Received:</span> {formatDate(invoice.paidAt || 0)}
          </p>
        </div>
      )}
    </div>
  )
}
