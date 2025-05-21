"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Invoice } from "./invoice-viewer"

// Define the payment form schema using Zod
const paymentFormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^[0-9\s-]+$/, "Card number must contain only digits, spaces, or hyphens"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry date must be in MM/YY format"),
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must be at most 4 digits")
    .regex(/^[0-9]+$/, "CVV must contain only digits"),
  paymentMethod: z.enum(["credit_card", "debit_card"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
})

export type PaymentFormData = z.infer<typeof paymentFormSchema>

interface PaymentFormProps {
  invoice: Invoice
  amount: number
  isDeposit: boolean
  onSubmit?: () => void
}

export default function PaymentForm({ invoice, amount, isDeposit, onSubmit }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mutations
  const createPayment = useMutation(api.payments.createPayment)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
      paymentMethod: "credit_card",
      amount: amount,
    },
  })

  const handleSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true)

    try {
      // In a real implementation, this would call a payment processor API
      await createPayment({
        invoiceId: invoice.id,
        amount: data.amount,
        method: data.paymentMethod,
        isDeposit,
      })

      toast({
        title: "Payment successful",
        description: `Your payment of ${formatCurrency(data.amount)} has been processed successfully.`,
      })

      if (onSubmit) {
        onSubmit()
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, "").replace(/^(.{2})(.+)$/, "$1/$2")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={amount}
                  {...field}
                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                  className="h-12 sm:h-10"
                />
              </FormControl>
              <FormDescription>
                {isDeposit ? "Enter the deposit amount" : `Maximum amount: ${formatCurrency(amount)}`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="debit_card">Debit Card</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="4111 1111 1111 1111"
                  {...field}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value)
                    field.onChange(formatted)
                  }}
                  maxLength={19}
                  className="h-12 sm:h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cardholder Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} className="h-12 sm:h-10" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input
                    placeholder="MM/YY"
                    {...field}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value)
                      field.onChange(formatted)
                    }}
                    maxLength={5}
                    className="h-12 sm:h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="123" {...field} maxLength={4} className="h-12 sm:h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full py-6 sm:py-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner className="mr-2" />
              Processing...
            </>
          ) : (
            `Pay ${formatCurrency(form.watch("amount"))}`
          )}
        </Button>
      </form>
    </Form>
  )
}
