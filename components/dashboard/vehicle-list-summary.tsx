"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car } from "lucide-react"

interface Vehicle {
  _id: string
  make: string
  model: string
  year: number
  licensePlate?: string
}

interface VehicleListSummaryProps {
  vehicles: Vehicle[]
  orgId: string
}

export function VehicleListSummary({ vehicles, orgId }: VehicleListSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>My Vehicles</span>
          <Car className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Car className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No vehicles found</p>
          </div>
        ) : (
          vehicles.map((vehicle) => (
            <div key={vehicle._id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="font-medium">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                {vehicle.licensePlate && (
                  <p className="text-sm text-muted-foreground">License: {vehicle.licensePlate}</p>
                )}
              </div>
              <Link href={`/org/${orgId}/dashboard/client/vehicles/${vehicle._id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/org/${orgId}/dashboard/client/vehicles`} className="w-full">
          <Button variant="outline" className="w-full">
            View All Vehicles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
