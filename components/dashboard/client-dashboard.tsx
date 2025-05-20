"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { VehicleListSummary } from "@/components/dashboard/vehicle-list-summary"
import { UpcomingAppointmentsSummary } from "@/components/dashboard/upcoming-appointments-summary"
import { OutstandingInvoicesSummary } from "@/components/dashboard/outstanding-invoices-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Car, Calendar, FileText } from "lucide-react"

interface ClientDashboardProps {
  orgId: string
}

export function ClientDashboard({ orgId }: ClientDashboardProps) {
  const dashboardData = useQuery(api.client.getClientDashboardSummary, { orgId })

  if (!dashboardData) {
    return <DashboardSkeleton />
  }

  const { vehicles, upcomingAppointments, outstandingInvoices, stats } = dashboardData

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Client Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outstandingInvoices}</div>
          </CardContent>
        </Card>
      </div>

      {/* Summaries */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <VehicleListSummary vehicles={vehicles} orgId={orgId} />
        <UpcomingAppointmentsSummary appointments={upcomingAppointments} orgId={orgId} />
        <OutstandingInvoicesSummary invoices={outstandingInvoices} orgId={orgId} />
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Client Dashboard</h1>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summaries Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
