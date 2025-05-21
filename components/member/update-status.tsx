"use client"

import { useUpdateAppointmentStatus } from "@/hooks/useMember"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Id } from "@/convex/_generated/dataModel"

const statusOptions = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
]

export default function UpdateStatus({
  appointmentId,
  currentStatus,
}: {
  appointmentId: Id<"appointments">
  currentStatus: string
}) {
  const updateStatus = useUpdateAppointmentStatus()

  const handleStatusChange = (newStatus: string) => {
    updateStatus(appointmentId, newStatus)
  }

  return (
    <Select defaultValue={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
