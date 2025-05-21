"use client"

import type React from "react"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

interface VehicleDetailLayoutProps {
  children: React.ReactNode
  orgId: string
  vehicleId: string
}

export function VehicleDetailLayout({ children, orgId, vehicleId }: VehicleDetailLayoutProps) {
  const vehicle = useQuery(api.vehicles.getVehicleById, { orgId, vehicleId })

  return (
    <div className="flex flex-col space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              href={`/org/${orgId}/dashboard/client`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </li>
          <li>
            <Link
              href={`/org/${orgId}/dashboard/client/vehicles`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Vehicles
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </li>
          <li>
            <span className="text-sm font-medium">{vehicle ? `${vehicle.make} ${vehicle.model}` : "Loading..."}</span>
          </li>
        </ol>
      </nav>

      {children}
    </div>
  )
}
