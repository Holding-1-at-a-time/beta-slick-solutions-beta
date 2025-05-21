"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { AppointmentDetail } from "./appointment-detail"
import { Skeleton } from "@/components/ui/skeleton"

export function MemberAppointments({
  orgId,
  summary = false,
}: {
  orgId: string
  summary?: boolean
}) {
  const { user } = useUser()
  const userId = user?.id || ""

  // Live-query: fetch "today's appointments"
  const appointments = useQuery(query("listTodayAppointments"), orgId, userId) || []
  const list = summary ? appointments.slice(0, 3) : appointments

  if (!appointments && !summary) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border p-4 rounded-md">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (appointments?.length === 0) {
    return <p className="text-muted-foreground">No appointments scheduled for today.</p>
  }

  return (
    <ul className="space-y-2">
      {list.map((apt) => (
        <li key={apt._id} className="border p-2 rounded-md">
          <AppointmentDetail appointment={apt} orgId={orgId} />
        </li>
      ))}
    </ul>
  )
}
