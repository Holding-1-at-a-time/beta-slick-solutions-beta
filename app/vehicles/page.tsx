"use client"

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { SignInButton } from "@clerk/nextjs"
import Link from "next/link"
import PermissionGuard from "@/components/auth/permission-guard"
import Header from "@/components/header"

export default function VehiclesPage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AuthLoading>
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-lg font-medium">Loading authentication...</p>
            </div>
          </div>
        </AuthLoading>

        <Authenticated>
          <VehiclesList />
        </Authenticated>

        <Unauthenticated>
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold mb-6">Vehicle Management</h1>
            <p className="text-lg mb-8">Please sign in to view your vehicles</p>
            <SignInButton mode="modal">
              <button className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">Sign In</button>
            </SignInButton>
          </div>
        </Unauthenticated>
      </main>
    </div>
  )
}

function VehiclesList() {
  const vehicles = useQuery(api.queries.listVehiclesForCurrentUser)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Vehicles</h1>

        <PermissionGuard permission="org:vehicles:write">
          <Link href="/vehicles/new" className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">
            Add New Vehicle
          </Link>
        </PermissionGuard>
      </div>

      {vehicles === undefined ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
          <p className="text-gray-600">You don't have any vehicles yet.</p>
          <PermissionGuard permission="org:vehicles:write">
            <Link
              href="/vehicles/new"
              className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Add Your First Vehicle
            </Link>
          </PermissionGuard>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Link
              key={vehicle._id}
              href={`/vehicles/${vehicle._id}`}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              {vehicle.licensePlate && <p className="mt-2 text-gray-600">License: {vehicle.licensePlate}</p>}
              <p className="mt-2 text-sm text-gray-500">Added on {new Date(vehicle.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
