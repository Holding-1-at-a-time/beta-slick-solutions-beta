"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function ServiceAnalytics() {
  const serviceData = useQuery(query("getServiceUsageMetrics")) || []
  const isLoading = !serviceData

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Usage Metrics</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  // Sort data by usage count (descending)
  const sortedData = [...serviceData].sort((a, b) => b.usageCount - a.usageCount)

  // Format data for chart
  const chartData = sortedData.map((item) => ({
    name: item.serviceName,
    count: item.usageCount,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Usage Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Bar dataKey="count" name="Usage Count" fill="#707070" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
