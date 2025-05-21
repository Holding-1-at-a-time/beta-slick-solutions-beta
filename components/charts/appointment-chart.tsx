"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartProvider, useChartContext } from "./chart-context"
import { TimeRangeSelector } from "./time-range-selector"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ZoomIn, BarChartIcon, LineChartIcon, PieChartIcon } from "lucide-react"

export interface AppointmentDataPoint {
  name: string
  scheduled: number
  completed: number
  cancelled?: number
  date?: string | number // For filtering by date range
  details?: {
    byService?: { name: string; count: number }[]
    byStaff?: { name: string; count: number }[]
    byTimeOfDay?: { name: string; count: number }[]
  }
}

export interface AppointmentChartProps {
  data: AppointmentDataPoint[]
  title?: string
  isLoading?: boolean
  height?: number | string
  chartType?: "bar" | "line" | "pie"
  showCancelled?: boolean
  enableTimeRange?: boolean
  enableDrilldown?: boolean
  animated?: boolean
}

function AppointmentChartContent({
  data,
  title = "Appointment Metrics",
  isLoading = false,
  height = 300,
  chartType = "bar",
  showCancelled = true,
  enableTimeRange = true,
  enableDrilldown = true,
  animated = true,
}: AppointmentChartProps) {
  const { dateRange, isDrilldown, setIsDrilldown, drilldownData, setDrilldownData } = useChartContext()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [localChartType, setLocalChartType] = useState<"bar" | "line" | "pie">(chartType)
  const [drilldownView, setDrilldownView] = useState<"byService" | "byStaff" | "byTimeOfDay" | null>(null)

  // Filter data by date range if dates are provided
  const filteredData = data.filter((item) => {
    if (!item.date || !enableTimeRange) return true
    const itemDate = typeof item.date === "string" ? new Date(item.date).getTime() : item.date
    return itemDate >= dateRange.start && itemDate <= dateRange.end
  })

  // Handle drill down
  const handleDrilldown = useCallback(
    (dataPoint: AppointmentDataPoint, view: "byService" | "byStaff" | "byTimeOfDay") => {
      if (!enableDrilldown || !dataPoint.details) return
      setDrilldownData(dataPoint)
      setDrilldownView(view)
      setIsDrilldown(true)
    },
    [enableDrilldown, setDrilldownData, setIsDrilldown],
  )

  // Handle back from drill down
  const handleBackFromDrilldown = useCallback(() => {
    setIsDrilldown(false)
    setDrilldownData(null)
    setDrilldownView(null)
  }, [setIsDrilldown, setDrilldownData])

  // Toggle drill down view
  const toggleDrilldownView = useCallback((view: "byService" | "byStaff" | "byTimeOfDay") => {
    setDrilldownView(view)
  }, [])

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

  // Calculate completion rate
  const totalScheduled = filteredData.reduce((sum, item) => sum + item.scheduled, 0)
  const totalCompleted = filteredData.reduce((sum, item) => sum + item.completed, 0)
  const totalCancelled = filteredData.reduce((sum, item) => sum + (item.cancelled || 0), 0)
  const completionRate = totalScheduled > 0 ? (totalCompleted / totalScheduled) * 100 : 0

  // Prepare drill down data if available
  let drilldownChartData: { name: string; count: number }[] = []

  if (isDrilldown && drilldownData?.details && drilldownView) {
    if (drilldownView === "byService" && drilldownData.details.byService) {
      drilldownChartData = drilldownData.details.byService
    } else if (drilldownView === "byStaff" && drilldownData.details.byStaff) {
      drilldownChartData = drilldownData.details.byStaff
    } else if (drilldownView === "byTimeOfDay" && drilldownData.details.byTimeOfDay) {
      drilldownChartData = drilldownData.details.byTimeOfDay
    }
  }

  // Colors for pie chart
  const COLORS = ["#00AE98", "#4CAF50", "#F44336", "#0088FE", "#FFBB28", "#FF8042"]

  // Prepare data for pie chart view
  const pieData = [
    { name: "Completed", value: totalCompleted, color: "#00AE98" },
    { name: "Scheduled", value: totalScheduled - totalCompleted - totalCancelled, color: "#94a3b8" },
    ...(showCancelled ? [{ name: "Cancelled", value: totalCancelled, color: "#F44336" }] : []),
  ].filter((item) => item.value > 0)

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
            {isDrilldown
              ? `${title}: ${drilldownData?.name} - ${
                  drilldownView === "byService"
                    ? "By Service"
                    : drilldownView === "byStaff"
                      ? "By Staff"
                      : "By Time of Day"
                }`
              : title}
          </CardTitle>
        </div>

        <div className="flex items-center space-x-2">
          {!isDrilldown ? (
            <>
              <Button
                variant={localChartType === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setLocalChartType("bar")}
              >
                <BarChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={localChartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setLocalChartType("line")}
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={localChartType === "pie" ? "default" : "outline"}
                size="sm"
                onClick={() => setLocalChartType("pie")}
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={drilldownView === "byService" ? "default" : "outline"}
                size="sm"
                onClick={() => toggleDrilldownView("byService")}
                disabled={!drilldownData?.details?.byService}
              >
                Service
              </Button>
              <Button
                variant={drilldownView === "byStaff" ? "default" : "outline"}
                size="sm"
                onClick={() => toggleDrilldownView("byStaff")}
                disabled={!drilldownData?.details?.byStaff}
              >
                Staff
              </Button>
              <Button
                variant={drilldownView === "byTimeOfDay" ? "default" : "outline"}
                size="sm"
                onClick={() => toggleDrilldownView("byTimeOfDay")}
                disabled={!drilldownData?.details?.byTimeOfDay}
              >
                Time
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

        <div className="mb-4 flex flex-wrap gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Total Scheduled</span>
            <div className="text-2xl font-bold">{totalScheduled}</div>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Total Completed</span>
            <div className="text-2xl font-bold">{totalCompleted}</div>
          </div>
          {showCancelled && (
            <div>
              <span className="text-sm text-muted-foreground">Total Cancelled</span>
              <div className="text-2xl font-bold">{totalCancelled}</div>
            </div>
          )}
          <div>
            <span className="text-sm text-muted-foreground">Completion Rate</span>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
          </div>
        </div>

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
                  name="Count"
                  fill="#00AE98"
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            ) : localChartType === "pie" ? (
              <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <Pie
                  data={pieData}
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
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Count"]} />
                <Legend />
              </PieChart>
            ) : localChartType === "bar" ? (
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
                            </p>
                          ))}
                          {dataPoint?.details && enableDrilldown && (
                            <div className="mt-2 grid grid-cols-3 gap-1">
                              {dataPoint.details.byService && (
                                <button
                                  className="text-xs text-muted-foreground inline-flex items-center"
                                  onClick={() => handleDrilldown(dataPoint, "byService")}
                                >
                                  <ZoomIn className="h-3 w-3 mr-1" /> By Service
                                </button>
                              )}
                              {dataPoint.details.byStaff && (
                                <button
                                  className="text-xs text-muted-foreground inline-flex items-center"
                                  onClick={() => handleDrilldown(dataPoint, "byStaff")}
                                >
                                  <ZoomIn className="h-3 w-3 mr-1" /> By Staff
                                </button>
                              )}
                              {dataPoint.details.byTimeOfDay && (
                                <button
                                  className="text-xs text-muted-foreground inline-flex items-center"
                                  onClick={() => handleDrilldown(dataPoint, "byTimeOfDay")}
                                >
                                  <ZoomIn className="h-3 w-3 mr-1" /> By Time
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Bar
                  dataKey="scheduled"
                  name="Scheduled"
                  fill="#94a3b8"
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#00AE98"
                  isAnimationActive={animated}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
                {showCancelled && (
                  <Bar
                    dataKey="cancelled"
                    name="Cancelled"
                    fill="#F44336"
                    isAnimationActive={animated}
                    animationDuration={600}
                    animationEasing="ease-in-out"
                  />
                )}
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
                            </p>
                          ))}
                          {dataPoint?.details && enableDrilldown && (
                            <div className="mt-2 grid grid-cols-3 gap-1">
                              {dataPoint.details.byService && (
                                <button
                                  className="text-xs text-muted-foreground inline-flex items-center"
                                  onClick={() => handleDrilldown(dataPoint, "byService")}
                                >
                                  <ZoomIn className="h-3 w-3 mr-1" /> By Service
                                </button>
                              )}
                              {dataPoint.details.byStaff && (
                                <button
                                  className="text-xs text-muted-foreground inline-flex items-center"
                                  onClick={() => handleDrilldown(dataPoint, "byStaff")}
                                >
                                  <ZoomIn className="h-3 w-3 mr-1" /> By Staff
                                </button>
                              )}
                              {dataPoint.details.byTimeOfDay && (
                                <button
                                  className="text-xs text-muted-foreground inline-flex items-center"
                                  onClick={() => handleDrilldown(dataPoint, "byTimeOfDay")}
                                >
                                  <ZoomIn className="h-3 w-3 mr-1" /> By Time
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="scheduled"
                  name="Scheduled"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={animated}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="#00AE98"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={animated}
                  animationDuration={800}
                  animationEasing="ease-in-out"
                />
                {showCancelled && (
                  <Line
                    type="monotone"
                    dataKey="cancelled"
                    name="Cancelled"
                    stroke="#F44336"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    isAnimationActive={animated}
                    animationDuration={600}
                    animationEasing="ease-in-out"
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {enableDrilldown && !isDrilldown && (
          <div className="mt-2 text-xs text-center text-muted-foreground">
            Use tooltips to drill down into appointment details
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function AppointmentChart(props: AppointmentChartProps) {
  return (
    <ChartProvider>
      <AppointmentChartContent {...props} />
    </ChartProvider>
  )
}
