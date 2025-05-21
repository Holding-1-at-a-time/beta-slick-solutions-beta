"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { ChartProvider, useChartContext } from "./chart-context"
import { TimeRangeSelector } from "./time-range-selector"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ZoomIn, PieChartIcon, BarChartIcon } from "lucide-react"

export interface ServiceDataPoint {
  name: string
  count: number
  date?: string | number // For filtering by date range
  details?: {
    customers?: { name: string; count: number }[]
    timeSpent?: number
    revenue?: number
  }
}

export interface ServiceChartProps {
  data: ServiceDataPoint[]
  title?: string
  isLoading?: boolean
  height?: number | string
  barColor?: string
  layout?: "vertical" | "horizontal"
  enableTimeRange?: boolean
  enableDrilldown?: boolean
  animated?: boolean
}

function ServiceChartContent({
  data,
  title = "Service Usage Metrics",
  isLoading = false,
  height = 300,
  barColor = "#707070",
  layout = "vertical",
  enableTimeRange = true,
  enableDrilldown = true,
  animated = true,
}: ServiceChartProps) {
  const { dateRange, isDrilldown, setIsDrilldown, drilldownData, setDrilldownData } = useChartContext()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [chartType, setChartType] = useState<"bar" | "pie">("bar")

  // Filter data by date range if dates are provided
  const filteredData = data.filter((item) => {
    if (!item.date || !enableTimeRange) return true
    const itemDate = typeof item.date === "string" ? new Date(item.date).getTime() : item.date
    return itemDate >= dateRange.start && itemDate <= dateRange.end
  })

  // Handle drill down
  const handleDrilldown = useCallback(
    (dataPoint: ServiceDataPoint) => {
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
    isDrilldown && drilldownData?.details?.customers
      ? drilldownData.details.customers.map((customer) => ({
          name: customer.name,
          count: customer.count,
        }))
      : []

  // Colors for pie chart
  const COLORS = ["#00AE98", "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7", "#ec4899"]

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

        <div className="flex items-center space-x-2">
          {!isDrilldown && (
            <>
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("bar")}
              >
                <BarChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={chartType === "pie" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("pie")}
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {enableTimeRange && !isDrilldown && (
          <div className="mb-4">
            <TimeRangeSelector />
          </div>
        )}

        {isDrilldown && drilldownData?.details && (
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Usage Count</span>
              <div className="text-2xl font-bold">{drilldownData.count}</div>
            </div>
            {drilldownData.details.timeSpent !== undefined && (
              <div>
                <span className="text-sm text-muted-foreground">Time Spent</span>
                <div className="text-2xl font-bold">{drilldownData.details.timeSpent} hrs</div>
              </div>
            )}
            {drilldownData.details.revenue !== undefined && (
              <div>
                <span className="text-sm text-muted-foreground">Revenue</span>
                <div className="text-2xl font-bold">${drilldownData.details.revenue.toLocaleString()}</div>
              </div>
            )}
          </div>
        )}

        <div style={{ height: typeof height === "number" ? `${height}px` : height }}>
          <ResponsiveContainer width="100%" height="100%">
            {isDrilldown ? (
              <BarChart data={drilldownChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  name="Usage Count"
                  fill="#00AE98"
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            ) : chartType === "pie" ? (
              <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                  onClick={(_, index) => {
                    if (enableDrilldown && filteredData[index]?.details) {
                      handleDrilldown(filteredData[index])
                    }
                  }}
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      cursor={enableDrilldown && entry.details ? "pointer" : "default"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, "Usage Count"]}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = filteredData.find((d) => d.name === payload[0].name)
                      return (
                        <div className="bg-background border rounded p-2 shadow-md">
                          <p className="font-medium">{payload[0].name}</p>
                          <p>{`Count: ${payload[0].value}`}</p>
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
                <Legend />
              </PieChart>
            ) : layout === "vertical" ? (
              <BarChart
                data={filteredData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = filteredData.find((d) => d.name === label)
                      return (
                        <div className="bg-background border rounded p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          <p>{`Count: ${payload[0].value}`}</p>
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
                <Bar
                  dataKey="count"
                  name="Usage Count"
                  fill={barColor}
                  cursor={enableDrilldown ? "pointer" : "default"}
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            ) : (
              <BarChart
                data={filteredData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const dataPoint = filteredData.find((d) => d.name === label)
                      return (
                        <div className="bg-background border rounded p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          <p>{`Count: ${payload[0].value}`}</p>
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
                <Bar
                  dataKey="count"
                  name="Usage Count"
                  fill={barColor}
                  cursor={enableDrilldown ? "pointer" : "default"}
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {enableDrilldown && !isDrilldown && (
          <div className="mt-2 text-xs text-center text-muted-foreground">Click on bars with details to drill down</div>
        )}
      </CardContent>
    </Card>
  )
}

export function ServiceChart(props: ServiceChartProps) {
  return (
    <ChartProvider>
      <ServiceChartContent {...props} />
    </ChartProvider>
  )
}
