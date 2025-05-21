"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle, Clock, PenToolIcon as Tool, ArrowRight } from "lucide-react"

interface AssessmentReviewProps {
  orgId: string
  vehicleId: string
  assessmentId: string
}

export function AssessmentReview({ orgId, vehicleId, assessmentId }: AssessmentReviewProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const assessmentDetails = useQuery(api.assessmentDetails.getAssessmentDetails, {
    orgId,
    assessmentId: assessmentId as Id<"assessments">,
  })

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    revision_requested: "bg-purple-100 text-purple-800",
    estimate_approved: "bg-green-100 text-green-800",
  }

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4 mr-1" />,
    in_progress: <Tool className="w-4 h-4 mr-1" />,
    completed: <CheckCircle className="w-4 h-4 mr-1" />,
    revision_requested: <AlertCircle className="w-4 h-4 mr-1" />,
    estimate_approved: <CheckCircle className="w-4 h-4 mr-1" />,
  }

  const severityColors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
    critical: "bg-red-500 text-white",
  }

  if (!assessmentDetails) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { assessment, vehicle, issues, estimate } = assessmentDetails

  const navigateToEstimate = () => {
    setIsLoading(true)
    router.push(`/org/${orgId}/dashboard/client/vehicles/${vehicleId}/assessments/${assessmentId}/estimate`)
  }

  const navigateToRevisions = () => {
    setIsLoading(true)
    router.push(`/org/${orgId}/dashboard/client/vehicles/${vehicleId}/assessments/${assessmentId}/revisions`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Assessment Review</CardTitle>
              <CardDescription>
                {vehicle.year} {vehicle.make} {vehicle.model} -{" "}
                {assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString() : "N/A"}
              </CardDescription>
            </div>
            <Badge className={statusColors[assessment.status] || "bg-gray-100"}>
              {statusIcons[assessment.status]}
              {assessment.status.replace("_", " ").charAt(0).toUpperCase() +
                assessment.status.replace("_", " ").slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1">{assessment.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI-Detected Issues</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <p className="text-gray-500 italic">No issues detected yet. Assessment is being processed.</p>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div key={issue._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{issue.title}</h3>
                    <Badge className={severityColors[issue.severity] || "bg-gray-100"}>{issue.severity}</Badge>
                  </div>
                  <p className="mt-2 text-gray-600">{issue.description}</p>
                  {issue.estimatedCost && (
                    <p className="mt-2 font-medium">Estimated cost: ${issue.estimatedCost.toFixed(2)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={navigateToRevisions}
            disabled={isLoading || assessment.status === "pending" || issues.length === 0}
          >
            Request Revision
          </Button>
          <Button
            onClick={navigateToEstimate}
            disabled={isLoading || assessment.status === "pending" || issues.length === 0}
          >
            View Estimate <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
