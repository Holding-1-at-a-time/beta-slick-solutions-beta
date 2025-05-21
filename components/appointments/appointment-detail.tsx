"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AppointmentDetailProps {
  appointment: {
    _id: string
    date: number
    time: string
    duration: number
    status: string
    serviceType: string
    notes?: string
    vehicle: {
      make: string
      model: string
      year: number
      licensePlate?: string
    } | null
    invoice?: {
      _id: string
      amount: number
      status: string
      items: Array<{
        description: string
        unitPrice: number
        quantity: number
      }>
    }
    assignedStaff?: {
      id: string
      name: string
      email: string
    }
  }
}

export function AppointmentDetail({ appointment }: AppointmentDetailProps) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateTotal = (item: { unitPrice: number; quantity: number }) => {
    return item.unitPrice * item.quantity
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Appointment Details</h2>
        <Badge className={getStatusColor(appointment.status)}>
          {appointment.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          {appointment.vehicle ? (
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Make</p>
                  <p>{appointment.vehicle.make}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Model</p>
                  <p>{appointment.vehicle.model}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                  <p>{appointment.vehicle.year}</p>
                </div>
                {appointment.vehicle.licensePlate && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">License Plate</p>
                    <p>{appointment.vehicle.licensePlate}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Vehicle information unavailable</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Service Type</p>
                <p>{appointment.serviceType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <p>{appointment.duration} minutes</p>
              </div>
            </div>
            {appointment.assignedStaff && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Staff</p>
                <p>{appointment.assignedStaff.name}</p>
              </div>
            )}
            {appointment.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p>{appointment.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {appointment.invoice && (
        <Card>
          <CardHeader>
            <CardTitle>Service Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointment.invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(item.unitPrice)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(calculateTotal(item))}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-medium">
                        Total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatCurrency(appointment.invoice.amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
