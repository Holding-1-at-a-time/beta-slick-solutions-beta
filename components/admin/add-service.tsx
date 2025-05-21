"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "convex/react"
import { mutation } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function AddService() {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    category: "",
    estimatedDuration: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const queryClient = useQueryClient()
  const createService = useMutation(mutation("createService"))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createService({
        name: form.name,
        description: form.description,
        basePrice: Number(form.basePrice),
        category: form.category,
        estimatedDuration: Number(form.estimatedDuration),
      })

      // Reset form and close dialog
      setForm({
        name: "",
        description: "",
        basePrice: "",
        category: "",
        estimatedDuration: "",
      })
      setIsOpen(false)

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries(["listServices"])
    } catch (error) {
      console.error("Failed to create service:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Service</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium mb-1 block">Service Name</label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Service Name" required />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Base Price ($)</label>
              <Input
                name="basePrice"
                type="number"
                step="0.01"
                value={form.basePrice}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Duration (minutes)</label>
              <Input
                name="estimatedDuration"
                type="number"
                value={form.estimatedDuration}
                onChange={handleChange}
                placeholder="Duration in minutes"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Service description"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
