"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface Slot {
  id: string
  start: string
  end: string
}

interface SlotSelectionListProps {
  slots: Slot[]
  onSelect?: (slot: Slot) => void
}

export function SlotSelectionList({ slots, onSelect }: SlotSelectionListProps) {
  const formatSlotTime = (slot: Slot) => {
    const start = new Date(slot.start)
    const end = new Date(slot.end)

    const dateStr = format(start, "EEEE, MMMM d")
    const timeStr = `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`

    return { dateStr, timeStr }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Available Slots</h3>

      {slots.length === 0 ? (
        <p className="text-muted-foreground">No available slots found.</p>
      ) : (
        <div className="space-y-3">
          {slots.map((slot) => {
            const { dateStr, timeStr } = formatSlotTime(slot)

            return (
              <Card key={slot.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{dateStr}</p>
                      <p className="text-sm text-muted-foreground">{timeStr}</p>
                    </div>
                    <Button onClick={() => onSelect?.(slot)} variant="outline">
                      Select
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
