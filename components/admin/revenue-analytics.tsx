"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatCurrency } from "@/lib/utils/format-currency"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function RevenueAnalytics() {
  const revenueData = useQuery(query("getRevenueByMonth")) || []
  const isLoading = !revenueData

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Month</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  // Sort data by month
  const sortedData = [...revenueData].sort((a, b) => {
    return a.month.localeCompare(b.month)
  })

  // Format data for chart
  const chartData = sortedData.map((item) => ({
    name: item.month,
    revenue: item.total,
  }))

  // Calculate total revenue
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.total, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-sm text-muted-foreground">Total Revenue</span>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value, { notation: "compact" })} />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="#00AE98" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
