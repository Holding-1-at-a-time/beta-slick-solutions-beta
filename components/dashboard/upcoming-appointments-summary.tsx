"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Vehicle {
  _id: string
  make: string
  model: string
  year: number
}

interface Appointment {
  _id: string
  date: number
  status: string
  serviceType: string
  vehicle: Vehicle
}

interface UpcomingAppointmentsSummaryProps {
  appointments: Appointment[]
  orgId: string
}

export function UpcomingAppointmentsSummary({ appointments, orgId }: UpcomingAppointmentsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Upcoming Appointments</span>
          <Calendar className="h-5 w-5" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No upcoming appointments</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment._id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="font-medium">{format(new Date(appointment.date), "MMM d, yyyy 'at' h:mm a")}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
                </p>
                <p className="text-sm text-muted-foreground">Service: {appointment.serviceType}</p>
              </div>
              <Badge variant={appointment.status === "scheduled" ? "outline" : "secondary"}>{appointment.status}</Badge>
            </div>
          ))
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/org/${orgId}/dashboard/client/appointments`} className="w-full">
          <Button variant="outline" className="w-full">
            View All Appointments
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
