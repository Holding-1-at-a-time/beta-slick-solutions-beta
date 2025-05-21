"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { Car } from "lucide-react"

interface AddVehicleProps {
  orgId: string
}

export function AddVehicle({ orgId }: AddVehicleProps) {
  const router = useRouter()
  const createVehicle = useMutation(api.vehicles.createVehicle)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    vin: "",
    licensePlate: "",
    color: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.make.trim()) {
      newErrors.make = "Make is required"
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required"
    }

    const yearNum = Number(formData.year)
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 1) {
      newErrors.year = "Please enter a valid year"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await createVehicle({
        orgId,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        vin: formData.vin,
        licensePlate: formData.licensePlate,
        color: formData.color,
      })

      router.push(`/org/${orgId}/dashboard/client/vehicles`)
    } catch (error) {
      console.error("Error creating vehicle:", error)
      setErrors((prev) => ({ ...prev, form: "Failed to create vehicle. Please try again." }))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate year options
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-primary/10 p-2">
          <Car className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h2 className="mt-4 text-center text-2xl font-bold">Add a New Vehicle</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Enter your vehicle details below to add it to your account.
      </p>

      {errors.form && (
        <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{errors.form}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="make" className="text-sm font-medium">
              Make <span className="text-destructive">*</span>
            </label>
            <input
              id="make"
              name="make"
              type="text"
              value={formData.make}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.make ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              placeholder="Toyota"
            />
            {errors.make && <p className="text-xs text-destructive">{errors.make}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium">
              Model <span className="text-destructive">*</span>
            </label>
            <input
              id="model"
              name="model"
              type="text"
              value={formData.model}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.model ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
              placeholder="Camry"
            />
            {errors.model && <p className="text-xs text-destructive">{errors.model}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="year" className="text-sm font-medium">
              Year <span className="text-destructive">*</span>
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.year ? "border-destructive" : "border-input"
              } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.year && <p className="text-xs text-destructive">{errors.year}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="color" className="text-sm font-medium">
              Color
            </label>
            <input
              id="color"
              name="color"
              type="text"
              value={formData.color}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Silver"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="licensePlate" className="text-sm font-medium">
              License Plate
            </label>
            <input
              id="licensePlate"
              name="licensePlate"
              type="text"
              value={formData.licensePlate}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="ABC123"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="vin" className="text-sm font-medium">
              VIN
            </label>
            <input
              id="vin"
              name="vin"
              type="text"
              value={formData.vin}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="1HGCM82633A123456"
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push(`/org/${orgId}/dashboard/client/vehicles`)}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  )
}
