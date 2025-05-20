"use client"

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Header from "@/components/header"

export default function DashboardPage() {
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <UserButton />
          </div>
          <DashboardContent />
        </Authenticated>

        <Unauthenticated>
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold mb-6">Welcome to Vehicle Service Platform</h1>
            <p className="text-lg mb-8">Please sign in to access your dashboard</p>
            <SignInButton mode="modal">
              <button className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">Sign In</button>
            </SignInButton>
          </div>
        </Unauthenticated>
      </main>
    </div>
  )
}

function DashboardContent() {
  const overview = useQuery(api.queries.getClientOverview)

  if (overview === undefined) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Vehicles</h2>
        <p className="text-3xl font-bold">{overview.vehicleCount}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Appointments</h2>
        <p className="text-3xl font-bold">{overview.appointmentCount}</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Invoices</h2>
        <p className="text-3xl font-bold">{overview.invoiceCount}</p>
      </div>
    </div>
  )
}
