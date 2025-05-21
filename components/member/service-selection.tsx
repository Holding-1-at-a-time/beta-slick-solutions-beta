"use client"

import type React from "react"

import { useState } from "react"
import { useCreateEstimate } from "@/hooks/useMember"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import type { Id } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"

// Initial suggested services based on AI analysis
const initialSuggestions = [
  { description: "Bumper Repair", estimatedCost: 350 },
  { description: "Hood Repainting", estimatedCost: 200 },
  { description: "Headlight Replacement", estimatedCost: 180 },
]

export default function ServiceSelection({
  assessmentId,
}: {
  assessmentId: Id<"assessments">
}) {
  const router = useRouter()
  const createEstimate = useCreateEstimate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for service items
  const [serviceItems, setServiceItems] = useState(initialSuggestions)

  // Add a new empty service item
  const addServiceItem = () => {
    setServiceItems([...serviceItems, { description: "", estimatedCost: 0 }])
  }

  // Remove a service item
  const removeServiceItem = (index: number) => {
    setServiceItems(serviceItems.filter((_, i) => i !== index))
  }

  // Update a service item
  const updateServiceItem = (index: number, field: string, value: string | number) => {
    const updatedItems = [...serviceItems]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "estimatedCost" ? Number(value) : value,
    }
    setServiceItems(updatedItems)
  }

  // Calculate total estimated cost
  const totalCost = serviceItems.reduce((sum, item) => sum + item.estimatedCost, 0)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate service items
    const validItems = serviceItems.filter((item) => item.description.trim() !== "" && item.estimatedCost > 0)

    if (validItems.length === 0) {
      toast({
        title: "No valid service items",
        description: "Please add at least one service item with description and cost.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createEstimate(assessmentId, validItems)
      toast({
        title: "Estimate created",
        description: "The estimate has been sent to the customer.",
      })
      router.push("../pending")
    } catch (error) {
      toast({
        title: "Error creating estimate",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {serviceItems.map((item, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-grow">
              <Label htmlFor={`description-${index}`}>Service Description</Label>
              <Input
                id={`description-${index}`}
                value={item.description}
                onChange={(e) => updateServiceItem(index, "description", e.target.value)}
                placeholder="Enter service description"
                required
              />
            </div>
            <div className="w-32">
              <Label htmlFor={`cost-${index}`}>Cost ($)</Label>
              <Input
                id={`cost-${index}`}
                type="number"
                min="0"
                step="0.01"
                value={item.estimatedCost}
                onChange={(e) => updateServiceItem(index, "estimatedCost", e.target.value)}
                required
              />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeServiceItem(index)}>
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" onClick={addServiceItem} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Add Service Item</span>
        </Button>

        <div className="text-lg font-medium">Total: ${totalCost.toFixed(2)}</div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
          {isSubmitting ? "Creating Estimate..." : "Create Estimate"}
        </Button>
      </div>
    </form>
  )
}
