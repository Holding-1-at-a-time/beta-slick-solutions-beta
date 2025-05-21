"use client"

import { useMemberAnalytics } from "@/hooks/useMember"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import AIInsightsAgent from "./ai-insights-agent"
import { formatCurrency } from "@/lib/utils/format-currency"

export default function MemberAnalytics() {
  const { analytics: dayAnalytics, isLoading: dayLoading } = useMemberAnalytics("day")
  const { analytics: weekAnalytics, isLoading: weekLoading } = useMemberAnalytics("week")
  const { analytics: monthAnalytics, isLoading: monthLoading } = useMemberAnalytics("month")

  const renderAnalyticsCard = (analytics: any, isLoading: boolean, period: string) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )
    }

    if (!analytics) {
      return <p className="text-gray-500">Error loading analytics data.</p>
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Appointments</p>
          <p className="text-3xl font-bold">{analytics.totalAppointments}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-3xl font-bold">{analytics.completedAppointments}</p>
          <p className="text-sm text-gray-500">{analytics.completionRate.toFixed(1)}% completion rate</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-gray-500">Average Invoice</p>
          <p className="text-3xl font-bold">{formatCurrency(analytics.averageInvoice)}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Insights</h1>

      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="day">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="pt-4">
          {renderAnalyticsCard(dayAnalytics, dayLoading, "day")}
        </TabsContent>

        <TabsContent value="week" className="pt-4">
          {renderAnalyticsCard(weekAnalytics, weekLoading, "week")}
        </TabsContent>

        <TabsContent value="month" className="pt-4">
          {renderAnalyticsCard(monthAnalytics, monthLoading, "month")}
        </TabsContent>
      </Tabs>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
        <AIInsightsAgent />
      </Card>
    </div>
  )
}
