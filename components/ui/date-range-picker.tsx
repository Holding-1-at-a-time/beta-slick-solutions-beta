"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  value: { start: number; end: number }
  onChange: (value: { start: number; end: number }) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const startDate = new Date(value.start)
  const endDate = new Date(value.end)

  const handleSelect = (date: Date | undefined) => {
    if (!date) return

    const timestamp = date.getTime()

    if (!value.start || (value.start && value.end)) {
      // If no start date or both dates are set, set start date
      onChange({ start: timestamp, end: timestamp })
    } else {
      // If only start date is set, set end date
      if (timestamp < value.start) {
        onChange({ start: timestamp, end: value.start })
      } else {
        onChange({ start: value.start, end: timestamp })
      }
      setOpen(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Date Range</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left font-normal", !value.start && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value.start ? (
              value.end && value.end !== value.start ? (
                <>
                  {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")}
                </>
              ) : (
                format(startDate, "MMM d, yyyy")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: startDate,
              to: endDate,
            }}
            onSelect={(range) => {
              if (range?.from) {
                handleSelect(range.from)
                if (range.to) {
                  onChange({
                    start: range.from.getTime(),
                    end: range.to.getTime(),
                  })
                  setOpen(false)
                }
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
