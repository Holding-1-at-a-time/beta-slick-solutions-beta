"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ServiceItem {
  description: string
  quantity: number
  unitPrice: number
}

export default function ServiceItemForm({
  onAdd,
}: {
  onAdd: (item: ServiceItem) => void
}) {
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState<number>(1)
  const [unitPrice, setUnitPrice] = useState<number>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description || quantity <= 0 || unitPrice <= 0) return

    onAdd({
      description,
      quantity,
      unitPrice,
    })

    // Reset form
    setDescription("")
    setQuantity(1)
    setUnitPrice(0)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Service description"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <Label htmlFor="unitPrice">Unit Price ($)</Label>
            <Input
              id="unitPrice"
              type="number"
              min="0.01"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Add Item</Button>
      </div>
    </form>
  )
}
