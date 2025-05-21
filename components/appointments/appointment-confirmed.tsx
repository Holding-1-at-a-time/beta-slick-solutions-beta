"use client"

import { format } from "date-fns"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface AppointmentConfirmedProps {
  appointment: {
    _id: string
    date: number
    time: string
    serviceType: string
    vehicle: {
      make: string
      model: string
      year: number
    } | null
    depositPaid: boolean
    depositAmount: number
    invoice?: {
      _id: string
    }
  }
}

export function AppointmentConfirmed({ appointment }: AppointmentConfirmedProps) {
  const formatAppointmentDate = (date: number) => {
    return format(new Date(date), "MMMM d, yyyy")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold">Appointment Confirmed!</h2>
        <p className="text-muted-foreground">Your appointment has been successfully rescheduled.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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

            {appointment.vehicle && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vehicle</p>
                <p>
                  {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">Deposit</p>
              <p>
                {appointment.depositPaid
                  ? `Paid (${formatCurrency(appointment.depositAmount)})`
                  : "Not required for this appointment"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center space-y-4">
        {appointment.invoice && (
          <Link href={`/dashboard/client/invoices/${appointment.invoice._id}`} className="w-full">
            <Button variant="outline" className="w-full">
              View Invoice
            </Button>
          </Link>
        )}

        <Link href="/dashboard/client" className="w-full">
          <Button className="w-full">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
