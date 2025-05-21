"use client"

import { useCustomer, useCustomerVehicles, useCustomerAssessments, useCustomerAppointments } from "@/hooks/useMember"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils/format-date"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Id } from "@/convex/_generated/dataModel"

export default function CustomerDetail({
  customerId,
}: {
  customerId: Id<"users">
}) {
  const { customer, isLoading: customerLoading } = useCustomer(customerId)
  const { vehicles, isLoading: vehiclesLoading } = useCustomerVehicles(customerId)
  const { assessments, isLoading: assessmentsLoading } = useCustomerAssessments(customerId)
  const { appointments, isLoading: appointmentsLoading } = useCustomerAppointments(customerId)

  if (customerLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!customer) {
    return <div className="text-center py-8">Customer not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-gray-500">{customer.email}</p>
          {customer.phone && <p className="text-gray-500">{customer.phone}</p>}
        </div>

        <div className="flex gap-2">
          <Badge variant="outline">Customer since {formatDate(customer.createdAt)}</Badge>
        </div>
      </div>

      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles ({vehicles.length})</TabsTrigger>
          <TabsTrigger value="appointments">Appointments ({appointments.length})</TabsTrigger>
          <TabsTrigger value="assessments">Assessments ({assessments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="pt-4">
          <Card className="p-6">
            {vehiclesLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              <p className="text-gray-500">No vehicles found for this customer.</p>
            ) : (
              <ul className="divide-y">
                {vehicles.map((vehicle) => (
                  <li key={vehicle._id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-sm text-gray-500">
                          {vehicle.color} • {vehicle.licensePlate || "No plate"}
                        </p>
                      </div>
                      {vehicle.vin && <div className="text-sm text-gray-500">VIN: {vehicle.vin}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="pt-4">
          <Card className="p-6">
            {appointmentsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-gray-500">No appointments found for this customer.</p>
            ) : (
              <ul className="divide-y">
                {appointments.map((appointment) => (
                  <li key={appointment._id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{appointment.serviceType}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(appointment.date)} • {appointment.time}
                        </p>
                      </div>
                      <Badge
                        className={
                          appointment.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : appointment.status === "canceled"
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : appointment.status === "in_progress"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="pt-4">
          <Card className="p-6">
            {assessmentsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : assessments.length === 0 ? (
              <p className="text-gray-500">No assessments found for this customer.</p>
            ) : (
              <ul className="divide-y">
                {assessments.map((assessment) => (
                  <li key={assessment._id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{assessment.vehicleName || "Vehicle Assessment"}</p>
                        <p className="text-sm text-gray-500">{formatDate(assessment.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            assessment.status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : assessment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          }
                        >
                          {assessment.status}
                        </Badge>
                        {assessment.status === "pending" && (
                          <Link
                            href={`../assessments/review/${assessment._id}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Review
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
