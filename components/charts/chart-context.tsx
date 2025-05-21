"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ChartContextProps {
  dateRange: { start: number; end: number }
  setDateRange: (range: { start: number; end: number }) => void
  drilldownData: any | null
  setDrilldownData: (data: any | null) => void
  isDrilldown: boolean
  setIsDrilldown: (isDrilldown: boolean) => void
}

const ChartContext = createContext<ChartContextProps | undefined>(undefined)

export function useChartContext() {
  const context = useContext(ChartContext)
  if (!context) {
    throw new Error("useChartContext must be used within a ChartProvider")
  }
  return context
}

interface ChartProviderProps {
  children: ReactNode
  initialDateRange?: { start: number; end: number }
}

export function ChartProvider({
  children,
  initialDateRange = {
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)).getTime(),
    end: new Date().getTime(),
  },
}: ChartProviderProps) {
  const [dateRange, setDateRange] = useState(initialDateRange)
  const [drilldownData, setDrilldownData] = useState<any | null>(null)
  const [isDrilldown, setIsDrilldown] = useState(false)

  return (
    <ChartContext.Provider
      value={{
        dateRange,
        setDateRange,
        drilldownData,
        setDrilldownData,
        isDrilldown,
        setIsDrilldown,
      }}
    >
      {children}
    </ChartContext.Provider>
  )
}
