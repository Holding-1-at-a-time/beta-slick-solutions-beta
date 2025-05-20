"use client"

import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, Car, Trash2, Plus } from "lucide-react"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"

interface VehicleListProps {
  orgId: string
}

export function VehicleList({ orgId }: VehicleListProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page on new search
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  // Fetch vehicles with search and pagination
  const { vehicles, total } = useQuery(api.vehicles.listVehicles, {
    orgId,
    search: debouncedSearch,
    skip: (page - 1) * limit,
    limit,
  }) || { vehicles: [], total: 0 }

  const deleteVehicle = useMutation(api.vehicles.deleteVehicle)

  const totalPages = Math.ceil(total / limit)

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      await deleteVehicle({ orgId, vehicleId })
    }
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      {/* Vehicles table */}
      {vehicles && vehicles.length > 0 ? (
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Make</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Model</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Year</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">License Plate</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">VIN</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="border-b">
                    <td className="px-4 py-3 text-sm">{vehicle.make}</td>
                    <td className="px-4 py-3 text-sm">{vehicle.model}</td>
                    <td className="px-4 py-3 text-sm">{vehicle.year}</td>
                    <td className="px-4 py-3 text-sm">{vehicle.licensePlate}</td>
                    <td className="px-4 py-3 text-sm">{vehicle.vin}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/org/${orgId}/dashboard/client/vehicles/${vehicle._id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <Car className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle._id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
          <Car className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No vehicles found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {debouncedSearch ? "No vehicles match your search criteria." : "You haven't added any vehicles yet."}
          </p>
          <Link
            href={`/org/${orgId}/dashboard/client/vehicles/add`}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </div>
      )}

      {/* Pagination */}
      {vehicles && vehicles.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">{Math.min(page * limit, total)}</span> of{" "}
            <span className="font-medium">{total}</span> vehicles
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </button>
            <span className="text-sm">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
