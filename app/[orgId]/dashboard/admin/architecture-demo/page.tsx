"use client"

import { useState } from "react"
import { AppProviders } from "@/components/providers/app-providers"
import { FormFactory } from "@/components/forms/form-factory"
import { ChartFactory } from "@/components/charts/chart-factory"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ArchitectureDemoPage({ params }: { params: { orgId: string } }) {
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([])

  // Sample data for charts
  const revenueData = [
    { name: "Jan", revenue: 4000, date: "2023-01-15" },
    { name: "Feb", revenue: 3000, date: "2023-02-15" },
    { name: "Mar", revenue: 5000, date: "2023-03-15" },
    { name: "Apr", revenue: 2780, date: "2023-04-15" },
    { name: "May", revenue: 1890, date: "2023-05-15" },
    { name: "Jun", revenue: 2390, date: "2023-06-15" },
    { name: "Jul", revenue: 3490, date: "2023-07-15" },
  ]

  const serviceData = [
    { name: "Oil Change", count: 240, date: "2023-07-15" },
    { name: "Brake Service", count: 180, date: "2023-07-15" },
    { name: "Tire Rotation", count: 150, date: "2023-07-15" },
    { name: "Engine Tune-up", count: 120, date: "2023-07-15" },
    { name: "A/C Service", count: 87, date: "2023-07-15" },
  ]

  const customerData = [
    { name: "Jan", new: 40, retained: 120, churned: 5, date: "2023-01-15" },
    { name: "Feb", new: 30, retained: 130, churned: 10, date: "2023-02-15" },
    { name: "Mar", new: 50, retained: 140, churned: 15, date: "2023-03-15" },
    { name: "Apr", new: 27, retained: 150, churned: 8, date: "2023-04-15" },
    { name: "May", new: 18, retained: 160, churned: 12, date: "2023-05-15" },
    { name: "Jun", new: 23, retained: 170, churned: 7, date: "2023-06-15" },
    { name: "Jul", new: 34, retained: 180, churned: 9, date: "2023-07-15" },
  ]

  const appointmentData = [
    { name: "Jan", scheduled: 65, completed: 40, cancelled: 25, date: "2023-01-15" },
    { name: "Feb", scheduled: 59, completed: 45, cancelled: 14, date: "2023-02-15" },
    { name: "Mar", scheduled: 80, completed: 60, cancelled: 20, date: "2023-03-15" },
    { name: "Apr", scheduled: 81, completed: 55, cancelled: 26, date: "2023-04-15" },
    { name: "May", scheduled: 56, completed: 40, cancelled: 16, date: "2023-05-15" },
    { name: "Jun", scheduled: 55, completed: 45, cancelled: 10, date: "2023-06-15" },
    { name: "Jul", scheduled: 40, completed: 30, cancelled: 10, date: "2023-07-15" },
  ]

  return (
    <AppProviders tenantId={params.orgId} layoutType="admin">
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-3xl font-bold">Architecture Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates the usage of the modular architecture components.
        </p>

        <Tabs defaultValue="providers">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Structural Providers</CardTitle>
                <CardDescription>Composable provider wrappers for Auth, Tenant, and Layout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">AuthProvider</h3>
                    <p className="text-sm text-muted-foreground">
                      Manages authentication state and provides user information to child components.
                    </p>
                    <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-x-auto">
                      {`<AuthProvider>
  <YourComponent />
</AuthProvider>`}
                    </pre>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">TenantProvider</h3>
                    <p className="text-sm text-muted-foreground">
                      Manages tenant/organization context and provides tenant information to child components.
                    </p>
                    <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-x-auto">
                      {`<TenantProvider tenantId={tenantId}>
  <YourComponent />
</TenantProvider>`}
                    </pre>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">LayoutProvider</h3>
                    <p className="text-sm text-muted-foreground">
                      Manages layout state and provides layout information to child components.
                    </p>
                    <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-x-auto">
                      {`<LayoutProvider layoutType="dashboard">
  <YourComponent />
</LayoutProvider>`}
                    </pre>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">AppProviders (Combined)</h3>
                    <p className="text-sm text-muted-foreground">Combines all providers for easy usage.</p>
                    <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-x-auto">
                      {`<AppProviders 
  tenantId={tenantId}
  requireAuth={true}
  requireTenant={true}
  layoutType="dashboard"
>
  <YourComponent />
</AppProviders>`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Factory</CardTitle>
                <CardDescription>Unified interface for rendering different form types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">FormFactory Usage</h3>
                    <p className="text-sm text-muted-foreground">
                      The FormFactory component provides a unified interface for rendering different form types.
                    </p>
                    <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-x-auto">
                      {`<FormFactory 
  formProps={{
    type: "vehicle",
    userId: "user123",
    tenantId: "tenant456",
    onSuccess: (vehicle) => console.log(vehicle)
  }}
/>`}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="font-medium mb-4">Vehicle Form Example</h3>
                      <FormFactory
                        formProps={{
                          type: "vehicle",
                          userId: "user123",
                          tenantId: params.orgId,
                          onSuccess: (vehicle) => console.log(vehicle),
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Signature Pad Example</h3>
                      <FormFactory
                        formProps={{
                          type: "signature",
                          onSign: (data) => setSignatureData(data),
                          height: 150,
                        }}
                      />
                      {signatureData && (
                        <div className="mt-4">
                          <p className="text-sm mb-2">Captured Signature:</p>
                          <img
                            src={signatureData || "/placeholder.svg"}
                            alt="Signature"
                            className="border rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Media Uploader Example</h3>
                    <FormFactory
                      formProps={{
                        type: "media",
                        vehicleId: "vehicle123",
                        tenantId: params.orgId,
                        onUpload: (mediaId) => setUploadedMediaIds((prev) => [...prev, mediaId]),
                        maxFiles: 5,
                        previewSize: "sm",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chart Factory</CardTitle>
                <CardDescription>Unified interface for rendering different chart types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium">ChartFactory Usage</h3>
                    <p className="text-sm text-muted-foreground">
                      The ChartFactory component provides a unified interface for rendering different chart types.
                    </p>
                    <pre className="mt-2 p-2 bg-muted rounded-md text-xs overflow-x-auto">
                      {`<ChartFactory 
  chartProps={{
    type: "revenue",
    data: revenueData,
    title: "Revenue Overview",
    height: 300,
    enableTimeRange: true,
  }}
/>`}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="font-medium mb-4">Revenue Chart Example</h3>
                      <ChartFactory
                        chartProps={{
                          type: "revenue",
                          data: revenueData,
                          title: "Revenue Overview",
                          height: 300,
                          enableTimeRange: true,
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Service Chart Example</h3>
                      <ChartFactory
                        chartProps={{
                          type: "service",
                          data: serviceData,
                          title: "Service Usage",
                          height: 300,
                          enableTimeRange: true,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h3 className="font-medium mb-4">Customer Chart Example</h3>
                      <ChartFactory
                        chartProps={{
                          type: "customer",
                          data: customerData,
                          title: "Customer Metrics",
                          height: 300,
                          enableTimeRange: true,
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Appointment Chart Example</h3>
                      <ChartFactory
                        chartProps={{
                          type: "appointment",
                          data: appointmentData,
                          title: "Appointment Metrics",
                          height: 300,
                          enableTimeRange: true,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Custom Chart Example</h3>
                    <ChartFactory
                      chartProps={{
                        type: "custom",
                        title: "Custom Chart",
                        renderChart: () => (
                          <div className="h-[300px] flex items-center justify-center bg-muted rounded-lg">
                            <p className="text-lg font-medium">Custom Chart Rendering</p>
                          </div>
                        ),
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <AnalyticsDashboard tenantId={params.orgId} />
          </TabsContent>
        </Tabs>
      </div>
    </AppProviders>
  )
}
