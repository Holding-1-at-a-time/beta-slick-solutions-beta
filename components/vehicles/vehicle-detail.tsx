"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { Car, Plus, Wrench } from "lucide-react"
import { VehicleAssessments } from "./vehicle-assessments"

interface VehicleDetailProps {
  orgId: string
  vehicleId: string
}

export function VehicleDetail({ orgId, vehicleId }: VehicleDetailProps) {
  const router = useRouter()
  const vehicle = useQuery(api.vehicles.getVehicleById, { orgId, vehicleId })

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
    <div className="flex flex-col space-y-8">
      {/* Vehicle details card */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-primary" />
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">{vehicle.year}</p>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {vehicle.licensePlate && (
              <div className="space-y-1">
                <p className="text-sm font-medium">License Plate</p>
                <p className="text-sm">{vehicle.licensePlate}</p>
              </div>
            )}
            {vehicle.vin && (
              <div className="space-y-1">
                <p className="text-sm font-medium">VIN</p>
                <p className="text-sm">{vehicle.vin}</p>
              </div>
            )}
            {vehicle.color && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Color</p>
                <p className="text-sm">{vehicle.color}</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium">Added On</p>
              <p className="text-sm">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end p-6 pt-0">
          <button
            onClick={() => router.push(`/org/${orgId}/dashboard/client/vehicles/${vehicleId}/assessments/new`)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <Plus className="mr-2 h-4 w-4" />
            Request Assessment
          </button>
        </div>
      </div>

      {/* Vehicle service history */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center space-x-2">
            <Wrench className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold leading-none tracking-tight">Service History</h3>
          </div>
          <p className="text-sm text-muted-foreground">View past assessments and service records for this vehicle.</p>
        </div>
        <div className="p-6 pt-0">
          <VehicleAssessments orgId={orgId} vehicleId={vehicleId} />
        </div>
      </div>
    </div>
  )
}
