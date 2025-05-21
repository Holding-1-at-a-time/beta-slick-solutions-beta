"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Download, CreditCard } from "lucide-react"
import PaymentForm from "./payment-form"

export interface Invoice {
  id: string
  invoiceNumber: string
  customerId: string
  vehicleId: string
  assessmentId: string
  tenantId: string
  amount: number
  tax: number
  total: number
  status: "draft" | "pending" | "paid" | "overdue" | "cancelled"
  dueDate: number
  items: {
    id: string
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  createdAt: number
  updatedAt: number
}

export interface Payment {
  id: string
  invoiceId: string
  amount: number
  method: "credit_card" | "debit_card" | "bank_transfer" | "cash" | "check"
  status: "pending" | "completed" | "failed" | "refunded"
  transactionId?: string
  isDeposit: boolean
  createdAt: number
}

interface InvoiceViewerProps {
  invoice: Invoice
  payments: Payment[]
  onPay?: () => void
}

export default function InvoiceViewer({ invoice, payments, onPay }: InvoiceViewerProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  // Calculate remaining balance
  const totalPaid = payments
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const remainingBalance = invoice.total - totalPaid

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Get status badge color
  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get payment status badge color
  const getPaymentStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle download invoice
  const handleDownload = () => {
    // In a real implementation, this would generate a PDF
    console.log("Downloading invoice:", invoice.invoiceNumber)
  }

  // Handle payment completion
  const handlePaymentComplete = () => {
    setShowPaymentForm(false)
    if (onPay) {
      onPay()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
          <div>
            <CardTitle>Invoice #{invoice.invoiceNumber}</CardTitle>
            <CardDescription>Issued on {format(new Date(invoice.createdAt), "MMMM d, yyyy")}</CardDescription>
          </div>
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bill To</h3>
              <p className="font-medium">Customer ID: {invoice.customerId}</p>
              <p>Vehicle ID: {invoice.vehicleId}</p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-500">Payment Details</h3>
              <p className="font-medium">Due Date: {format(new Date(invoice.dueDate), "MMMM d, yyyy")}</p>
              <p>Assessment ID: {invoice.assessmentId}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Invoice Items</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left font-medium text-gray-500">Description</th>
                    <th className="py-2 text-right font-medium text-gray-500">Qty</th>
                    <th className="py-2 text-right font-medium text-gray-500">Unit Price</th>
                    <th className="py-2 text-right font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3">{item.description}</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="py-3 text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="py-3 text-right font-medium">
                      Subtotal
                    </td>
                    <td className="py-3 text-right">{formatCurrency(invoice.amount)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-3 text-right font-medium">
                      Tax
                    </td>
                    <td className="py-3 text-right">{formatCurrency(invoice.tax)}</td>
                  </tr>
                  <tr className="border-t">
                    <td colSpan={3} className="py-3 text-right font-medium">
                      Total
                    </td>
                    <td className="py-3 text-right font-medium">{formatCurrency(invoice.total)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-3 text-right font-medium">
                      Amount Paid
                    </td>
                    <td className="py-3 text-right">{formatCurrency(totalPaid)}</td>
                  </tr>
                  <tr className="border-t">
                    <td colSpan={3} className="py-3 text-right font-medium">
                      Balance Due
                    </td>
                    <td className="py-3 text-right font-bold">{formatCurrency(remainingBalance)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {payments.length > 0 && (
            <>
              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left font-medium text-gray-500">Date</th>
                        <th className="py-2 text-left font-medium text-gray-500">Method</th>
                        <th className="py-2 text-left font-medium text-gray-500">Type</th>
                        <th className="py-2 text-left font-medium text-gray-500">Status</th>
                        <th className="py-2 text-right font-medium text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b">
                          <td className="py-3">{format(new Date(payment.createdAt), "MMM d, yyyy")}</td>
                          <td className="py-3 capitalize">{payment.method.replace("_", " ")}</td>
                          <td className="py-3">{payment.isDeposit ? "Deposit" : "Payment"}</td>
                          <td className="py-3">
                            <Badge className={getPaymentStatusColor(payment.status)}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">{formatCurrency(payment.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
        <Button variant="outline" className="w-full sm:w-auto flex items-center py-6 sm:py-2" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Invoice
        </Button>

        {remainingBalance > 0 && invoice.status !== "cancelled" && (
          <Button className="w-full sm:w-auto flex items-center py-6 sm:py-2" onClick={() => setShowPaymentForm(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Make Payment
          </Button>
        )}
      </CardFooter>

      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <Card className="w-full max-w-[95%] sm:max-w-md">
            <CardHeader>
              <CardTitle>Make a Payment</CardTitle>
              <CardDescription>Pay your invoice securely</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm
                invoice={invoice}
                amount={remainingBalance}
                isDeposit={false}
                onSubmit={handlePaymentComplete}
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Card>
  )
}
