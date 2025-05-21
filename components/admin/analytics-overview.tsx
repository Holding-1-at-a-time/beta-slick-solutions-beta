"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RevenueAnalytics } from "./revenue-analytics"
import { ServiceAnalytics } from "./service-analytics"
import { CustomerAnalytics } from "./customer-analytics"
import { AppointmentAnalytics } from "./appointment-analytics"
import { AIInsights } from "./ai-insights"

export function AnalyticsOverview() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6 pt-4">
          <RevenueAnalytics />
          <AIInsights />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6 pt-4">
          <CustomerAnalytics />
        </TabsContent>

        <TabsContent value="services" className="space-y-6 pt-4">
          <ServiceAnalytics />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6 pt-4">
          <AppointmentAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
