"use client"

import { UpdateStatus } from "./update-status"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AppointmentDetail({
  appointment,
  orgId,
}: {
  appointment: any
  orgId: string
}) {
  const { _id, customerName, time, status, vehicleId } = appointment

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{customerName}</p>
          <p className="text-sm text-muted-foreground">
            {time} • Status: {status}
          </p>
        </div>
        <UpdateStatus appointmentId={_id} currentStatus={status} orgId={orgId} />
      </div>

      {status === "Completed" && (
        <div className="flex justify-end">
          <Button asChild size="sm" variant="outline">
            <Link href={`/${orgId}/dashboard/member/appointments/${_id}/finalize-invoice`}>Finalize Invoice</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
