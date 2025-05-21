"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { AppointmentChart, type AppointmentDataPoint } from "@/components/charts"

export function AppointmentAnalytics() {
  const appointmentData = useQuery(query("getAppointmentMetrics")) || []
  const isLoading = !appointmentData

  // Sort data by date
  const sortedData = [...(appointmentData || [])].sort((a, b) => {
    return a.period.localeCompare(b.period)
  })

  // Format data for chart
  const chartData: AppointmentDataPoint[] = sortedData.map((item) => ({
    name: item.period,
    scheduled: item.scheduled,
    completed: item.completed,
    cancelled: item.cancelled,
  }))

  return (
    <AppointmentChart data={chartData} isLoading={isLoading} title="Appointment Metrics" chartType="bar" height={300} />
  )
}
