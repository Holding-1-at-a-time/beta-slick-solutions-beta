"use client"

import { useAssessment } from "@/hooks/useMember"
import AIAnalysisAgent from "./ai-analysis-agent"
import ServiceSelection from "./service-selection"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils/format-date"
import type { Id } from "@/convex/_generated/dataModel"

export default function ReviewAssessment({
  assessmentId,
}: {
  assessmentId: Id<"assessments">
}) {
  const { assessment, isLoading } = useAssessment(assessmentId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!assessment) {
    return <div>Assessment not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assessment Review</h1>
        <div className="text-sm text-gray-500">Submitted on {formatDate(assessment.createdAt)}</div>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Make & Model</p>
            <p>
              {assessment.vehicle?.make} {assessment.vehicle?.model}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Year</p>
            <p>{assessment.vehicle?.year}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Color</p>
            <p>{assessment.vehicle?.color}</p>
          </div>
          {assessment.vehicle?.licensePlate && (
            <div>
              <p className="text-sm text-gray-500">License Plate</p>
              <p>{assessment.vehicle.licensePlate}</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">AI Analysis</h2>
        <AIAnalysisAgent assessmentId={assessmentId} />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Service Estimate</h2>
        <ServiceSelection assessmentId={assessmentId} />
      </Card>
    </div>
  )
}
