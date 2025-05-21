"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, Plus } from "lucide-react"

interface VehiclesLayoutProps {
  children: React.ReactNode
  orgId: string
}

export function VehiclesLayout({ children, orgId }: VehiclesLayoutProps) {
  const pathname = usePathname()
  const isAddVehiclePage = pathname.endsWith("/add")
  const isVehicleListPage = pathname === `/org/${orgId}/dashboard/client/vehicles`

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
          {!isAddVehiclePage && (
            <Link
              href={`/org/${orgId}/dashboard/client/vehicles/add`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4 border-b">
          <Link
            href={`/org/${orgId}/dashboard/client/vehicles`}
            className={`flex items-center border-b-2 px-4 py-2 text-sm font-medium ${
              isVehicleListPage
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Car className="mr-2 h-4 w-4" />
            All Vehicles
          </Link>
          <Link
            href={`/org/${orgId}/dashboard/client/vehicles/add`}
            className={`flex items-center border-b-2 px-4 py-2 text-sm font-medium ${
              isAddVehiclePage
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
