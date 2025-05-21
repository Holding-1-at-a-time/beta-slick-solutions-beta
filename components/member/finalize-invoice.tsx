"use client"

import { useState } from "react"
import { useFinalizeInvoice } from "@/hooks/useMember"
import ServiceItemForm from "./service-item-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

interface ServiceItem {
  description: string
  quantity: number
  unitPrice: number
}

export default function FinalizeInvoice({
  appointmentId,
}: {
  appointmentId: Id<"appointments">
}) {
  const router = useRouter()
  const [items, setItems] = useState<ServiceItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const finalizeInvoice = useFinalizeInvoice()

  const handleAddItem = (item: ServiceItem) => {
    setItems((prev) => [...prev, item])
  }

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  }

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one service item before finalizing.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await finalizeInvoice(appointmentId, items)
      toast({
        title: "Invoice created",
        description: "The invoice has been created successfully.",
      })
      router.push("../appointments")
    } catch (error) {
      toast({
        title: "Error creating invoice",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Finalize Invoice</h2>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Add Service Items</h3>
        <ServiceItemForm onAdd={handleAddItem} />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Service Items</h3>
        {items.length === 0 ? (
          <p className="text-gray-500">No items added yet.</p>
        ) : (
          <div className="space-y-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Description</th>
                  <th className="text-right pb-2">Quantity</th>
                  <th className="text-right pb-2">Unit Price</th>
                  <th className="text-right pb-2">Total</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.description}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">${item.unitPrice.toFixed(2)}</td>
                    <td className="text-right py-2">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                    <td className="text-right py-2">
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="text-right font-medium pt-2">
                    Total:
                  </td>
                  <td className="text-right font-medium pt-2">${calculateTotal().toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? "Finalizing..." : "Finalize Invoice"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
