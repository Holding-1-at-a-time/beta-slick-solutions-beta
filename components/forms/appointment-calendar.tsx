"use client"

import { useState, useEffect } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { format, addDays, isSameDay, startOfDay } from "date-fns"
import { Clock, CalendarIcon } from "lucide-react"

export interface TimeSlot {
  id: string
  startTime: Date
  endTime: Date
  available: boolean
}

interface AppointmentCalendarProps {
  tenantId: string
  availableSlots?: TimeSlot[]
  onSelect: (slot: TimeSlot) => void
}

export default function AppointmentCalendar({
  tenantId,
  availableSlots: propSlots,
  onSelect,
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()))
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  // Fetch available slots if not provided as props
  const fetchedSlots = useQuery(api.appointments.getAvailableSlots, {
    tenantId,
    startDate: selectedDate.getTime(),
    endDate: addDays(selectedDate, 14).getTime(),
  })

  // Use props slots if provided, otherwise use fetched slots
  const slots = propSlots || fetchedSlots || []

  // Filter slots for the selected date
  const slotsForSelectedDate = slots.filter((slot) => isSameDay(new Date(slot.startTime), selectedDate))

  // Group slots by hour for better display
  const groupedSlots: Record<string, TimeSlot[]> = {}
  slotsForSelectedDate.forEach((slot) => {
    const hour = format(new Date(slot.startTime), "ha")
    if (!groupedSlots[hour]) {
      groupedSlots[hour] = []
    }
    groupedSlots[hour].push(slot)
  })

  // Handle slot selection
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    onSelect(slot)
  }

  // Reset selected slot when date changes
  useEffect(() => {
    setSelectedSlot(null)
  }, [selectedDate])

  // Determine which dates have available slots
  const datesWithSlots = slots.reduce((acc: Record<string, boolean>, slot) => {
    const dateStr = format(new Date(slot.startTime), "yyyy-MM-dd")
    if (slot.available) {
      acc[dateStr] = true
    }
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={{ before: new Date() }}
                modifiers={{
                  hasSlots: (date) => datesWithSlots[format(date, "yyyy-MM-dd")] || false,
                }}
                modifiersClassNames={{
                  hasSlots: "bg-green-50 font-bold text-green-600",
                }}
                className="rounded-md border w-full max-w-[350px]"
              />
            </div>
            <div className="mt-4 flex items-center justify-center text-sm">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-green-50 border border-green-600 rounded-full mr-1"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full mr-1"></div>
                <span>No slots</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <CalendarIcon className="mr-2 h-5 w-5" />
              <h3 className="text-lg font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
            </div>

            {!fetchedSlots && !propSlots ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : slotsForSelectedDate.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Clock className="h-12 w-12 text-gray-400 mb-4" />
                <h4 className="text-lg font-medium">No available slots</h4>
                <p className="text-sm text-gray-500 mt-1">Please select another date or check back later</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(groupedSlots).map(([hour, hourSlots]) => (
                  <div key={hour} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-500">{hour}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {hourSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                          className={`w-full py-5 sm:py-2 ${!slot.available ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!slot.available}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          {format(new Date(slot.startTime), "h:mm")}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
