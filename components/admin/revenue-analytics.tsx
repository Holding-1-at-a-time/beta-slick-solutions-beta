"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { RevenueChart, type RevenueDataPoint } from "@/components/charts"

export function RevenueAnalytics() {
  const revenueData = useQuery(query("getRevenueByMonth")) || []
  const isLoading = !revenueData

  // Sort data by month
  const sortedData = [...(revenueData || [])].sort((a, b) => {
    return a.month.localeCompare(b.month)
  })

  // Format data for chart
  const chartData: RevenueDataPoint[] = sortedData.map((item) => ({
    name: item.month,
    revenue: item.total,
  }))

  // Calculate total revenue
  const totalRevenue = revenueData?.reduce((sum, item) => sum + item.total, 0) || 0

  return <RevenueChart data={chartData} isLoading={isLoading} totalRevenue={totalRevenue} title="Revenue by Month" />
}
