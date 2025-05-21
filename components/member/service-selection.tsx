"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "convex/react"
import { query, mutation } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function ServiceSelection({
  assessmentId,
  orgId,
}: {
  assessmentId: string
  orgId: string
}) {
  const router = useRouter()
  const { user } = useUser()
  const userId = user?.id || ""

  // In a real implementation, this would fetch AI suggestions
  const aiSuggested = useQuery(query("getAISuggestions"), orgId, assessmentId) || [
    { description: "Front bumper replacement", estimatedCost: 850 },
    { description: "Headlight alignment", estimatedCost: 120 },
    { description: "Touch-up paint for hood scratches", estimatedCost: 75 },
  ]

  const [items, setItems] = useState<Array<{ description: string; estimatedCost: number }>>(aiSuggested)
  const queryClient = useQueryClient()
  const createEstimateMutation = useMutation(mutation("createEstimate"))

  // Synchronize state when suggestions update
  useEffect(() => {
    if (aiSuggested.length > 0) {
      setItems(aiSuggested)
    }
  }, [aiSuggested])

  const handleChange = (idx: number, field: "description" | "estimatedCost", value: any) => {
    setItems((prev) => prev.map((i, j) => (j === idx ? { ...i, [field]: value } : i)))
  }

  const handleRemove = (idx: number) => {
    setItems((prev) => prev.filter((_, j) => j !== idx))
  }

  const handleAdd = () => {
    setItems((prev) => [...prev, { description: "", estimatedCost: 0 }])
  }

  const handleSubmit = async () => {
    if (!items.length) {
      toast({
        title: "No service items",
        description: "Please add at least one service item to create an estimate.",
        variant: "destructive",
      })
      return
    }

    try {
      await createEstimateMutation(orgId, assessmentId, items)
      // Invalidate related queries
      queryClient.invalidateQueries(["listPendingAssessments", orgId, userId])

      toast({
        title: "Estimate created",
        description: "The estimate has been successfully created and sent to the customer.",
      })

      router.push(`/${orgId}/dashboard/member`)
    } catch (error) {
      toast({
        title: "Error creating estimate",
        description: "There was an error creating the estimate. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Service Items</h3>
        <Button variant="outline" size="sm" onClick={handleAdd}>
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b pb-4">
            <div className="md:col-span-7 space-y-2">
              <Label htmlFor={`description-${idx}`}>Description</Label>
              <Input
                id={`description-${idx}`}
                value={item.description}
                onChange={(e) => handleChange(idx, "description", e.target.value)}
                placeholder="Service description"
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <Label htmlFor={`cost-${idx}`}>Estimated Cost ($)</Label>
              <Input
                id={`cost-${idx}`}
                type="number"
                step="0.01"
                min="0"
                value={item.estimatedCost}
                onChange={(e) => handleChange(idx, "estimatedCost", Number.parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>

            <div className="md:col-span-2">
              <Button variant="ghost" size="sm" onClick={() => handleRemove(idx)} className="w-full">
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="font-medium">
            Total Estimate: ${items.reduce((sum, item) => sum + (item.estimatedCost || 0), 0).toFixed(2)}
          </div>
          <Button onClick={handleSubmit}>Create Estimate</Button>
        </div>
      )}
    </div>
  )
}
