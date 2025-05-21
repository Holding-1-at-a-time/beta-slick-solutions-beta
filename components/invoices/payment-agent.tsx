"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils/format-currency"
import { createPaymentIntent, confirmPayment } from "@/app/actions/invoices"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"

interface PaymentAgentProps {
  orgId: string
  userId: string
  invoiceId: string
  remainingBalance: number
}

export function PaymentAgent({ orgId, userId, invoiceId, remainingBalance }: PaymentAgentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentIntent, setPaymentIntent] = useState<any>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const router = useRouter()

  const handlePayNow = async () => {
    try {
      setIsLoading(true)
      const intent = await createPaymentIntent(invoiceId, remainingBalance)
      setPaymentIntent(intent)
      setIsLoading(false)
    } catch (error) {
      console.error("Error creating payment intent:", error)
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    try {
      setPaymentStatus("processing")
      // In a real implementation, this would be called by the Stripe webhook
      // For now, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result = await confirmPayment(paymentIntent.paymentId, paymentIntent.paymentIntentId)

      setPaymentStatus("success")
      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
      })

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (error) {
      console.error("Error confirming payment:", error)
      setPaymentStatus("error")
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setPaymentIntent(null)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing Payment</CardTitle>
          <CardDescription>Please wait while we initialize your payment...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingPlaceholder />
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus === "processing") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Processing Payment</CardTitle>
          <CardDescription>Please wait while we process your payment...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <LoadingPlaceholder message="Processing payment..." />
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus === "success") {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Payment Successful</CardTitle>
          <CardDescription className="text-green-700">
            Your payment of {formatCurrency(remainingBalance)} has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="text-green-600 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>Thank you for your payment!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (paymentStatus === "error") {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">Payment Failed</CardTitle>
          <CardDescription className="text-red-700">
            There was an error processing your payment. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Button onClick={handlePayNow} variant="destructive">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (paymentIntent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Complete Payment</CardTitle>
          <CardDescription>
            Please enter your payment details to pay the remaining balance of {formatCurrency(remainingBalance)}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* In a real implementation, this would be a Stripe Elements form */}
            <div className="space-y-2">
              <label htmlFor="card-number" className="text-sm font-medium">
                Card Number
              </label>
              <input
                id="card-number"
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="expiry" className="text-sm font-medium">
                  Expiry Date
                </label>
                <input
                  id="expiry"
                  type="text"
                  placeholder="MM/YY"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="cvc" className="text-sm font-medium">
                  CVC
                </label>
                <input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handlePaymentSuccess}>Pay {formatCurrency(remainingBalance)}</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Remaining Balance</CardTitle>
        <CardDescription>
          You have a remaining balance of {formatCurrency(remainingBalance)} on this invoice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Pay now to complete your transaction and receive a receipt for your records.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePayNow} className="w-full">
          Pay Now
        </Button>
      </CardFooter>
    </Card>
  )
}
