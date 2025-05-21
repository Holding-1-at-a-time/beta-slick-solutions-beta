"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePermissions } from "@/hooks/use-permissions"
import { Car, Calendar, FileText } from "lucide-react"

export default function DashboardPage({
  params,
}: {
  params: { orgId: string }
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <AuthLoading>
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AuthLoading>

      <Authenticated>
        <DashboardContent orgId={params.orgId} />
      </Authenticated>

      <Unauthenticated>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-xl font-bold text-red-700">Authentication Required</h2>
          <p className="mt-2 text-red-600">Please sign in to view this dashboard.</p>
        </div>
      </Unauthenticated>
    </div>
  )
}

function DashboardContent({ orgId }: { orgId: string }) {
  const { isAdmin } = usePermissions()
  const clientOverview = useQuery(api.queries.getClientOverview)
  const adminOverview = useQuery(api.queries.getAdminOverview)

  if (clientOverview === undefined || (isAdmin && adminOverview === undefined)) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientOverview.vehicleCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientOverview.appointmentCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientOverview.invoiceCount}</div>
          </CardContent>
        </Card>
      </div>

      {isAdmin && adminOverview && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Organization Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminOverview.vehicleCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminOverview.appointmentCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminOverview.invoiceCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminOverview.totalUsers}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
