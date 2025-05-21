"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"

interface Appointment {
  _id: string
  date: number
  time: string
  status: string
  serviceType: string
  vehicle: {
    make: string
    model: string
    year: number
    licensePlate?: string
  } | null
}

interface AppointmentListProps {
  initialAppointments: {
    appointments: Appointment[]
    totalPages: number
    currentPage: number
    totalCount: number
  }
  orgId: string
}

export function AppointmentList({ initialAppointments, orgId }: AppointmentListProps) {
  const [appointments, setAppointments] = useState(initialAppointments.appointments)
  const [currentPage, setCurrentPage] = useState(initialAppointments.currentPage)
  const [totalPages, setTotalPages] = useState(initialAppointments.totalPages)
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "confirmed":
        return "bg-green-500"
      case "in_progress":
        return "bg-yellow-500"
      case "completed":
        return "bg-green-700"
      case "cancelled":
        return "bg-red-500"
      case "rescheduled":
        return "bg-purple-500"
      case "deposit_paid":
        return "bg-emerald-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatAppointmentDate = (date: number) => {
    return format(new Date(date), "MMMM d, yyyy")
  }

  const handlePageChange = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/appointments?page=${page}&orgId=${orgId}`)
      const data = await response.json()
      setAppointments(data.appointments)
      setCurrentPage(data.currentPage)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error("Failed to fetch appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingPlaceholder message="Loading appointments..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Appointments</h2>
      </div>

      {appointments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">You don't have any appointments yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment._id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {appointment.vehicle
                      ? `${appointment.vehicle.year} ${appointment.vehicle.make} ${appointment.vehicle.model}`
                      : "Vehicle Information Unavailable"}
                  </CardTitle>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date</p>
                      <p>{formatAppointmentDate(appointment.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Time</p>
                      <p>{appointment.time}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Service</p>
                    <p>{appointment.serviceType}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/dashboard/client/appointments/${appointment._id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}
