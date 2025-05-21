"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { createPaymentIntent, confirmPayment } from "@/app/actions/payments"
import { useToast } from "@/hooks/use-toast"

interface PayDepositProps {
  orgId: string
  appointmentId: string
  depositAmount: number
  stripeAccountId?: string
}

export function PayDeposit({ orgId, appointmentId, depositAmount, stripeAccountId }: PayDepositProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const { toast } = useToast()
  const router = useRouter()

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStatus("processing")

    try {
      // Create a payment intent
      const { clientSecret, paymentId } = await createPaymentIntent(
        orgId,
        appointmentId,
        depositAmount,
        stripeAccountId,
      )

      // In a real implementation, this would use Stripe Elements to collect payment
      // For now, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Confirm the payment
      await confirmPayment(orgId, paymentId, clientSecret.split("_")[0])

      setPaymentStatus("success")
      toast({
        title: "Success",
        description: "Deposit payment successful.",
      })

      // Redirect to the thank you page
      router.push(`/dashboard/client/appointments/${appointmentId}/reschedule/thank-you`)
    } catch (error) {
      console.error("Payment failed:", error)
      setPaymentStatus("error")
      toast({
        title: "Error",
        description: "Payment failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (paymentStatus === "processing") {
    return <LoadingPlaceholder message="Processing payment..." />
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Pay Deposit</CardTitle>
        <CardDescription>A deposit is required to confirm your appointment.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Deposit Amount:</span>
            <span className="font-semibold">{formatCurrency(depositAmount)}</span>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>This deposit will be applied to your final invoice.</p>
            <p>Cancellations less than 24 hours before the appointment may forfeit the deposit.</p>
          </div>

          {/* In a real implementation, this would be a Stripe Elements form */}
          <div className="rounded-md border p-4">
            <div className="space-y-2">
              <div>
                <label htmlFor="card-number" className="text-sm font-medium">
                  Card Number
                </label>
                <div className="mt-1 border rounded-md p-2 bg-muted/50">•••• •••• •••• 4242</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="expiry" className="text-sm font-medium">
                    Expiry
                  </label>
                  <div className="mt-1 border rounded-md p-2 bg-muted/50">12/25</div>
                </div>
                <div>
                  <label htmlFor="cvc" className="text-sm font-medium">
                    CVC
                  </label>
                  <div className="mt-1 border rounded-md p-2 bg-muted/50">•••</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handlePayment} className="w-full" disabled={isProcessing}>
          {isProcessing ? "Processing..." : `Pay ${formatCurrency(depositAmount)}`}
        </Button>
      </CardFooter>
    </Card>
  )
}
