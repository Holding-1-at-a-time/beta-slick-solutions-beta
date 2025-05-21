"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { ServiceChart, type ServiceDataPoint } from "@/components/charts"

export function ServiceAnalytics() {
  const serviceData = useQuery(query("getServiceUsageMetrics")) || []
  const isLoading = !serviceData

  // Sort data by usage count (descending)
  const sortedData = [...(serviceData || [])].sort((a, b) => b.usageCount - a.usageCount)

  // Format data for chart
  const chartData: ServiceDataPoint[] = sortedData.map((item) => ({
    name: item.serviceName,
    count: item.usageCount,
  }))

  return (
    <ServiceChart data={chartData} isLoading={isLoading} title="Service Usage Metrics" layout="vertical" height={300} />
  )
}
