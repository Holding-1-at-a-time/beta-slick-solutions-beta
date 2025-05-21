"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AIInsightsAgent } from "./ai-insights-agent"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MemberAnalytics({
  orgId,
}: {
  orgId: string
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-muted-foreground">Completed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$4,280</div>
            <p className="text-muted-foreground">Generated this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Turnaround</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.8 days</div>
            <p className="text-muted-foreground">From assessment to completion</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="insights">
            <TabsList className="mb-4">
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="insights">
              <AIInsightsAgent orgId={orgId} />
            </TabsContent>

            <TabsContent value="trends">
              <div className="h-80 flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Trend visualization will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
