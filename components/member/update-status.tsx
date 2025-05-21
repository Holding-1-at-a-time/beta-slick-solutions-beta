"use client"

import { useMutation } from "convex/react"
import { mutation } from "@/convex/_generated/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQueryClient } from "convex/react"
import { useUser } from "@clerk/nextjs"

export function UpdateStatus({
  appointmentId,
  currentStatus,
  orgId,
}: {
  appointmentId: string
  currentStatus: string
  orgId: string
}) {
  const { user } = useUser()
  const userId = user?.id || ""
  const queryClient = useQueryClient()
  const updateStatusMutation = useMutation(mutation("updateAppointmentStatus"))

  const handleStatusChange = async (newStatus: string) => {
    await updateStatusMutation(orgId, appointmentId, newStatus)
    // Invalidate to refresh any components depending on this data
    queryClient.invalidateQueries(["listTodayAppointments", orgId, userId])
  }

  return (
    <Select defaultValue={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {["Scheduled", "In Progress", "Completed", "Cancelled"].map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
