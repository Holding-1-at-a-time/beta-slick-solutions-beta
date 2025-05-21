"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "convex/react"
import { mutation } from "@/convex/_generated/api"
import { ServiceItemForm } from "./service-item-form"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export function FinalizeInvoice({
  orgId,
  appointmentId,
}: {
  orgId: string
  appointmentId: string
}) {
  const router = useRouter()
  const { user } = useUser()
  const userId = user?.id || ""
  const [items, setItems] = useState<Array<{ description: string; price: number }>>([])
  const queryClient = useQueryClient()
  const finalizeMutation = useMutation(mutation("finalizeInvoice"))

  const handleAddItem = (item: { description: string; price: number }) => {
    setItems((prev) => [...prev, item])
  }

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!items.length) {
      toast({
        title: "No items added",
        description: "Please add at least one service item to finalize the invoice.",
        variant: "destructive",
      })
      return
    }

    try {
      await finalizeMutation(orgId, appointmentId, items)
      // Invalidate both "today's appointments" and outstanding invoices
      queryClient.invalidateQueries(["listTodayAppointments", orgId, userId])
      queryClient.invalidateQueries(["listInvoices", orgId, userId])

      toast({
        title: "Invoice finalized",
        description: "The invoice has been successfully created and sent to the customer.",
      })

      router.push(`/${orgId}/dashboard/member`)
    } catch (error) {
      toast({
        title: "Error finalizing invoice",
        description: "There was an error creating the invoice. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finalize Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ServiceItemForm onAdd={handleAddItem} />

        {items.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Service Items</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{item.description}</td>
                      <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                      <td className="p-2">
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t bg-muted">
                    <td className="p-2 font-medium">Total</td>
                    <td className="p-2 text-right font-medium">
                      ${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="ml-auto">
          Finalize and Send Invoice
        </Button>
      </CardFooter>
    </Card>
  )
}
