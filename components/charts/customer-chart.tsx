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
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartProvider, useChartContext } from "./chart-context"
import { TimeRangeSelector } from "./time-range-selector"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ZoomIn, BarChartIcon, LineChartIcon } from "lucide-react"

export interface CustomerDataPoint {
  name: string
  new: number
  retained: number
  churned: number
  date?: string | number // For filtering by date range
  details?: {
    newCustomers?: { name: string; value: number }[]
    retainedCustomers?: { name: string; value: number }[]
    churnedCustomers?: { name: string; value: number }[]
  }
}

export interface CustomerChartProps {
  data: CustomerDataPoint[]
  title?: string
  isLoading?: boolean
  height?: number | string
  showTable?: boolean
  enableTimeRange?: boolean
  enableDrilldown?: boolean
  animated?: boolean
}

function CustomerChartContent({
  data,
  title = "Customer Acquisition & Retention",
  isLoading = false,
  height = 300,
  showTable = false,
  enableTimeRange = true,
  enableDrilldown = true,
  animated = true,
}: CustomerChartProps) {
  const { dateRange, isDrilldown, setIsDrilldown, drilldownData, setDrilldownData } = useChartContext()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [chartType, setChartType] = useState<"bar" | "line">("bar")
  const [drilldownCategory, setDrilldownCategory] = useState<"new" | "retained" | "churned" | null>(null)

  // Filter data by date range if dates are provided
  const filteredData = data.filter((item) => {
    if (!item.date || !enableTimeRange) return true
    const itemDate = typeof item.date === "string" ? new Date(item.date).getTime() : item.date
    return itemDate >= dateRange.start && itemDate <= dateRange.end
  })

  // Handle drill down
  const handleDrilldown = useCallback(
    (dataPoint: CustomerDataPoint, category: "new" | "retained" | "churned") => {
      if (!enableDrilldown || !dataPoint.details) return
      setDrilldownData(dataPoint)
      setDrilldownCategory(category)
      setIsDrilldown(true)
    },
    [enableDrilldown, setDrilldownData, setIsDrilldown],
  )

  // Handle back from drill down
  const handleBackFromDrilldown = useCallback(() => {
    setIsDrilldown(false)
    setDrilldownData(null)
    setDrilldownCategory(null)
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
  let drilldownChartData: { name: string; value: number }[] = []

  if (isDrilldown && drilldownData?.details && drilldownCategory) {
    if (drilldownCategory === "new" && drilldownData.details.newCustomers) {
      drilldownChartData = drilldownData.details.newCustomers
    } else if (drilldownCategory === "retained" && drilldownData.details.retainedCustomers) {
      drilldownChartData = drilldownData.details.retainedCustomers
    } else if (drilldownCategory === "churned" && drilldownData.details.churnedCustomers) {
      drilldownChartData = drilldownData.details.churnedCustomers
    }
  }

  // Colors for pie chart
  const COLORS = ["#00AE98", "#4CAF50", "#F44336", "#0088FE", "#FFBB28", "#FF8042"]
  const categoryColors = {
    new: "#00AE98",
    retained: "#4CAF50",
    churned: "#F44336",
  }

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
          <CardTitle>
            {isDrilldown && drilldownCategory
              ? `${title}: ${drilldownData?.name} - ${drilldownCategory.charAt(0).toUpperCase() + drilldownCategory.slice(1)} Customers`
              : title}
          </CardTitle>
        </div>

        {!isDrilldown && (
          <div className="flex items-center space-x-2">
            <Button variant={chartType === "bar" ? "default" : "outline"} size="sm" onClick={() => setChartType("bar")}>
              <BarChartIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === "line" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
            >
              <LineChartIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {enableTimeRange && !isDrilldown && (
          <div className="mb-4">
            <TimeRangeSelector />
          </div>
        )}

        <div style={{ height: typeof height === "number" ? `${height}px` : height }}>
          <ResponsiveContainer width="100%" height="100%">
            {isDrilldown ? (
              <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <Pie
                  data={drilldownChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                >
                  {drilldownChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Count"]} />
                <Legend />
              </PieChart>
            ) : chartType === "bar" ? (
              <BarChart
                data={filteredData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                onMouseMove={(e) => {
                  if (e.activeTooltipIndex !== undefined) {
                    setActiveIndex(e.activeTooltipIndex)
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
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {`${entry.name}: ${entry.value}`}
                              {dataPoint?.details && enableDrilldown && (
                                <button
                                  className="ml-2 text-xs text-muted-foreground inline-flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (dataPoint && entry.dataKey) {
                                      handleDrilldown(dataPoint, entry.dataKey as "new" | "retained" | "churned")
                                    }
                                  }}
                                >
                                  <ZoomIn className="h-3 w-3 mr-1" /> Details
                                </button>
                              )}
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend
                  onClick={(entry) => {
                    if (activeIndex !== null && enableDrilldown && filteredData[activeIndex]?.details) {
                      handleDrilldown(filteredData[activeIndex], entry.dataKey as "new" | "retained" | "churned")
                    }
                  }}
                />
                <Bar
                  dataKey="new"
                  name="New Customers"
                  fill="#00AE98"
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="retained"
                  name="Retained"
                  fill="#4CAF50"
                  isAnimationActive={animated}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="churned"
                  name="Churned"
                  fill="#F44336"
                  isAnimationActive={animated}
                  animationDuration={600}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            ) : (
              <LineChart
                data={filteredData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                onMouseMove={(e) => {
                  if (e.activeTooltipIndex !== undefined) {
                    setActiveIndex(e.activeTooltipIndex)
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
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {`${entry.name}: ${entry.value}`}
                              {dataPoint?.details && enableDrilldown && (
                                <button
                                  className="ml-2 text-xs text-muted-foreground inline-flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (dataPoint && entry.dataKey) {
                                      handleDrilldown(dataPoint, entry.dataKey as "new" | "retained" | "churned")
                                    }
                                  }}
                                >
                                  <ZoomIn className="h-3 w-3 mr-1" /> Details
                                </button>
                              )}
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend
                  onClick={(entry) => {
                    if (activeIndex !== null && enableDrilldown && filteredData[activeIndex]?.details) {
                      handleDrilldown(filteredData[activeIndex], entry.dataKey as "new" | "retained" | "churned")
                    }
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="new"
                  name="New Customers"
                  stroke="#00AE98"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="retained"
                  name="Retained"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={animated}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="churned"
                  name="Churned"
                  stroke="#F44336"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={animated}
                  animationDuration={600}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {showTable && !isDrilldown && (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Period</th>
                  <th className="py-2 text-left">New</th>
                  <th className="py-2 text-left">Retained</th>
                  <th className="py-2 text-left">Churned</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{row.name}</td>
                    <td className="py-2">
                      {row.new}
                      {row.details?.newCustomers && enableDrilldown && (
                        <button
                          className="ml-2 text-xs text-muted-foreground inline-flex items-center"
                          onClick={() => handleDrilldown(row, "new")}
                        >
                          <ZoomIn className="h-3 w-3 mr-1" /> Details
                        </button>
                      )}
                    </td>
                    <td className="py-2">
                      {row.retained}
                      {row.details?.retainedCustomers && enableDrilldown && (
                        <button
                          className="ml-2 text-xs text-muted-foreground inline-flex items-center"
                          onClick={() => handleDrilldown(row, "retained")}
                        >
                          <ZoomIn className="h-3 w-3 mr-1" /> Details
                        </button>
                      )}
                    </td>
                    <td className="py-2">
                      {row.churned}
                      {row.details?.churnedCustomers && enableDrilldown && (
                        <button
                          className="ml-2 text-xs text-muted-foreground inline-flex items-center"
                          onClick={() => handleDrilldown(row, "churned")}
                        >
                          <ZoomIn className="h-3 w-3 mr-1" /> Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {enableDrilldown && !isDrilldown && !showTable && (
          <div className="mt-2 text-xs text-center text-muted-foreground">
            Click on legend items or use tooltip buttons to drill down
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function CustomerChart(props: CustomerChartProps) {
  return (
    <ChartProvider>
      <CustomerChartContent {...props} />
    </ChartProvider>
  )
}
