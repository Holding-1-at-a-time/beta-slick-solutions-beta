"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { FileText, Car, Info } from "lucide-react"

interface NewAssessmentProps {
  orgId: string
  vehicleId: string
}

export function NewAssessment({ orgId, vehicleId }: NewAssessmentProps) {
  const router = useRouter()
  const vehicle = useQuery(api.vehicles.getVehicleById, { orgId, vehicleId })
  const createAssessment = useMutation(api.assessments.createAssessment)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    severity: "medium",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
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
      const assessmentId = await createAssessment({
        orgId,
        vehicleId,
        description: formData.description,
        severity: formData.severity,
      })

      router.push(`/org/${orgId}/dashboard/client/vehicles/${vehicleId}`)
    } catch (error) {
      console.error("Error creating assessment:", error)
      setErrors((prev) => ({ ...prev, form: "Failed to create assessment. Please try again." }))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!vehicle) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-primary/10 p-2">
          <FileText className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h2 className="mt-4 text-center text-2xl font-bold">Request Vehicle Assessment</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Describe the issues with your vehicle to request a professional assessment.
      </p>

      <div className="mt-6 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h3>
            <p className="text-sm text-muted-foreground">
              {vehicle.licensePlate ? `License: ${vehicle.licensePlate}` : ""}
            </p>
          </div>
        </div>
      </div>

      {errors.form && (
        <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{errors.form}</div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-destructive">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className={`w-full rounded-md border ${
              errors.description ? "border-destructive" : "border-input"
            } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            placeholder="Describe the issues with your vehicle in detail..."
          />
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Be specific about the problems you're experiencing with your vehicle.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="severity" className="text-sm font-medium">
            Issue Severity <span className="text-destructive">*</span>
          </label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="low">Low - Minor issues, vehicle is operational</option>
            <option value="medium">Medium - Noticeable problems affecting performance</option>
            <option value="high">High - Serious issues, vehicle may not be safe to drive</option>
            <option value="critical">Critical - Vehicle is not operational</option>
          </select>
        </div>

        <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">What happens next?</h3>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
                <p>
                  After submitting your assessment request, our team will review the details and contact you to schedule
                  an in-person assessment if needed. You'll receive an estimate for any required repairs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push(`/org/${orgId}/dashboard/client/vehicles/${vehicleId}`)}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Assessment Request"}
          </button>
        </div>
      </form>
    </div>
  )
}
