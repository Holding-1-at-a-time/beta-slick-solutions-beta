"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { SlotSelectionList } from "@/components/scheduling/slot-selection-list"
import { LoadingPlaceholder } from "@/components/ui/loading-placeholder"
import { bookAppointment } from "@/app/actions/appointments"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface TimeSelectionProps {
  orgId: string
  appointmentId: string
  serviceDuration: number
  initialSlots?: Array<{
    id: string
    start: string
    end: string
  }>
}

interface Slot {
  id: string
  start: string
  end: string
}

export function TimeSelection({ orgId, appointmentId, serviceDuration, initialSlots = [] }: TimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [availableSlots, setAvailableSlots] = useState<Slot[]>(initialSlots)
  const [isLoading, setIsLoading] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const fetchAvailableSlots = async (date: Date) => {
    setIsLoading(true)
    try {
      // In a real implementation, this would call the SchedulerAgent
      // For now, we'll generate mock slots
      const startOfDay = new Date(date)
      startOfDay.setHours(9, 0, 0, 0)

      const mockSlots: Slot[] = []

      for (let i = 0; i < 8; i++) {
        const slotStart = new Date(startOfDay)
        slotStart.setHours(9 + Math.floor(i / 2), (i % 2) * 30, 0, 0)

        const slotEnd = new Date(slotStart)
        slotEnd.setMinutes(slotEnd.getMinutes() + serviceDuration)

        mockSlots.push({
          id: `slot-${i}-${slotStart.getTime()}`,
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        })
      }

      setAvailableSlots(mockSlots)
    } catch (error) {
      console.error("Failed to fetch available slots:", error)
      toast({
        title: "Error",
        description: "Failed to fetch available slots. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot)
  }

  const handleBookAppointment = async () => {
    if (!selectedSlot) return

    setIsBooking(true)
    try {
      const startDate = new Date(selectedSlot.start)

      await bookAppointment(orgId, appointmentId, {
        id: selectedSlot.id,
        date: startDate.getTime(),
        time: format(startDate, "h:mm a"),
        duration: serviceDuration,
      })

      toast({
        title: "Success",
        description: "Appointment rescheduled successfully.",
      })

      // Redirect to the deposit payment page
      router.push(`/dashboard/client/appointments/${appointmentId}/reschedule/confirm`)
    } catch (error) {
      console.error("Failed to book appointment:", error)
      toast({
        title: "Error",
        description: "Failed to reschedule appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reschedule Appointment</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => {
                // Disable dates in the past and more than 30 days in the future
                const now = new Date()
                now.setHours(0, 0, 0, 0)
                const thirtyDaysFromNow = new Date(now)
                thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
                return date < now || date > thirtyDaysFromNow
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Time Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingPlaceholder message="Loading available slots..." />
            ) : (
              <>
                <SlotSelectionList
                  slots={availableSlots.map((slot) => ({
                    id: slot.id,
                    start: slot.start,
                    end: slot.end,
                  }))}
                  onSelect={handleSlotSelect}
                  selectedSlotId={selectedSlot?.id}
                />

                {selectedSlot && (
                  <div className="mt-6">
                    <Button onClick={handleBookAppointment} className="w-full" disabled={isBooking}>
                      {isBooking ? "Booking..." : "Confirm Reschedule"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
