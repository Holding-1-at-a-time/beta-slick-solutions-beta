"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { useChartContext } from "./chart-context"

interface TimeRangeSelectorProps {
  onRangeChange?: (range: { start: number; end: number }) => void
  className?: string
}

export function TimeRangeSelector({ onRangeChange, className = "" }: TimeRangeSelectorProps) {
  const { dateRange, setDateRange } = useChartContext()
  const [isCustomRange, setIsCustomRange] = useState(false)

  const handleRangeChange = (range: { start: number; end: number }) => {
    setDateRange(range)
    if (onRangeChange) {
      onRangeChange(range)
    }
  }

  const presetRanges = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
    { label: "Last 12 Months", days: 365 },
    { label: "Custom", custom: true },
  ]

  const setPresetRange = (days: number) => {
    const end = new Date().getTime()
    const start = new Date(new Date().setDate(new Date().getDate() - days)).getTime()
    handleRangeChange({ start, end })
    setIsCustomRange(false)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {presetRanges.map((range) => (
          <Button
            key={range.label}
            variant={
              range.custom
                ? isCustomRange
                  ? "default"
                  : "outline"
                : !isCustomRange &&
                    dateRange.start === new Date(new Date().setDate(new Date().getDate() - (range.days || 0))).getTime()
                  ? "default"
                  : "outline"
            }
            size="sm"
            onClick={() => {
              if (range.custom) {
                setIsCustomRange(true)
              } else {
                setPresetRange(range.days || 0)
              }
            }}
          >
            {range.label}
          </Button>
        ))}
      </div>

      {isCustomRange && (
        <div className="pt-2">
          <DateRangePicker value={dateRange} onChange={handleRangeChange} />
        </div>
      )}
    </div>
  )
}
