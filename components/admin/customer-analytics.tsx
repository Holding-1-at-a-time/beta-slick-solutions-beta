"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { CustomerChart, type CustomerDataPoint } from "@/components/charts"

export function CustomerAnalytics() {
  const customerData = useQuery(query("getCustomerAcquisitionMetrics")) || []
  const isLoading = !customerData

  // Sort data by month
  const sortedData = [...(customerData || [])].sort((a, b) => {
    return a.month.localeCompare(b.month)
  })

  // Format data for chart
  const chartData: CustomerDataPoint[] = sortedData.map((item) => ({
    name: item.month,
    new: item.newCustomers,
    retained: item.retained,
    churned: item.churned,
  }))

  return (
    <CustomerChart
      data={chartData}
      isLoading={isLoading}
      title="Customer Acquisition & Retention"
      showTable={true}
      height={250}
    />
  )
}
