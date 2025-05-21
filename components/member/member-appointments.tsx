"use client"

import { useTodayAppointments } from "@/hooks/useMember"
import AppointmentDetail from "./appointment-detail"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MemberAppointments({ summary = false }: { summary?: boolean }) {
  const { appointments, isLoading } = useTodayAppointments()
  const list = summary ? appointments.slice(0, 3) : appointments

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(summary ? 3 : 5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (list.length === 0) {
    return <p className="text-gray-500 text-sm">No appointments scheduled for today.</p>
  }

  return (
    <ul className="space-y-4">
      {list.map((appointment) => (
        <li key={appointment._id}>
          <Card className="p-3">
            <AppointmentDetail appointment={appointment} />
          </Card>
        </li>
      ))}
      {summary && appointments.length > 3 && (
        <li className="text-center">
          <a href="./member/appointments" className="text-blue-600 hover:underline text-sm">
            View all {appointments.length} appointments
          </a>
        </li>
      )}
    </ul>
  )
}
