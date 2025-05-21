"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ChartFactory } from "@/components/charts/chart-factory"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

export function AnalyticsDashboard({ tenantId }: { tenantId: string }) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Revenue data
  const revenueData =
    useQuery(api.analytics.getRevenueByMonth, {
      tenantId,
      timeRange,
    }) || []

  // Service data
  const serviceData =
    useQuery(api.analytics.getServiceUsageMetrics, {
      tenantId,
      timeRange,
    }) || []

  // Customer data
  const customerData =
    useQuery(api.analytics.getCustomerAcquisitionMetrics, {
      tenantId,
      timeRange,
    }) || []

  // Appointment data
  const appointmentData =
    useQuery(api.analytics.getAppointmentMetrics, {
      tenantId,
      timeRange,
    }) || []

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // In a real implementation, this would invalidate the queries
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const handleExport = () => {
    // In a real implementation, this would export the data to CSV/PDF
    alert("Export functionality would be implemented here")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">View and analyze your business performance</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartFactory
          chartProps={{
            type: "revenue",
            data: revenueData,
            title: "Revenue Overview",
            height: 300,
            enableTimeRange: false,
          }}
        />

        <ChartFactory
          chartProps={{
            type: "appointment",
            data: appointmentData,
            title: "Appointment Metrics",
            height: 300,
            enableTimeRange: false,
          }}
        />
      </div>

      <Tabs defaultValue="services">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="mt-6">
          <ChartFactory
            chartProps={{
              type: "service",
              data: serviceData,
              title: "Service Usage",
              height: 400,
              enableTimeRange: false,
            }}
          />
        </TabsContent>

        <TabsContent value="customers" className="mt-6">
          <ChartFactory
            chartProps={{
              type: "customer",
              data: customerData,
              title: "Customer Metrics",
              height: 400,
              showTable: true,
              enableTimeRange: false,
            }}
          />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>AI-generated insights based on your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Revenue Growth</h3>
              <p className="text-sm text-muted-foreground">
                Your revenue has increased by 12% compared to the previous period. The top performing service is "Oil
                Change" with 24% of total revenue.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Customer Retention</h3>
              <p className="text-sm text-muted-foreground">
                Your customer retention rate is 78%, which is 5% higher than the industry average. Consider implementing
                a loyalty program to further improve retention.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Appointment Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Tuesday and Thursday mornings have the highest appointment completion rates. Consider offering
                incentives for appointments during slower periods.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
