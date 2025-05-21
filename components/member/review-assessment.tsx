"use client"

import { useQuery } from "convex/react"
import { query } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { AIAnalysisAgent } from "./ai-analysis-agent"
import { ServiceSelection } from "./service-selection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export function ReviewAssessment({
  orgId,
  assessmentId,
}: {
  orgId: string
  assessmentId: string
}) {
  const { user } = useUser()
  const userId = user?.id || ""

  const assessment = useQuery(query("getAssessment"), orgId, userId, assessmentId)

  if (!assessment) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Review Assessment</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Customer</dt>
                <dd className="font-medium">{assessment.customerName}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Vehicle</dt>
                <dd>
                  {assessment.vehicleMake} {assessment.vehicleModel} ({assessment.vehicleYear})
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Date Submitted</dt>
                <dd>{new Date(assessment.createdAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Assessment Review</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="analysis">
              <TabsList className="mb-4">
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="services">Service Selection</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis">
                <AIAnalysisAgent assessmentId={assessmentId} orgId={orgId} />
              </TabsContent>

              <TabsContent value="services">
                <ServiceSelection assessmentId={assessmentId} orgId={orgId} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
