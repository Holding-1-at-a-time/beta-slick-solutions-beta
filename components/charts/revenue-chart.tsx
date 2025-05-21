"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatCurrency } from "@/lib/utils/format-currency"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartProvider, useChartContext } from "./chart-context"
import { TimeRangeSelector } from "./time-range-selector"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ZoomIn } from "lucide-react"

export interface RevenueDataPoint {
  name: string
  revenue: number
  date?: string | number // For filtering by date range
  details?: {
    services?: { name: string; revenue: number }[]
    customers?: { name: string; revenue: number }[]
  }
}

export interface RevenueChartProps {
  data: RevenueDataPoint[]
  title?: string
  isLoading?: boolean
  totalRevenue?: number
  height?: number | string
  showTotal?: boolean
  enableTimeRange?: boolean
  enableDrilldown?: boolean
  animated?: boolean
}

function RevenueChartContent({
  data,
  title = "Revenue by Month",
  isLoading = false,
  totalRevenue,
  height = 300,
  showTotal = true,
  enableTimeRange = true,
  enableDrilldown = true,
  animated = true,
}: RevenueChartProps) {
  const { dateRange, isDrilldown, setIsDrilldown, drilldownData, setDrilldownData } = useChartContext()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Filter data by date range if dates are provided
  const filteredData = data.filter((item) => {
    if (!item.date || !enableTimeRange) return true
    const itemDate = typeof item.date === "string" ? new Date(item.date).getTime() : item.date
    return itemDate >= dateRange.start && itemDate <= dateRange.end
  })

  // Calculate total revenue from filtered data
  const calculatedTotal = totalRevenue ?? filteredData.reduce((sum, item) => sum + item.revenue, 0)

  // Handle drill down
  const handleDrilldown = useCallback(
    (dataPoint: RevenueDataPoint) => {
      if (!enableDrilldown || !dataPoint.details) return
      setDrilldownData(dataPoint)
      setIsDrilldown(true)
    },
    [enableDrilldown, setDrilldownData, setIsDrilldown],
  )

  // Handle back from drill down
  const handleBackFromDrilldown = useCallback(() => {
    setIsDrilldown(false)
    setDrilldownData(null)
  }, [setIsDrilldown, setDrilldownData])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  // Prepare drill down data if available
  const drilldownChartData =
    isDrilldown && drilldownData?.details
      ? drilldownData.details.services
        ? drilldownData.details.services.map((service: any) => ({
            name: service.name,
            revenue: service.revenue,
          }))
        : drilldownData.details.customers
          ? drilldownData.details.customers.map((customer: any) => ({
              name: customer.name,
              revenue: customer.revenue,
            }))
          : []
      : []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center">
          {isDrilldown && (
            <Button variant="ghost" size="sm" className="mr-2" onClick={handleBackFromDrilldown}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          <CardTitle>{isDrilldown ? `${title}: ${drilldownData?.name} Breakdown` : title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {enableTimeRange && !isDrilldown && (
          <div className="mb-4">
            <TimeRangeSelector />
          </div>
        )}

        {showTotal && (
          <div className="mb-4">
            <span className="text-sm text-muted-foreground">
              {isDrilldown ? `${drilldownData?.name} Revenue` : "Total Revenue"}
            </span>
            <div className="text-2xl font-bold">
              {formatCurrency(isDrilldown ? drilldownData?.revenue || 0 : calculatedTotal)}
            </div>
          </div>
        )}

        <div style={{ height: typeof height === "number" ? `${height}px` : height }}>
          <ResponsiveContainer width="100%" height="100%">
            {isDrilldown ? (
              <AreaChart data={drilldownChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value, { notation: "compact" })} />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label) => `${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00AE98"
                  fill="#00AE98"
                  fillOpacity={0.3}
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </AreaChart>
            ) : (
              <LineChart
                data={filteredData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                onMouseMove={(e) => {
                  if (e.activeTooltipIndex !== undefined) {
                    setActiveIndex(e.activeTooltipIndex)
                  }
                }}
                onClick={() => {
                  if (activeIndex !== null && enableDrilldown && filteredData[activeIndex]?.details) {
                    handleDrilldown(filteredData[activeIndex])
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value, { notation: "compact" })} />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  labelFormatter={(label) => `Period: ${label}`}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = filteredData.find((d) => d.name === label)
                      return (
                        <div className="bg-background border rounded p-2 shadow-md">
                          <p className="font-medium">{`Period: ${label}`}</p>
                          <p className="text-[#00AE98]">{`Revenue: ${formatCurrency(payload[0].value as number)}`}</p>
                          {dataPoint?.details && enableDrilldown && (
                            <div className="mt-1 text-xs text-muted-foreground flex items-center">
                              <ZoomIn className="h-3 w-3 mr-1" /> Click for details
                            </div>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#00AE98"
                  strokeWidth={2}
                  dot={{ r: 4, cursor: enableDrilldown ? "pointer" : "default" }}
                  activeDot={{
                    r: 6,
                    stroke: "#00AE98",
                    strokeWidth: 2,
                    fill: "#fff",
                    cursor: enableDrilldown ? "pointer" : "default",
                  }}
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {enableDrilldown && !isDrilldown && (
          <div className="mt-2 text-xs text-center text-muted-foreground">
            Click on data points with details to drill down
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function RevenueChart(props: RevenueChartProps) {
  return (
    <ChartProvider>
      <RevenueChartContent {...props} />
    </ChartProvider>
  )
}
