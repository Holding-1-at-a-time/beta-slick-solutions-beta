"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

interface RescheduleButtonProps {
  appointmentId: string
}

export function RescheduleButton({ appointmentId }: RescheduleButtonProps) {
  const router = useRouter()

  const handleReschedule = () => {
    router.push(`/dashboard/client/appointments/${appointmentId}/reschedule`)
  }

  return (
    <Button onClick={handleReschedule} className="flex items-center gap-2">
      <CalendarIcon className="h-4 w-4" />
      Reschedule
    </Button>
  )
}
