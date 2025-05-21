"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils/format-date"

export function CustomerDetail({
  orgId,
  customerId,
}: {
  orgId: string
  customerId: string
}) {
  const { user } = useUser()
  const userId = user?.id || ""

  // Fetch the customer record
  const customer = useQuery(query("getCustomer"), orgId, userId, customerId)

  // Fetch arrays for vehicles, assessments, and appointments
  const vehicles = useQuery(query("listCustomerVehicles"), orgId, userId, customerId) || []
  const assessments = useQuery(query("listCustomerAssessments"), orgId, userId, customerId) || []
  const appointments = useQuery(query("listCustomerAppointments"), orgId, userId, customerId) || []

  if (!customer) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {customer.firstName} {customer.lastName}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="font-medium">{customer.email}</dd>
              </div>
              {customer.phone && (
                <div>
                  <dt className="text-sm text-muted-foreground">Phone</dt>
                  <dd>{customer.phone}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-muted-foreground">Customer Since</dt>
                <dd>{formatDate(customer.createdAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Customer Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="vehicles">
              <TabsList className="mb-4">
                <TabsTrigger value="vehicles">Vehicles ({vehicles.length})</TabsTrigger>
                <TabsTrigger value="assessments">Assessments ({assessments.length})</TabsTrigger>
                <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="vehicles">
                {vehicles.length === 0 ? (
                  <p className="text-muted-foreground">No vehicles registered.</p>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3">Vehicle</th>
                          <th className="text-left p-3">License Plate</th>
                          <th className="text-left p-3">Added</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicles.map((vehicle) => (
                          <tr key={vehicle._id} className="border-t">
                            <td className="p-3">
                              {vehicle.make} {vehicle.model} ({vehicle.year})
                            </td>
                            <td className="p-3">{vehicle.licensePlate}</td>
                            <td className="p-3">{formatDate(vehicle.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="assessments">
                {assessments.length === 0 ? (
                  <p className="text-muted-foreground">No assessments found.</p>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Vehicle</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-right p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessments.map((assessment) => (
                          <tr key={assessment._id} className="border-t">
                            <td className="p-3">{formatDate(assessment.createdAt)}</td>
                            <td className="p-3">
                              {assessment.vehicleMake} {assessment.vehicleModel}
                            </td>
                            <td className="p-3">{assessment.status}</td>
                            <td className="p-3 text-right">
                              {assessment.status === "pending" && (
                                <Button asChild size="sm" variant="outline">
                                  <Link href={`/${orgId}/dashboard/member/assessments/review/${assessment._id}`}>
                                    Review
                                  </Link>
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="appointments">
                {appointments.length === 0 ? (
                  <p className="text-muted-foreground">No appointments scheduled.</p>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Service</th>
                          <th className="text-left p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment) => (
                          <tr key={appointment._id} className="border-t">
                            <td className="p-3">{formatDate(appointment.date)}</td>
                            <td className="p-3">{appointment.serviceType}</td>
                            <td className="p-3">{appointment.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
