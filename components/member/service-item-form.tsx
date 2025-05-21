"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ServiceItemForm({
  onAdd,
}: {
  onAdd: (item: { description: string; price: number }) => void
}) {
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !price) return

    onAdd({
      description,
      price: Number.parseFloat(price),
    })

    setDescription("")
    setPrice("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Service Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Oil change, brake service, etc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <Button type="submit" variant="outline">
        Add Service Item
      </Button>
    </form>
  )
}
