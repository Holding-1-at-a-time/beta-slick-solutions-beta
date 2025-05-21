"use client"

import type React from "react"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Define the Vehicle type based on your schema
export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  color: string
  userId: string
  tenantId: string
  createdAt: number
  updatedAt: number
}

// Define the form schema using Zod
export const vehicleFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce
    .number()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear() + 1, `Year must be before ${new Date().getFullYear() + 1}`),
  vin: z
    .string()
    .min(17, "VIN must be 17 characters")
    .max(17, "VIN must be 17 characters")
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "Invalid VIN format"),
  licensePlate: z.string().min(1, "License plate is required"),
  color: z.string().min(1, "Color is required"),
})

export type VehicleFormData = z.infer<typeof vehicleFormSchema>

export interface VehicleFormProps {
  initialData?: Partial<Vehicle>
  userId: string
  tenantId: string
  onSubmit?: (data: VehicleFormData) => void
  onSuccess?: (vehicle: Vehicle) => void
  renderInCard?: boolean
  cardProps?: Partial<React.ComponentProps<typeof Card>>
  submitButtonText?: string
  cancelButtonText?: string
  onCancel?: () => void
  showCancelButton?: boolean
}

export default function VehicleForm({
  initialData,
  userId,
  tenantId,
  onSubmit,
  onSuccess,
  renderInCard = true,
  cardProps,
  submitButtonText,
  cancelButtonText = "Cancel",
  onCancel,
  showCancelButton = false,
}: VehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createVehicle = useMutation(api.vehicles.createVehicle)
  const updateVehicle = useMutation(api.vehicles.updateVehicle)

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      make: initialData?.make || "",
      model: initialData?.model || "",
      year: initialData?.year || new Date().getFullYear(),
      vin: initialData?.vin || "",
      licensePlate: initialData?.licensePlate || "",
      color: initialData?.color || "",
    },
  })

  const handleSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true)

    try {
      if (onSubmit) {
        onSubmit(data)
      } else {
        // If no custom onSubmit is provided, use the default Convex mutations
        let result

        if (initialData?.id) {
          // Update existing vehicle
          result = await updateVehicle({
            id: initialData.id,
            ...data,
          })
        } else {
          // Create new vehicle
          result = await createVehicle({
            ...data,
            userId,
            tenantId,
          })
        }

        toast({
          title: initialData?.id ? "Vehicle updated" : "Vehicle added",
          description: `${data.year} ${data.make} ${data.model} has been ${initialData?.id ? "updated" : "added"} successfully.`,
        })

        if (onSuccess && result) {
          onSuccess(result as Vehicle)
        }
      }
    } catch (error) {
      console.error("Error submitting vehicle form:", error)
      toast({
        title: "Error",
        description: `Failed to ${initialData?.id ? "update" : "add"} vehicle. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate year options from 1900 to current year + 1
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 1900 + 2 }, (_, i) => currentYear + 1 - i)

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Camry" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number.parseInt(value))}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="Silver" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Plate</FormLabel>
                <FormControl>
                  <Input placeholder="ABC123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VIN</FormLabel>
              <FormControl>
                <Input placeholder="1HGCM82633A004352" {...field} />
              </FormControl>
              <FormDescription>Vehicle Identification Number (17 characters)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={`flex ${showCancelButton ? "justify-between" : "justify-end"} gap-4`}>
          {showCancelButton && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelButtonText}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner className="mr-2" />
                {initialData?.id ? "Updating..." : "Adding..."}
              </>
            ) : (
              submitButtonText || (initialData?.id ? "Update Vehicle" : "Add Vehicle")
            )}
          </Button>
        </div>
      </form>
    </Form>
  )

  if (renderInCard) {
    return (
      <Card className="w-full max-w-2xl mx-auto px-2 sm:px-4" {...cardProps}>
        <CardHeader>
          <CardTitle>{initialData?.id ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
          <CardDescription>
            {initialData?.id
              ? "Update your vehicle information below."
              : "Enter your vehicle details to add it to your account."}
          </CardDescription>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    )
  }

  return formContent
}
