"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { FileText, AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react"

interface VehicleAssessmentsProps {
  orgId: string
  vehicleId: string
}

export function VehicleAssessments({ orgId, vehicleId }: VehicleAssessmentsProps) {
  const assessments = useQuery(api.assessments.listVehicleAssessments, { orgId, vehicleId }) || []

  if (assessments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No assessments yet</h3>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          This vehicle doesn't have any assessments yet. Request an assessment to get started.
        </p>
        <Link
          href={`/org/${orgId}/dashboard/client/vehicles/${vehicleId}/assessments/new`}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Request Assessment
        </Link>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in_progress":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "completed":
        return "Completed"
      case "in_progress":
        return "In Progress"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      {assessments.map((assessment) => (
        <div
          key={assessment._id}
          className="flex items-center justify-between rounded-md border p-4 transition-colors hover:bg-accent/50"
        >
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Assessment #{assessment._id.slice(-6).toUpperCase()}</h4>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">{new Date(assessment.createdAt).toLocaleDateString()}</p>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(assessment.status)}
                  <p className="text-sm">{getStatusText(assessment.status)}</p>
                </div>
              </div>
            </div>
          </div>
          <Link
            href={`/org/${orgId}/dashboard/client/vehicles/${vehicleId}/assessments/${assessment._id}`}
            className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      ))}
    </div>
  )
}
