"use client"

import { useState } from "react"
import UpdateStatus from "./update-status"
import { formatDate } from "@/lib/utils/format-date"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Id } from "@/convex/_generated/dataModel"

interface Appointment {
  _id: Id<"appointments">
  userId: string
  vehicleId: Id<"vehicles">
  date: number
  time: string
  serviceType: string
  status: string
  notes?: string
}

export default function AppointmentDetail({
  appointment,
}: {
  appointment: Appointment
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{appointment.serviceType}</h3>
          <p className="text-sm text-gray-600">
            {formatDate(appointment.date)} • {appointment.time}
          </p>
        </div>
        <UpdateStatus appointmentId={appointment._id} currentStatus={appointment.status} />
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t text-sm">
          {appointment.notes && <p className="mb-2">{appointment.notes}</p>}
          <div className="flex justify-end space-x-2 mt-2">
            <Link href={`./member/appointments/${appointment._id}/finalize-invoice`} passHref>
              <Button size="sm" disabled={appointment.status !== "in_progress"} variant="outline">
                Finalize Invoice
              </Button>
            </Link>
          </div>
        </div>
      )}

      <Button onClick={() => setExpanded(!expanded)} variant="link" size="sm" className="mt-2 p-0 h-auto text-gray-500">
        {expanded ? "Show less" : "Show more"}
      </Button>
    </div>
  )
}
